import useFixedLayoutStore from "@/hooks/useFixedLayoutStore";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  Node,
  XYPosition,
  useReactFlow,
} from "@xyflow/react";
import CommonAddButton from "./components/CommonAddButton";
import { CustomEdgeProps } from "@/type";
import useStrokeStyle from "@/hooks/useStorkeStyle";
// import { WflowEdgeProps } from '../../layoutEngine/utils';
// import CommonAddButton from './CommonAddButton';
// import useStrokeColor from '../../hooks/useStrokeColor';
// import useFlowNode from '../../hooks/useFlowNode';

function getNodeEdgePoint(node: Node, x: number, y: number): XYPosition {
  const { type, position, width, height } = node;
  if (type === "endFlowNode") {
    return {
      x: position.x + (width || 0) / 2,
      y: position.y + (height || 0) / 2,
    };
  } else {
    return {
      x,
      y,
    };
  }
}

function isNumberEqual(n: number, m: number) {
  return Math.abs(n - m) <= 1;
}

// M x y：移动到指定的坐标 (x, y)。
// L x y：绘制一条直线到指定的坐标 (x, y)。
// A rx ry x-axis-rotation large-arc-flag sweep-flag x y：绘制一个椭圆弧线。
// rx 和 ry 分别是椭圆的 x 轴和 y 轴半径。
// x-axis-rotation 是椭圆的 x 轴旋转角度（通常为 0）。
// large-arc-flag 是一个布尔值，0 表示小弧，1 表示大弧。
// sweep-flag 是一个布尔值，0 表示逆时针方向，1 表示顺时针方向。
// x 和 y 是弧线的终点坐标。

function customStepLine(point1: XYPosition, point2: XYPosition) {
  const { x: x1, y: y1 } = point1;
  const { x: x2, y: y2 } = point2;
  const isSingleLine = isNumberEqual(x1, x2) || isNumberEqual(y1, y2);
  if (isSingleLine) {
    return `M${x1} ${y1} L${x2} ${y2}`;
  } else {
    // 控制弧度的大小
    const radius = 3;

    // 计算圆弧的起始点和结束点
    const arcStartY = y2 - radius;
    const arcEndY = y2;

    const sweepFlag = x1 < x2 ? 0 : 1;
    const arcEndX = sweepFlag == 0 ? x1 + radius : x1 - radius;

    // 创建路径
    const path = [
      `M${x1} ${y1}`, // 移动到起始点
      `V${arcStartY}`, // 画一条垂直线到圆弧的起始点
      `A${radius} ${radius} 0 0 ${sweepFlag} ${arcEndX} ${arcEndY}`, // 画圆弧
      `H${x2}`, // 画一条水平线到目标点的 x 坐标
    ].join(" ");

    return path;

    // return `M${x1} ${y1} L${x1} ${y2} L${x2} ${y2}`;
  }
}

export function EndflowEdge(props: CustomEdgeProps) {
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
  const { getNode } = useReactFlow();
  const sourceNode = getNode(source);
  const targetNode = getNode(target);
  const { viewMode, addCustomNode, onAddBlockByData } = useFixedLayoutStore();

  const styles = useStrokeStyle({
    sourceId: source,
    targetId: target,
  });

  if (!sourceNode || !targetNode) {
    return <></>;
  }

  const sourcePosition = getNodeEdgePoint(sourceNode, sourceX, sourceY);
  const targetPosition = getNodeEdgePoint(targetNode, targetX, targetY);

  const edgePath2 = customStepLine(sourcePosition, targetPosition);

  return (
    <>
      <BaseEdge path={edgePath2} markerEnd={markerEnd} style={styles} />
      {!viewMode && (
        <EdgeLabelRenderer>
          <div
            className=" absolute pointer-events-auto"
            style={{
              transform: `translate(-50%, -50%) translate(${sourceX}px,${
                sourceY + 15
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
