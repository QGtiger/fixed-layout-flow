import { useCallback } from "react";
import useFixedLayoutStore from "./useFixedLayoutStore";

import { RectInfer } from "@/core/blocks/DisplayObject";

// 两个数字是否太过于接近
function isClose(a: number, b: number) {
  return Math.abs(a - b) < 1;
}

export default function useNodeResize() {
  const { render, layoutEngine } = useFixedLayoutStore();

  const nodeResize = useCallback((id: string, size: RectInfer) => {
    const b = layoutEngine.getFlowBlockById(id);
    if (!b) return;
    if (isClose(b.w, size.w) && isClose(b.h, size.h)) return;
    if (!size.w || !size.h) return;
    b.setRect(size);
    render();
    // macroRender();
  }, []);

  return nodeResize;
}
