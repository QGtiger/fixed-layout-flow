import useFixedLayoutStore from "@/hooks/useFixedLayoutStore";
import { BaseEdge } from "@xyflow/react";
import CommonAddButton from "./components/CommonAddButton";
import useStrokeStyle from "@/hooks/useStorkeStyle";
import CustomEdgeLabelRender from "./components/CustomEdgeLabelRender";
import { CustomEdgeProps } from "@/type";
import { memo } from "react";

function getCustomSmoothStepPath(config: {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  radius: number;
}): [string, number, number] {
  const { sourceX, sourceY, targetX, targetY, radius } = config;
  const midY = sourceY + (targetY - sourceY) / 2;
  const f = sourceX > targetX ? 1 : -1;
  const sweepFlag = sourceX > targetX ? 1 : 0;

  const labelX = sourceX;
  const labelY = sourceY + 20;

  if (Math.abs(sourceX - targetX) < 2 * radius) {
    return [`M ${sourceX} ${sourceY} L ${targetX} ${targetY}`, labelX, labelY];
  }

  const path = [
    `M ${sourceX} ${sourceY}`,
    `L ${sourceX} ${midY - radius}`,
    `A ${radius} ${radius} 0 0 ${sweepFlag} ${sourceX - f * radius} ${midY}`,
    `L ${targetX + f * radius} ${midY}`,
    `A ${radius} ${radius} 0 0 ${Number(!sweepFlag)} ${targetX} ${
      midY + radius
    }`,
    `L ${targetX} ${targetY}`,
  ].join(" ");

  return [path, labelX, labelY];
}

export default memo(function PathsEdge(props: CustomEdgeProps) {
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    markerEnd,
    source,
    target,
    data,
  } = props;
  const [edgePath, labelX, labelY] = getCustomSmoothStepPath({
    radius: 3,
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  const { addPathRuleNode, onAddBlockByData } = useFixedLayoutStore();

  const styles = useStrokeStyle({
    sourceId: source,
    targetId: target,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={styles} />
      <CustomEdgeLabelRender
        hidden={!data.showLabel}
        source={source}
        target={target}
      >
        <div
          className=" absolute pointer-events-auto"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            transformOrigin: "center",
          }}
        >
          <CommonAddButton
            onClick={async () => {
              const _d = await onAddBlockByData?.({
                type: "pathRule",
              });
              addPathRuleNode({
                parentId: source,
                data: _d,
              });
            }}
            label="添加分支"
          />
        </div>
      </CustomEdgeLabelRender>
    </>
  );
});
