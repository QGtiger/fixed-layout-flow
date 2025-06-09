import { MarkerType } from "@xyflow/react";
import { FlowBlock } from "./FlowBlock";
import { FlowPathRuleBlock } from "./FlowPathRuleBlock";

import { generateEdge, generateNode } from "./utils";
import { EndNode, ReactFlowData } from "@/type";
export class FlowPathsBlock extends FlowBlock {
  children: FlowPathRuleBlock[] = [];
  innerMb: number = 50;
  // 内部子节点间距
  oy: number = 30;
  childrenViewWidth: number = 0;
  mb = 35;

  hasChild(id: string) {
    return this.children.some((child) => child.id === id);
  }

  addChild(block: FlowPathRuleBlock, index: number = this.children.length) {
    if (!(block instanceof FlowPathRuleBlock)) {
      throw new Error("FlowPathsBlock can only add FlowPathRuleBlock");
    }
    this.children.splice(index, 0, block);
    block.parent = this;

    return block;
  }

  removeChild(block: FlowBlock) {
    const index = this.children.findIndex((child) => child.id === block.id);
    if (index !== -1) {
      this.children.splice(index, 1);
      block.parent = undefined;
    }
  }

  queryViewHeight() {
    if (!this.open) return this.h;
    if (this.viewHeight) return this.viewHeight;
    const vh = Math.max(
      ...this.children.map((child) => child.queryViewHeight())
    );
    this.viewHeight = vh + this.h + this.innerMb;
    return this.viewHeight;
  }

  queryViewWidth(): number {
    if (!this.open) return this.w;
    if (this.viewWidth) return this.viewWidth;
    const vw = this.children.reduce((acc, child, index) => {
      return acc + child.queryViewWidth() + (index > 0 ? this.oy : 0);
    }, 0);

    this.childrenViewWidth = vw;

    this.viewWidth = Math.max(vw, this.w);
    return vw;
  }

  generateEndNode(): EndNode {
    const lw = 100;
    const id = `paths_${this.id}-end`;
    return {
      id,
      data: {
        blockData: {
          id,
          type: "none",
          data: {},
        },
      },
      parentId: this.id,
      position: {
        x: (this.w - lw) / 2,
        y: this.queryViewHeight(),
      },
      style: {
        width: lw,
        height: 1,
        visibility: "hidden",
        padding: 0,
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
    return (
      this.children.reduce((res, cur) => {
        res += cur.queryNodeCount();
        return res;
      }, 0) + 1
    );
  }

  exportReactFlowDataByFlowBlock(): ReactFlowData {
    if (!this.open) {
      return super.exportReactFlowDataByFlowBlock();
    }

    const currNode = generateNode({
      block: this,
    });
    const childrenNodes = this.children.reduce(
      (acc, curr) => {
        const d = curr.exportReactFlowDataByFlowBlock();
        acc.nodes.push(...d.nodes);
        acc.edges.push(...d.edges);
        acc.startNodes.push(d.nodes[0]);
        acc.endNodes.push(d.endNode);
        return acc;
      },
      {
        nodes: [],
        edges: [],
        startNodes: [],
        endNodes: [],
      } as {
        nodes: ReactFlowData["nodes"];
        edges: ReactFlowData["edges"];
        startNodes: ReactFlowData["nodes"];
        endNodes: ReactFlowData["nodes"];
      }
    );

    const endNode = this.generateEndNode();

    const nextBlockData = this.next?.exportReactFlowDataByFlowBlock() || {
      nodes: [],
      edges: [],
      endNode,
    };

    const nodes = Array.prototype.concat.call(
      [],
      currNode,
      childrenNodes.nodes,
      endNode,
      nextBlockData.nodes
    );

    const edges = Array.prototype.concat.call(
      [],
      (() => {
        return childrenNodes.startNodes.map((node) => {
          return generateEdge({
            sourceNode: this,
            targetNode: node,
            type: "pathsEdge",
          });
        });
      })(),
      childrenNodes.edges,
      (() => {
        return childrenNodes.endNodes.map((node) => {
          return generateEdge({
            sourceNode: node,
            targetNode: endNode,
            type: "endflowEdge",
            markerEnd: MarkerType.Arrow,
          });
        });
      })(),
      (() => {
        const nextNode = nextBlockData.nodes.at(0);
        if (!nextNode) return [];
        return generateEdge({
          sourceNode: endNode,
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
