import { EndNode, ReactFlowData } from "@/type";
import { FlowBlock } from "./FlowBlock";
import { generateEdge, generateNode, traceBlock } from "./utils";

export class FlowLoopBlock extends FlowBlock {
  innerBlock?: FlowBlock;
  innerMb: number = 45;
  // 左右padding
  padding: number = 40;
  // mb = 35;

  setInnerBlock(block: FlowBlock, replace?: boolean) {
    if (this.innerBlock) {
      // 如果 innerBlock 为空，则直接移除
      if (replace) {
        this.innerBlock.removeLink();
      } else {
        block.setLastNext(this.innerBlock);
      }
    }
    this.innerBlock = block;

    block.parent = this;

    return block;
  }

  queryViewHeight(): number {
    if (!this.open) return this.h;
    if (this.viewHeight) return this.viewHeight;
    let vh = this.h + this.innerMb;
    if (this.innerBlock) {
      traceBlock(this.innerBlock, (block) => {
        vh += block.queryViewHeight() + block.mb;
      });
    }

    this.viewHeight = vh;
    return vh;
  }

  queryViewWidth(): number {
    if (!this.open) return this.w;
    if (this.viewWidth) return this.viewWidth;

    let vw = this.w;
    if (this.innerBlock) {
      traceBlock(this.innerBlock, (block) => {
        vw = Math.max(vw, block.queryViewWidth());
      });
    }

    this.viewWidth = vw + 2 * this.padding;
    return this.viewWidth;
  }

  generateEndNode(): EndNode {
    const lw = 100;
    const id = `${this.id}-end`;
    return {
      id,
      data: {
        label: "end",
        blockData: {
          id,
          type: "none",
          data: {},
        },
      },
      parentId: this.id,
      position: {
        x: (this.w - lw) / 2,
        // TODO 为了循环连线 连贯
        y: this.queryViewHeight(),
      },
      style: {
        width: lw,
        height: 1,
        visibility: "hidden",
      },
      type: "end-flow-node",
      realParentId: this.id,
    };
  }

  private open: boolean = true;

  fold() {
    this.open = false;
  }

  unfold() {
    this.open = true;
  }

  /**
   * 查询节点数量
   */
  queryNodeCount(): number {
    let count = 1;
    let b = this.innerBlock;
    while (b) {
      count += b.queryNodeCount();
      b = b.next;
    }
    return count;
  }

  exportReactFlowDataByFlowBlock(config?: {
    innerBlock?: boolean;
  }): ReactFlowData {
    if (!this.innerBlock) {
      throw new Error("innerBlock is required");
    }

    if (!this.open) {
      // 未展开
      return super.exportReactFlowDataByFlowBlock();
    }

    const endNode = this.generateEndNode();

    const innerChildNodes = this.innerBlock.exportReactFlowDataByFlowBlock({
      innerBlock: true,
    });

    const currNode = generateNode({
      block: this,
      opts: {
        inner: config?.innerBlock,
      },
    });

    const nextBlockData = this.next?.exportReactFlowDataByFlowBlock() || {
      nodes: [],
      edges: [],
      endNode,
    };

    const nodes = [
      currNode,
      ...innerChildNodes.nodes,
      endNode,
      ...nextBlockData.nodes,
    ];

    const edges = [
      generateEdge({
        sourceNode: currNode,
        targetNode: innerChildNodes.nodes[0],
        type: "loopInnerEdge",
      }),
      ...innerChildNodes.edges,

      generateEdge({
        sourceNode: innerChildNodes.endNode,
        targetNode: currNode,
        type: "loopCloseEdge",
      }),
      ...(() => {
        const nextNode = nextBlockData.nodes.at(0);
        if (!nextNode) return [];
        return [
          generateEdge({
            sourceNode: endNode,
            targetNode: nextNode,
          }),
        ];
      })(),
      ...nextBlockData.edges,
    ];

    return {
      nodes,
      edges,
      endNode: nextBlockData.endNode,
    };
  }
}
