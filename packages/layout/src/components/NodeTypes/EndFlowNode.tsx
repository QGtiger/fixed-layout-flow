import { Handle, Position } from "@xyflow/react";

export function EndFlowNode(props: any) {
  return (
    <div>
      <Handle type="target" position={Position.Top} />
      无效节点
      <Handle type="source" position={Position.Top} />
    </div>
  );
}
