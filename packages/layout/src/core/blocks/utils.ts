import { Edge, MarkerType, Node } from "@xyflow/react";
import { FlowBlock } from "./FlowBlock";

export function generateEdge(config: {
  sourceNode: {
    id: string;
  };
  targetNode: Node;
  type?: string;
  markerEnd?: MarkerType;
}): Edge {
  const { sourceNode, targetNode, type, markerEnd } = config;

  return {
    id: `${sourceNode.id}-${targetNode.id}`,
    source: sourceNode.id,
    target: targetNode.id,
    data: {
      parentId: (sourceNode as any).realParentId || sourceNode.id,
    },
    style: {
      visibility: "visible",
    },
    markerEnd: markerEnd || { type: MarkerType.ArrowClosed },
  };
}

export function generateNode(config: { block: FlowBlock }): Node {
  const { block } = config;
  const { parent: parentBlock } = block;
  const position: {
    x: number;
    y: number;
  } = (() => {
    if (!parentBlock)
      return {
        x: -block.w / 2,
        y: 0,
      };

    // TODO 分支和循环节点的定位需要调整
    return {
      x: (parentBlock.w - block.w) / 2,
      y: parentBlock.mb + parentBlock.h,
    };
  })();

  // if (isLoopBlock(block)) {
  //   type = 'loopNode';
  // } else if (!isEmptyNode(block.flowNodeData)) {
  //   type = 'workflowNode';
  // }

  return {
    id: block.id,
    data: {
      blockData: block.blockData,
    },
    position,
    parentId: parentBlock?.id,
    type: "custom-node",
    style: {
      visibility: "visible",
    },
  };
}
