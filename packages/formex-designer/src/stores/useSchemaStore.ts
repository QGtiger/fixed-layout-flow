import { deepClone } from "@/utils";
import { createContext, useContext } from "react";
import { createStore, useStore } from "zustand";
import { debounce } from "lodash-es";

function getNearNumByArr(arr: [number, number], num: number) {
  const [min, max] = arr;
  if (num < min) return min;
  if (num > max) return max;
  return num;
}

interface SchemaState {
  schema: FormexSchema;
  setSchema: (schema: FormexSchema) => void;

  overPlacement: "top" | "bottom";
  overComponentId: string;

  selectedComponentId: string;
}

interface SchemaAction {
  insertFormItem: (materialItem: MaterialItem) => void;
  swapFormItem: (dragItemId: string, hoverItemId: string) => void;

  setOverComponentId: (componentId: string) => void;
  setOverComponentPlacement: (placement: "top" | "bottom") => void;

  setSelectedComponentId: (componentId: string) => void;

  getMaterialItemByComponentId: (
    componentId: string,
    materialMap: Record<string, MaterialItem>
  ) => MaterialItem | undefined;
  getFormexItemByComponentId: (componentId: string) => FormexItem | undefined;

  updateFormexItemByComponentId: (componentId: string, values: any) => void;

  getFormexItemIndexByComponentId: (componentId: string) => number;

  deleteFormexItemByComponentId: (componentId: string) => void;
}

export interface SchemaStoreConfig {
  initialSchema?: FormexSchema;
  onChange?: (schema: FormexSchema) => void;
}

export const defaultSchema: FormexSchema = {
  version: "1.0",
  formItems: [
    {
      id: "banner",
      code: "banner",
    },
    {
      id: "form",
      code: "form",
      children: [
        {
          id: "title",
          code: "title",
        },
        {
          id: "subtitle",
          code: "subtitle",
        },
        {
          id: "submit",
          code: "submit",
        },
      ],
    },
  ],
};

export function createSchemaStore(config: SchemaStoreConfig) {
  const { initialSchema = defaultSchema, onChange } = config;
  const store = createStore<SchemaState & SchemaAction>((set, get) => {
    const getFormexItemsWithForm = () => {
      const { schema } = get();
      const { formItems } = schema;

      return formItems.find((it) => it.id === "form")?.children || [];
    };

    const getFormexItemById = (
      id: string,
      formexItems: FormexItem[]
    ): FormexItem | undefined => {
      if (!id) return;

      for (const item of formexItems) {
        if (item.id == id) return item;
        if (item.children && item.children.length > 0) {
          const result = getFormexItemById(id, item.children);
          if (result !== null) return result;
        }
      }
      return;
    };

    const setSelectedComponentId: SchemaAction["setSelectedComponentId"] = (
      componentId
    ) => {
      set((prev) => {
        return {
          ...prev,
          selectedComponentId: componentId,
        };
      });
    };

    const getFormexItemByComponentId: SchemaAction["getFormexItemByComponentId"] =
      (componentId) => {
        return getFormexItemById(componentId, get().schema.formItems);
      };

    const forceUpdate = debounce(() => {
      set({ ...get() });
      onChange?.(get().schema);
    }, 200);

    return {
      schema: deepClone(initialSchema),
      setSchema: (schema) => set({ schema }),

      overComponentId: "",
      overPlacement: "top",
      setOverComponentId: (componentId) => {
        set((prev) => {
          return {
            ...prev,
            overComponentId: componentId,
          };
        });
      },
      setOverComponentPlacement: (placement) => {
        set((prev) => {
          return {
            ...prev,
            overPlacement: placement,
          };
        });
      },

      swapFormItem: (dragItemId: string, hoverItemId: string) => {
        const { overPlacement } = get();
        const formItems = getFormexItemsWithForm();

        const dragIndex = formItems.findIndex((it) => it.id === dragItemId);
        let hoverIndex = formItems.findIndex((it) => it.id === hoverItemId);

        if (dragIndex !== -1 && hoverIndex !== -1) {
          // 拷贝一份
          const dragItemClone = {
            ...formItems[dragIndex],
          };

          formItems.splice(dragIndex, 1);

          // 重新计算 hoverIndex
          hoverIndex = formItems.findIndex((it) => it.id === hoverItemId);
          if (hoverIndex !== -1) {
            const insertIndex =
              overPlacement === "top" ? hoverIndex : hoverIndex + 1;

            formItems.splice(insertIndex, 0, dragItemClone);
          }

          setSelectedComponentId(dragItemClone.id);

          forceUpdate();
        }
      },

      insertFormItem(materialItem: MaterialItem) {
        const { overComponentId, overPlacement, selectedComponentId } = get();

        const insertId = overComponentId || selectedComponentId;
        const insertPlacement = overComponentId ? overPlacement : "bottom";

        const formItems = getFormexItemsWithForm();

        const newItem: FormexItem = {
          code: materialItem.code,
          id: `${materialItem.code}-${Date.now()}`,
          props: {
            ...materialItem.defaultProps,
          },
        };

        const index = formItems.findIndex((it) => it.id === insertId);

        // TODO 只能添加 到 form 组件下 排除 title 和 subtitle
        const insertIndex = getNearNumByArr(
          [2, formItems.length - 1],
          insertPlacement === "top" ? index : index + 1
        );

        formItems.splice(insertIndex, 0, newItem);

        setSelectedComponentId(newItem.id);

        forceUpdate();
      },

      selectedComponentId: "",
      setSelectedComponentId,
      getMaterialItemByComponentId: (componentId, materialMap) => {
        const item = getFormexItemByComponentId(componentId);
        if (!item) return;

        const materialItem = materialMap[item.code];
        if (!materialItem) return;

        return materialItem;
      },
      getFormexItemByComponentId,

      updateFormexItemByComponentId(componentId, values) {
        const formexItem = getFormexItemByComponentId(componentId);
        if (!formexItem) return;
        formexItem.props = formexItem.props || {};
        Object.assign(formexItem.props, values);

        forceUpdate();
      },

      getFormexItemIndexByComponentId(componentId) {
        const formexItems = getFormexItemsWithForm();
        return formexItems.findIndex((it) => it.id === componentId);
      },

      deleteFormexItemByComponentId(componentId) {
        const formexItems = getFormexItemsWithForm();
        const index = formexItems.findIndex((it) => it.id === componentId);
        if (index !== -1) {
          formexItems.splice(index, 1);
          forceUpdate();
        }
      },
    };
  });
  return store;
}

export type SchemaStore = ReturnType<typeof createSchemaStore>;

export const StoreContext = createContext<SchemaStore>({} as any);

export const useSchemaStore = () => {
  const store = useContext(StoreContext);
  return useStore(store);
};
