import { BlockData } from "@/type";
import useFixedLayoutStore from "./useFixedLayoutStore";

export function useNodeBlockDataUpdate({ id }: { id: string }) {
  const { layoutEngine, historyChange } = useFixedLayoutStore();

  const updateBlockData = (newDataFunc: (oldData?: BlockData) => BlockData) => {
    const flowBlock = layoutEngine.getFlowBlockById(id);

    const newData = newDataFunc(flowBlock.blockData.data);
    flowBlock.blockData.data = newData;
    historyChange();
  };

  return {
    updateBlockData,
  };
}
