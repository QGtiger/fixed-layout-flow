import { useEffect } from "react";
import useNodeResize from "@/hooks/useNodeResize";
import { useResizeObserver } from "@/hooks/useResizeObserver";

export default function useFlowNodeResize({
  id,
  width,
  height,
  nodeRef,
  onResize,
}: {
  id: string;
  width?: number;
  height?: number;
  nodeRef: React.RefObject<HTMLDivElement | null>;
  onResize?: (width: number, height: number) => void;
}) {
  const nodeResize = useNodeResize();

  useEffect(() => {
    if (!id || !width || !height) return;
    nodeResize(id, {
      w: width,
      h: height,
    });
  }, [width, height, id, nodeResize]);

  useResizeObserver(nodeRef, (entry) => {
    if (!id) return;
    const { offsetWidth, offsetHeight } = entry.target as HTMLDivElement;
    if (!offsetWidth || !offsetHeight) return;
    onResize?.(offsetWidth, offsetHeight);
    nodeResize(id, {
      w: offsetWidth,
      h: offsetHeight,
    });
  });
}
