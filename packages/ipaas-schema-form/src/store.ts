import { Input, InputNumber } from "antd";
import React, { ComponentType, createContext, useContext } from "react";
import { createStore, useStore } from "zustand";
import DefaultValueWarpper from "./utils/DefaulValueWarpper";
import { useCreation } from "ahooks";
import CustomSelect from "./components/material/CustomSelect";
import CustomMultiSelect from "./components/material/CustomMultiSelect";
import CustomDatetimePicker from "./components/material/CustomDatetimePicker";
import { IPaasFormSchema } from "./type";
import DynamicForm from "./components/material/DynamicForm";
import CustomUpload from "./components/material/CustomUpload";
import CustomInputWithCopy from "./components/material/CustomInputWithCopy";

interface IpaasSchemaStoreState {
  editorMap: Record<string, ComponentType<any>>;
  dynamicDebounce: number;
  uploadFile?: (file: File) => Promise<string>;
  editorLayoutWithDesc?: (
    node1: React.ReactNode,
    node2: React.ReactNode
  ) => React.ReactNode;

  commonEditorWarpper?: (
    Component: ComponentType<{
      value: any;
      onChange: (value: any) => void;
    }>
  ) => ComponentType<{
    value: any;
    onChange: (value: any) => void;
  }>; // 通用编辑器包装器

  dynamicScriptExcuteWithOptions?: (config: {
    script: string;
    extParams: Record<string, any>;
  }) => Promise<{ value: any; label: any }[]>;
  dynamicScriptExcuteWithFormSchema?: (config: {
    script: string;
  }) => Promise<IPaasFormSchema[]>;

  normalize: (value: any) => any; // 用于规范化值的函数
}

interface IpaasSchemaStoreActions {
  injectEditorMap: (editorMap: Record<string, ComponentType<any>>) => void;
}

export type IpaasSchemaStoreConfig = Partial<IpaasSchemaStoreState> & {};

export type IpaasSchemaStoreType = ReturnType<typeof createIpaasSchemaStore>;

export const StoreContext = createContext<IpaasSchemaStoreType>({} as any);

function ClearExtraAttributeWarpper(Comp: ComponentType<any>) {
  return function ClearExtraAttributeComp(props: any) {
    const { selectcache, defaultValue, ...restProps } = props;
    return React.createElement(Comp, {
      ...restProps,
    });
  };
}

export function createIpaasSchemaStore(config: IpaasSchemaStoreConfig) {
  const store = createStore<IpaasSchemaStoreState & IpaasSchemaStoreActions>(
    (set, get) => {
      return {
        ...config,
        editorMap: {
          Input: DefaultValueWarpper(ClearExtraAttributeWarpper(Input)),
          InputNumber: DefaultValueWarpper(
            ClearExtraAttributeWarpper((props: any) => {
              return React.createElement(InputNumber, {
                style: { width: "100%" },
                ...props,
              });
            })
          ),
          Textarea: DefaultValueWarpper(
            ClearExtraAttributeWarpper(Input.TextArea)
          ),
          DatetimePicker: ClearExtraAttributeWarpper(CustomDatetimePicker),
          Select: DefaultValueWarpper(ClearExtraAttributeWarpper(CustomSelect)),
          MultiSelect: DefaultValueWarpper(
            ClearExtraAttributeWarpper(CustomMultiSelect)
          ),
          DynamicActionForm: ClearExtraAttributeWarpper(DynamicForm),
          Upload: ClearExtraAttributeWarpper(CustomUpload),
          InputWithCopy: DefaultValueWarpper(
            ClearExtraAttributeWarpper(CustomInputWithCopy)
          ),
          ...config.editorMap,
        },
        normalize: config.normalize || ((value) => value),
        dynamicDebounce: config.dynamicDebounce || 300, // 默认动态debounce时间
        editorLayoutWithDesc: config.editorLayoutWithDesc,
        injectEditorMap: (editorMap) => {
          set((state) => ({
            editorMap: {
              ...state.editorMap,
              ...editorMap,
            },
          }));
        },
      };
    }
  );
  return store;
}

export function useEditor(type: string): ComponentType<any> {
  const store = useContext(StoreContext);
  const { editorMap, commonEditorWarpper } = useStore(store);

  return useCreation(() => {
    const T = editorMap[type] || editorMap.Input;
    if (commonEditorWarpper) {
      return commonEditorWarpper(T);
    } else {
      return T;
    }
  }, [type, editorMap, commonEditorWarpper]);
}

export function useIpaasSchemaStore() {
  const store = useContext(StoreContext);
  return useStore(store);
}
