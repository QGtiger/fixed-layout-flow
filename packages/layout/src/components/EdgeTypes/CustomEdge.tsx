import useFixedLayoutStore from "@/hooks/useFixedLayoutStore";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getStraightPath,
} from "@xyflow/react";
import CommonAddButton from "./components/CommonAddButton";
import { CustomEdgeProps } from "@/type";

export default function CustomEdge(props: CustomEdgeProps) {
  const { sourceX, sourceY, targetX, targetY, markerEnd, data } = props;
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  const { edgeStokeStyle, viewMode, onAddBlockByData, addCustomNode } =
    useFixedLayoutStore();

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={edgeStokeStyle} />
      {!viewMode && (
        <EdgeLabelRenderer>
          <div
            className=" absolute pointer-events-auto"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${
                labelY - 2
              }px)`,
              transformOrigin: "center",
            }}
          >
            <CommonAddButton
              onClick={async () => {
                const _data = await onAddBlockByData?.({
                  type: "custom",
                });

                addCustomNode({
                  parentId: data.parentId,
                  data: _data,
                });
              }}
            />
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
