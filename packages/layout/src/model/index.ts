import { FixFlowLayoutEngine } from "@/core";
import { Block, BlockData, FixedFlowBlocks } from "@/type";
import { Edge, Node } from "@xyflow/react";
import { createContext, CSSProperties } from "react";
import { createStore } from "zustand";
import { queueEffectFn } from "./queueTickFn";

export interface FixedLayoutModelConfig {
  initialBlocks: FixedFlowBlocks;
  edgeStokeStyle?: CSSProperties;
  viewMode?: boolean;
  pathRuleInsertIndex?: number;

  /**
   * 自定义节点渲染器
   * @param block - Block对象
   * @returns ReactNode
   */
  nodeRenderer?: (block: Block) => React.ReactNode;
  onAddBlockByData?: (opts: {
    type: "pathRule" | "custom";
  }) => Promise<BlockData>;
}

export type FixedLayoutModelState = {
  nodes: Node[];
  edges: Edge[];
  layoutEngine: FixFlowLayoutEngine;
} & FixedLayoutModelConfig;

export interface FixedLayoutModelActions {
  render: () => void;
  addCustomNode(opt: { parentId: string; data?: BlockData }): void;
  addPathRuleNode(opt: { parentId: string; data?: BlockData }): void;
}

export type FixedLayoutStoreType = ReturnType<
  typeof createFixedLayoutModelStore
>;

export const StoreContext = createContext<FixedLayoutStoreType>({} as any);

export function createFixedLayoutModelStore(config: FixedLayoutModelConfig) {
  console.log(config);
  const { initialBlocks } = config;
  const engineIns = new FixFlowLayoutEngine(initialBlocks, config);
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
        addCustomNode(opt) {
          engineIns.addCustomFlowBlockById({
            id: opt.parentId,
            data: opt.data,
          });
          render();
        },
        addPathRuleNode({ parentId, data }) {
          engineIns.addPathRuleFlowBlockById({
            id: parentId,
            data,
          });
          render();
        },
      };
    }
  );

  return store;
}
