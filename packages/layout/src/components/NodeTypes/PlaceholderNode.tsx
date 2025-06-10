import { memo, useRef } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import useFixedLayoutStore from "@/hooks/useFixedLayoutStore";
import { CustomNode, CustomNodeProps } from "@/type";
import useFlowNodeResize from "./useFlowNodeResize";

const PlaceholderNode = (props: CustomNodeProps) => {
  const { id, data, width, height } = props;
  const nodeRef = useRef<HTMLDivElement>(null);
  const {
    placeholderRenderer,
    onAddBlockByData,
    addCustomNode,
    addCustomNodeByInnerLoop,
  } = useFixedLayoutStore();

  const onAdd = async () => {
    if (!data.parentId) return;
    if (data.inner) {
      addCustomNodeByInnerLoop({
        parentId: data.parentId,
        data: await onAddBlockByData?.({
          type: "custom",
        }),
      });
    } else {
      addCustomNode({
        parentId: data.parentId,
        data: await onAddBlockByData?.({
          type: "custom",
        }),
      });
    }
  };

  useFlowNodeResize({
    id,
    width,
    height,
    nodeRef,
  });

  return (
    <div className="placeholder-node" ref={nodeRef}>
      <div onClick={onAdd}>
        {placeholderRenderer
          ? placeholderRenderer(data.blockData)
          : "请实现 placeholderRenderer 函数"}
      </div>
      <Handle type="target" position={Position.Top} isConnectable={false} />
      <Handle type="source" position={Position.Bottom} isConnectable={false} />
    </div>
  );
};

export default memo(PlaceholderNode);
