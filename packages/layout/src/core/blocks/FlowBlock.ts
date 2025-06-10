import { Block, ReactFlowData } from "@/type";
import { DisplayObject } from "./DisplayObject";
import { generateEdge, generateNode } from "./utils";

export class FlowBlock extends DisplayObject {
  next?: FlowBlock;
  parent?: FlowBlock;
  children?: FlowBlock[];
  innerBlock?: FlowBlock;

  viewWidth: number = 0;
  viewHeight: number = 0;

  constructor(public id: string, public blockData: Block) {
    super();
  }

  setLastNext(block: FlowBlock) {
    if (this.next) {
      this.next.setLastNext(block);
    } else {
      this.setNext(block);
    }
  }

  setNext(block: FlowBlock) {
    if (this.next) {
      block.setNext(this.next);
    }
    this.next = block;
    block.parent = this;

    return block;
  }

  /**
   * 删除当前节点
   * @description 删除当前节点,并将当前节点的下一个节点链接到当前节点的父节点上
   * @returns {void}
   */
  drop() {
    const { parent } = this;
    if (parent) {
      parent.next = this.next;
      if (this.next) {
        this.next.parent = parent;
      }
    }

    this.removeLink();
  }

  /**
   * 断开当前节点 后续的链接
   * @returns {FlowBlock} 返回当前节点
   */
  break() {
    this.next = undefined;
    return this;
  }

  /**
   * 移除所有的链接,清除引用
   */
  removeLink() {
    this.next = undefined;
    this.parent = undefined;
  }

  queryViewHeight() {
    return this.h;
  }

  queryViewWidth() {
    return this.w;
  }

  clearViewSizeCache() {
    this.viewWidth = 0;
    this.viewHeight = 0;
  }

  /**
   * 查询节点数量
   */
  queryNodeCount(): number {
    return 1;
  }

  exportReactFlowDataByFlowBlock(): ReactFlowData {
    const currNode = generateNode({
      block: this,
    });
    const nextBlockData = this.next?.exportReactFlowDataByFlowBlock() || {
      nodes: [],
      edges: [],
      endNode: currNode,
    };
    const nodes = Array.prototype.concat.call(
      [],
      currNode,
      nextBlockData.nodes
    );
    const edges = Array.prototype.concat.call(
      [],
      (() => {
        const nextNode = nextBlockData.nodes.at(0);
        if (!nextNode) return [];
        return generateEdge({
          sourceNode: this,
          targetNode: nextNode,
        });
      })(),
      nextBlockData.edges
    );
    return {
      nodes,
      edges,
      endNode: nextBlockData.endNode,
    };
  }
}
