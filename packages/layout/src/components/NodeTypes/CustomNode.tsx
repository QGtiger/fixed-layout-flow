import { memo, useRef } from "react";
import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import useFixedLayoutStore from "@/hooks/useFixedLayoutStore";
import { Block } from "@/type";
import useFlowNodeResize from "./useFlowNodeResize";

const CustomNode = (
  props: NodeProps & {
    data: Block;
  }
) => {
  const { id, data, width, height } = props;
  const nodeRef = useRef<HTMLDivElement>(null);
  const { nodeRenderer } = useFixedLayoutStore();

  useFlowNodeResize({
    id,
    width,
    height,
    nodeRef,
  });

  return (
    <div className="custom-node" ref={nodeRef}>
      {nodeRenderer ? nodeRenderer(data) : "请实现 nodeRenderer 函数"}
      <Handle type="target" position={Position.Top} isConnectable={false} />
      <Handle type="source" position={Position.Bottom} isConnectable={false} />
    </div>
  );
};

export default memo(CustomNode);
