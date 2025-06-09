import { Handle, Position } from "@xyflow/react";

export function EndFlowNode(props: any) {
  return (
    <div>
      <Handle type="target" position={Position.Top} />
      {props.data.label}
      <Handle type="source" position={Position.Top} />
    </div>
  );
}
