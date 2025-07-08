import { useDebounceFn } from "ahooks";
import { StudioFlowModel } from "./StudioFlowModel";
import { useNode, useNodeBlockDataUpdate } from "@fixedflow/layout";

export function useNodeUpdate() {
  const { selectedId } = StudioFlowModel.useModel();
  const { updateBlockData } = useNodeBlockDataUpdate({
    id: selectedId,
  });

  return {
    updateNode: (data: Partial<WorkflowNodeData>) => {
      updateBlockData((oldData) => {
        return {
          ...oldData,
          ...data,
        };
      });
    },
  };
}

export function useSelectedBlock() {
  const { selectedId } = StudioFlowModel.useModel();
  const selectedBlock = useNode<WorkflowNode>(selectedId);

  return selectedBlock;
}
