import useFixedLayoutStore from "./useFixedLayoutStore";

export default function useFlowNodeViewRect(id: string) {
  const { layoutEngine } = useFixedLayoutStore();
  try {
    const block = layoutEngine.getFlowBlockById(id);
    return {
      vw: block.viewWidth,
      vh: block.viewHeight,
      w: block.w,
      h: block.h,
    };
  } catch (e) {
    return {
      vw: 0,
      vh: 0,
      w: 0,
      h: 0,
    };
  }
}
