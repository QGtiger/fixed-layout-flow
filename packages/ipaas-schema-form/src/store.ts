import { Input } from "antd";
import { ComponentType } from "react";
import { create } from "zustand";
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

export const IpaasSchemaStore = create<
  IpaasSchemaStoreState & IpaasSchemaStoreActions
>((set, get) => {
  return {
    editorMap: {
      Input: DefaultValueWarpper(Input),
    },
    dynamicDebounce: 300, // 默认动态debounce时间
    injectEditorMap: (editorMap) => {
      set((state) => ({
        editorMap: {
          ...state.editorMap,
          ...editorMap,
        },
      }));
    },
  };
});

export function useEditor(type: string): ComponentType<any> {
  const { editorMap } = IpaasSchemaStore();
  return editorMap[type] || Input; // 默认返回 Input 组件
}
