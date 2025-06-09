import useFlowNodeViewRect from "@/hooks/useFlowNodeViewRect";
import useStrokeStyle from "@/hooks/useStorkeStyle";
import { CustomEdgeProps } from "@/type";
import { BaseEdge, EdgeLabelRenderer, XYPosition } from "@xyflow/react";
import CommonAddButton from "./components/CommonAddButton";
import useFixedLayoutStore from "@/hooks/useFixedLayoutStore";

type P = Partial<XYPosition>;

function MakeLine(opts: { points: P[] }) {
  const result = opts.points.reduce(
    (res, cur) => {
      const { path, prePoint } = res;
      const c = {
        ...prePoint,
        ...cur,
      };
      if (!path) {
        res.path = `M${c.x || 0} ${c.y || 0}`;
      } else {
        res.path += ` L${c.x || 0} ${c.y || 0}`;
      }

      res.prePoint = c;
      return res;
    },
    {
      path: "",
      prePoint: {},
    }
  );
  return result.path;
}

export default function LoopCloseEdge(props: CustomEdgeProps) {
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
  const labelX = sourceX;
  const labelY = sourceY + 13;
  const { vw: targetVw, h: targetH } = useFlowNodeViewRect(target);
  const styles = useStrokeStyle({
    sourceId: source,
    targetId: target,
  });
  const { viewMode, addCustomNode, onAddBlockByData } = useFixedLayoutStore();

  console.log(111, targetVw);

  if (targetVw === 0) return null;

  const edgePath = MakeLine({
    points: [
      {
        x: sourceX,
        y: sourceY,
      },
      {
        y: sourceY + 28,
      },
      {
        x: targetX - targetVw / 2 + 20,
      },
      {
        y: targetY + targetH + 25,
      },
      {
        x: targetX,
        y: targetY + targetH + 25,
      },
    ],
  });

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
                addCustomNode({
                  parentId: data.parentId,
                  data: await onAddBlockByData?.({
                    type: "custom",
                  }),
                });
              }}
            />
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
