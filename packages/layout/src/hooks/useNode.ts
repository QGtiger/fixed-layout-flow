import { Block, BlockData } from "@/type";
import useFixedLayoutStore from "./useFixedLayoutStore";

export function useNode<T = BlockData>(
  id: string
): Block<T> & {
  hasParent: boolean;
} {
  const { layoutEngine } = useFixedLayoutStore();
  const blockIns = layoutEngine.getFlowBlockByIdWithoutThrow(id);

  return {
    ...(blockIns?.blockData as Block<T>),
    hasParent: !!blockIns?.parent,
  };
}
