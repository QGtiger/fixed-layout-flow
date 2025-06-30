import { useSize } from "ahooks";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

interface HoverMaskProps {
  componentId: string;
  containerClassName: string;
  portalClassName: string;

  renderMask?: (props: {
    left: number;
    top: number;
    width: number;
    height: number;
  }) => React.ReactNode;
}

export default function HoverMask({
  componentId,
  containerClassName,
  portalClassName,
  renderMask,
}: HoverMaskProps) {
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const tt = useSize(
    document.querySelector(`[data-component-id="${componentId}"]`)
  );

  useEffect(() => {
    updatePostion();
  }, [tt?.width, tt?.height]);

  useEffect(() => {
    updatePostion();
  }, [componentId]);

  const updatePostion = () => {
    if (!componentId) return;

    const container = document.querySelector(`.${containerClassName}`);
    if (!container) return;

    const node = document.querySelector(`[data-component-id="${componentId}"]`);
    if (!node) return;

    const { top, left, width, height } = node.getBoundingClientRect();
    const { top: containerTop, left: containerLeft } =
      container.getBoundingClientRect();

    setPosition({
      top: top - containerTop + container.scrollTop,
      left: left - containerLeft,
      width,
      height,
    });
  };

  const ele = useMemo(() => {
    return document.querySelector(`.${portalClassName}`)!;
  }, []);

  return createPortal(
    renderMask ? (
      renderMask(position)
    ) : (
      <div
        style={{
          position: "absolute",
          left: position.left,
          top: position.top,
          backgroundColor: "rgba(0, 0, 255, 0.05)",
          border: "1px dashed blue",
          pointerEvents: "none",
          width: position.width,
          height: position.height,
          zIndex: 12,
          borderRadius: 2,
          boxSizing: "border-box",
        }}
      />
    ),
    ele
  );
}
