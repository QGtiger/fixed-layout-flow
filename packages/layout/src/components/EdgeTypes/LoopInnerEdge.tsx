import useFixedLayoutStore from "@/hooks/useFixedLayoutStore";
import useStrokeStyle from "@/hooks/useStorkeStyle";
import { CustomEdgeProps } from "@/type";
import { BaseEdge, EdgeLabelRenderer, getStraightPath } from "@xyflow/react";
import CommonAddButton from "./components/CommonAddButton";

export default function LoopInnerEdge(props: CustomEdgeProps) {
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
  const styles = useStrokeStyle({
    sourceId: source,
    targetId: target,
  });
  const { viewMode, addCustomNodeByInnerLoop, onAddBlockByData } =
    useFixedLayoutStore();

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={styles} />
      {!viewMode && (
        <EdgeLabelRenderer>
          <div
            className=" absolute pointer-events-auto"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              transformOrigin: "center",
            }}
          >
            <CommonAddButton
              onClick={async () => {
                const _data = await onAddBlockByData?.({
                  type: "custom",
                });

                addCustomNodeByInnerLoop({
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
