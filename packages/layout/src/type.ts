import { Edge, EdgeProps, Node, NodeProps } from "@xyflow/react";

export type CustomEdgeProps = EdgeProps & {
  data: { parentId: string; showLabel: boolean };
};
export type CustomNodeProps = NodeProps & {
  data: {
    blockData: Block;
    inner?: boolean; // 是否为内部节点
    parentId?: string; // 用于标识父节点
  };
};

export type CustomNode = Node & {
  data: {
    blockData: Block;
    inner?: boolean; // 是否为内部节点
    parentId?: string; // 用于标识父节点
  };
};

export type BlockType =
  | "start"
  | "paths" // 分支
  | "pathRule" // 条件
  | "case" // ifelse
  | "loop"
  | "custom"
  | "none" // 无效节点
  | "placeholder" // 占位符
  | "end";

export type Block = {
  id: string;
  type: BlockType;
  data?: BlockData;
  blocks?: Block[];
};

export type BlockData = Record<string, any>;

export type FixedFlowBlocks = Block[];

export type FlowBlocksJSON = {
  nodes: FixedFlowBlocks;
};

// export type FlowBlockData = {
//   id: string;
//   type: BlockType;
//   data: BlockData;
//   blocks: FlowBlockData[];
//   index: number;
// }

export type EndNode = CustomNode & { realParentId?: string };

export type ReactFlowData = {
  nodes: CustomNode[];
  edges: Edge[];
  endNode: EndNode;
};
