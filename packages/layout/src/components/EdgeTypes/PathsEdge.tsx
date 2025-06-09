import useFixedLayoutStore from "@/hooks/useFixedLayoutStore";
import { BaseEdge, EdgeLabelRenderer, EdgeProps } from "@xyflow/react";
import CommonAddButton from "./components/CommonAddButton";
// import CommonAddButton from './CommonAddButton';
// import useStrokeColor from '../../hooks/useStrokeColor';
// import useFlowNode from '../../hooks/useFlowNode';
// import { WflowEdgeProps } from '../../layoutEngine/utils';

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

export function PathsEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, markerEnd, source } = props;
  const [edgePath, labelX, labelY] = getCustomSmoothStepPath({
    radius: 3,
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  const { edgeStokeStyle, viewMode, addPathRuleNode, onAddBlockByData } =
    useFixedLayoutStore();

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={edgeStokeStyle} />
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
        </EdgeLabelRenderer>
      )}
    </>
  );
}
