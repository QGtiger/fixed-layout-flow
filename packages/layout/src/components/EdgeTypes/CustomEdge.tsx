import useFixedLayoutStore from "@/hooks/useFixedLayoutStore";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getStraightPath,
  useReactFlow,
} from "@xyflow/react";
import CommonAddButton from "./components/CommonAddButton";
import { CustomEdgeProps, CustomNode } from "@/type";
import useStrokeStyle from "@/hooks/useStorkeStyle";

export default function CustomEdge(props: CustomEdgeProps) {
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    markerEnd,
    data,
    source,
    target,
  } = props;
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  const { viewMode, onAddBlockByData, addCustomNode } = useFixedLayoutStore();

  const styles = useStrokeStyle({
    sourceId: source,
    targetId: target,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={styles} />
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
