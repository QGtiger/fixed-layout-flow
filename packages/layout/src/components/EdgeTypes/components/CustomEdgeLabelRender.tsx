import useFixedLayoutStore from "@/hooks/useFixedLayoutStore";
import { CustomNode } from "@/type";
import { EdgeLabelRenderer, useReactFlow } from "@xyflow/react";
import { PropsWithChildren } from "react";

export default function CustomEdgeLabelRender({
  children,
  source,
  target,
}: PropsWithChildren<{
  source: string;
  target: string;
}>) {
  const { viewMode } = useFixedLayoutStore();
  const { getNode } = useReactFlow<CustomNode>();

  const sourceNode = getNode(source);
  const targetNode = getNode(target);
  if (!sourceNode || !targetNode) return null;
  if (
    sourceNode.data.blockData.type === "placeholder" ||
    targetNode.data.blockData.type === "placeholder"
  )
    return null;

  return !viewMode && <EdgeLabelRenderer>{children}</EdgeLabelRenderer>;
}
