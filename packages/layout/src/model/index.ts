import { FixFlowLayoutEngine } from "@/core";
import { Block, FixedFlowBlocks } from "@/type";
import { Edge, Node } from "@xyflow/react";
import { createContext, CSSProperties } from "react";
import { createStore } from "zustand";
import { queueEffectFn } from "./queueTickFn";

export interface FixedLayoutModelConfig {
  initialBlocks: FixedFlowBlocks;
  nodeRenderer?: (block: Block) => React.ReactNode;
  edgeStokeStyle?: CSSProperties;
  viewMode?: boolean;
}

export type FixedLayoutModelState = {
  nodes: Node[];
  edges: Edge[];
  layoutEngine: FixFlowLayoutEngine;
} & FixedLayoutModelConfig;

export interface FixedLayoutModelActions {
  render: () => void;
}

export type FixedLayoutStoreType = ReturnType<
  typeof createFixedLayoutModelStore
>;

export const StoreContext = createContext<FixedLayoutStoreType>({} as any);

export function createFixedLayoutModelStore(config: FixedLayoutModelConfig) {
  console.log(config);
  const { initialBlocks } = config;
  const engineIns = new FixFlowLayoutEngine(initialBlocks);
  const { nodes, edges } = engineIns.exportReactFlowData();

  const store = createStore<FixedLayoutModelState & FixedLayoutModelActions>(
    (set, get) => {
      function setNodesAndEdges() {
        const { nodes, edges } = engineIns.exportReactFlowData();
        set({ nodes, edges });
      }

      function render() {
        queueEffectFn(setNodesAndEdges);
      }

      return {
        ...config,
        nodes,
        edges,
        render,
        layoutEngine: engineIns,
        edgeStokeStyle: config.edgeStokeStyle || {
          stroke: "#cccccc",
          strokeWidth: 1,
        },
      };
    }
  );

  return store;
}
