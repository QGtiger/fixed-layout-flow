import { Input } from "antd";
import { ComponentType, createContext, useContext } from "react";
import { createStore, useStore } from "zustand";
import DefaultValueWarpper from "./utils/DefaulValueWarpper";

interface IpaasSchemaStoreState {
  editorMap: Record<string, ComponentType<any>>;
  dynamicDebounce: number;
  editorLayoutWithDesc?: (
    node1: React.ReactNode,
    node2: React.ReactNode
  ) => React.ReactNode;
}

interface IpaasSchemaStoreActions {
  injectEditorMap: (editorMap: Record<string, ComponentType<any>>) => void;
}

export interface IpaasSchemaStoreConfig {
  initialEditorMap?: Record<string, ComponentType<any>>;
  dynamicDebounce?: number; // 动态debounce时间
  editorLayoutWithDesc?: (
    node1: React.ReactNode,
    node2: React.ReactNode
  ) => React.ReactNode;
}

export type IpaasSchemaStoreType = ReturnType<typeof createIpaasSchemaStore>;

export const StoreContext = createContext<IpaasSchemaStoreType>({} as any);

export function createIpaasSchemaStore(config: IpaasSchemaStoreConfig) {
  const store = createStore<IpaasSchemaStoreState & IpaasSchemaStoreActions>(
    (set, get) => {
      return {
        editorMap: {
          Input: DefaultValueWarpper(Input),
          ...config.initialEditorMap,
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
  const { editorMap } = useStore(store);
  return editorMap[type] || Input; // 默认返回 Input 组件
}

export function useIpaasSchemaStore() {
  const store = useContext(StoreContext);
  return useStore(store);
}
