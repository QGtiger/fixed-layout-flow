import useFixedLayoutStore from "@/hooks/useFixedLayoutStore";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getStraightPath,
  useReactFlow,
} from "@xyflow/react";
import CommonAddButton from "./components/CommonAddButton";
import { CustomEdgeProps } from "@/type";
import useStrokeStyle from "@/hooks/useStorkeStyle";
import CustomEdgeLabelRender from "./components/CustomEdgeLabelRender";

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
  const { onAddBlockByData, addCustomNode } = useFixedLayoutStore();

  const styles = useStrokeStyle({
    sourceId: source,
    targetId: target,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={styles} />
      <CustomEdgeLabelRender source={source} target={target}>
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
              addCustomNode({
                parentId: data.parentId,
                data: await onAddBlockByData?.({
                  type: "custom",
                }),
              });
            }}
          />
        </div>
      </CustomEdgeLabelRender>
    </>
  );
}
