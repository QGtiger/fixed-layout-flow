import { Edge, MarkerType } from "@xyflow/react";
import { FlowBlock } from "./FlowBlock";
import type { FlowPathsBlock } from "./FlowPathsBlock";
import { Block, CustomNode } from "@/type";
import type { FlowLoopBlock } from "./FlowLoopBlock";

export function isNoneNode(b: Block) {
  return b.type === "none";
}

export function isPathsBlock(block: FlowBlock) {
  return block.blockData.type === "paths";
}

export function isPathRuleBlock(block: FlowBlock) {
  return block.blockData.type === "pathRule";
}

function isLoopBlock(block: FlowBlock) {
  return block.blockData.type === "loop";
}

export function traceBlock(block: FlowBlock, cb: (b: FlowBlock) => void) {
  let currentBlock: FlowBlock | undefined = block;
  while (currentBlock) {
    cb(currentBlock);
    currentBlock = currentBlock.next;
  }
}

export function generateEdge(config: {
  sourceNode: {
    id: string;
  };
  targetNode: CustomNode;
  type?: string;
  markerEnd?: MarkerType;
}): Edge {
  const { sourceNode, targetNode, type = "customEdge", markerEnd } = config;

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
    type,
  };
}

export function generateNode(config: { block: FlowBlock }): CustomNode {
  const { block } = config;
  const { parent: parentBlock } = block;
  const position: {
    x: number;
    y: number;
  } = (() => {
    if (!parentBlock) {
      return {
        x: -block.w / 2,
        y: 0,
      };
    }

    if (isPathsBlock(parentBlock)) {
      if (isPathRuleBlock(block)) {
        const pathBlock = parentBlock as FlowPathsBlock;
        pathBlock.queryViewWidth();

        const vw = pathBlock.childrenViewWidth;
        let w = (pathBlock.w - vw) / 2;
        const index = pathBlock.children.indexOf(block);
        for (let i = 0; i < index; i++) {
          w += pathBlock.children[i].queryViewWidth() + pathBlock.oy;
        }
        return {
          x: w + (block.queryViewWidth() - block.w) / 2,
          y: pathBlock.innerMb + pathBlock.h,
        };
      } else {
        return {
          x: (parentBlock.w - block.w) / 2,
          y: parentBlock.mb + parentBlock.queryViewHeight(),
        };
      }
    }
    if (isLoopBlock(parentBlock)) {
      if ((parentBlock as FlowLoopBlock).innerBlock !== block) {
        return {
          x: (parentBlock.w - block.w) / 2,
          y: parentBlock.mb + parentBlock.queryViewHeight(),
        };
      }
    }
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

  // 计算一下
  block.queryViewWidth();
  block.queryViewHeight();

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
