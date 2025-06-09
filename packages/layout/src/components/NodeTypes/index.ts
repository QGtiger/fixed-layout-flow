import { NodeTypes } from "@xyflow/react";
import CustomNode from "./CustomNode";
import { EndFlowNode } from "./EndFlowNode";

// two different node types are needed for our example: workflow and placeholder nodes
const nodeTypes: NodeTypes = {
  "custom-node": CustomNode,
  "end-flow-node": EndFlowNode,
};

export default nodeTypes;
