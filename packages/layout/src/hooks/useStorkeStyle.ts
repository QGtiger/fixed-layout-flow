import { useReactFlow } from "@xyflow/react";
import useFixedLayoutStore from "./useFixedLayoutStore";
import { CustomNode } from "@/type";

export default function useStrokeStyle({
  sourceId,
  targetId,
}: {
  sourceId: string;
  targetId: string;
}) {
  const { getEdgeStrokeStyle } = useFixedLayoutStore();

  const { getNode } = useReactFlow<CustomNode>();

  const sourceNode = getNode(sourceId);
  const targetNode = getNode(targetId);

  if (!sourceNode || !targetNode) {
    return {};
  }

  return getEdgeStrokeStyle(sourceNode, targetNode);
}
