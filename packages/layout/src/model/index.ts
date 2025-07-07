import { FixFlowLayoutEngine } from "@/core";
import { Block, BlockData, CustomNode, FixedFlowBlocks } from "@/type";
import { Edge, Node } from "@xyflow/react";
import { createContext, CSSProperties } from "react";
import { createStore } from "zustand";
import { queueEffectFn } from "./queueTickFn";
import { nanoid } from "nanoid";

export interface FixedLayoutModelConfig {
  initialBlocks: FixedFlowBlocks;
  edgeStokeStyle?:
    | CSSProperties
    | ((sourceNode: CustomNode, targetNode: CustomNode) => CSSProperties);
  viewMode?: boolean;
  pathRuleInsertIndex?: number;
  defaultPathRuleList: BlockData[];
  pathRuleData: BlockData;

  /**
   * 自定义节点渲染器
   * @param block - Block对象
   * @returns ReactNode
   */
  nodeRenderer?: (block: Block) => React.ReactNode;
  placeholderRenderer?: (block: Block) => React.ReactNode;
  onAddBlockByData?: () => Promise<BlockWithoutId>;
}

export type FixedLayoutModelState = {
  nodes: Node[];
  edges: Edge[];
  layoutEngine: FixFlowLayoutEngine;
} & FixedLayoutModelConfig;

type BlockWithoutId = Omit<Block, "id">;

export interface FixedLayoutModelActions {
  render: () => void;
  addPathRuleNode(opt: { parentId: string }): void;
  addCustomNodeByInnerLoop(opt: {
    parentId: string;
    data?: BlockWithoutId;
  }): void;
  resetRootNode: (opt: { data?: BlockWithoutId }) => void;
  getEdgeStrokeStyle: (
    sourceNode: CustomNode,
    targetNode: CustomNode
  ) => CSSProperties;

  addNode: (opts: { parentId: string; data: BlockWithoutId }) => void;
}

export type FixedLayoutStoreType = ReturnType<
  typeof createFixedLayoutModelStore
>;

export const StoreContext = createContext<FixedLayoutStoreType>({} as any);

export function createFixedLayoutModelStore(config: FixedLayoutModelConfig) {
  const { initialBlocks, viewMode } = config;
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
        addNode({ parentId, data }) {
          if (viewMode) return;
          engineIns.addFlowBlockById({
            id: parentId,
            block: {
              id: `${data.type}_${nanoid(5)}`,
              ...data,
            },
          });
          render();
        },
        addPathRuleNode({ parentId }) {
          if (viewMode) return;
          engineIns.addPathRuleFlowBlockById({
            id: parentId,
          });
          render();
        },
        getEdgeStrokeStyle: (sourceNode, targetNode) => {
          const { edgeStokeStyle } = get();
          if (typeof edgeStokeStyle === "function") {
            return edgeStokeStyle(sourceNode, targetNode);
          }
          return (
            edgeStokeStyle || {
              stroke: "#cccccc",
              strokeWidth: 1,
            }
          );
        },
        addCustomNodeByInnerLoop({ parentId, data }) {
          if (viewMode || !data) return;
          engineIns.addInnerBlockById({
            id: parentId,
            data: {
              id: `${data.type}_${nanoid(5)}`,
              ...data,
            },
          });
          render();
        },
        resetRootNode: ({ data }) => {
          if (viewMode || !data) return;
          engineIns.resetRootBlockById({
            data: {
              id: `${data.type}_${nanoid(5)}`,
              ...data,
            },
            replace: true,
          });
          render();
        },
      };
    }
  );

  return store;
}
