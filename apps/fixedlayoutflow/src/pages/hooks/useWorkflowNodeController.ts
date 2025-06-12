import { useCreation } from "ahooks";

export default function useWorkflowNodeController(
  workflowNodes: WorkflowNode[]
) {
  return useCreation(() => {
    const nodeMap = new Map<string, WorkflowNode>();

    workflowNodes.forEach((node) => {
      nodeMap.set(node.id, node);
    });

    return {
      getNode: (id: string): WorkflowNode | undefined => nodeMap.get(id),
      getAllNodes: (): WorkflowNode[] => Array.from(nodeMap.values()),
      hasNode: (id: string): boolean => nodeMap.has(id),
    };
  }, [workflowNodes]);
}
