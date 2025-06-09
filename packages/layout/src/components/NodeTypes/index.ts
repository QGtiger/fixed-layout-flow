import { NodeTypes } from "@xyflow/react";
import CustomNode from "./CustomNode";

// two different node types are needed for our example: workflow and placeholder nodes
const nodeTypes: NodeTypes = {
  "custom-node": CustomNode,
};

export default nodeTypes;
