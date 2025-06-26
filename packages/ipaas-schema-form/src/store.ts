import { Input } from "antd";
import { ComponentType, createContext, useContext } from "react";
import { createStore, useStore } from "zustand";
import DefaultValueWarpper from "./utils/DefaulValueWarpper";
import { useCreation } from "ahooks";
import CustomSelect from "./components/material/CustomSelect";

interface IpaasSchemaStoreState {
  editorMap: Record<string, ComponentType<any>>;
  dynamicDebounce: number;
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
}

interface IpaasSchemaStoreActions {
  injectEditorMap: (editorMap: Record<string, ComponentType<any>>) => void;
}

export type IpaasSchemaStoreConfig = Partial<IpaasSchemaStoreState> & {};

export type IpaasSchemaStoreType = ReturnType<typeof createIpaasSchemaStore>;

export const StoreContext = createContext<IpaasSchemaStoreType>({} as any);

export function createIpaasSchemaStore(config: IpaasSchemaStoreConfig) {
  const store = createStore<IpaasSchemaStoreState & IpaasSchemaStoreActions>(
    (set, get) => {
      return {
        ...config,
        editorMap: {
          Input: DefaultValueWarpper(Input),
          Select: DefaultValueWarpper(CustomSelect),
          ...config.editorMap,
        },
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
    if (commonEditorWarpper) {
      return commonEditorWarpper(editorMap[type] || Input);
    } else {
      return editorMap[type] || Input;
    }
  }, [type, editorMap, commonEditorWarpper]);
}

export function useIpaasSchemaStore() {
  const store = useContext(StoreContext);
  return useStore(store);
}
