import { Edge, Node } from "@xyflow/react";

export type BlockType =
  | "start"
  | "condition"
  | "case"
  | "loop"
  | "custom"
  | "end";

export type Block = {
  id: string;
  type: BlockType;
  data: BlockData;
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

export type EndNode = Node & { realParentId?: string };

export type ReactFlowData = {
  nodes: Node[];
  edges: Edge[];
  endNode: EndNode;
};
