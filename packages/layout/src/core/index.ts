import { FixedFlowBlocks, ReactFlowData } from "@/type";
import { FlowBlock } from "./blocks/FlowBlock";

import { nanoid } from "nanoid";
import { Node } from "@xyflow/react";
import { generateEdge } from "./blocks/utils";

export class FixFlowLayoutEngine {
  flowBlocksTree: FlowBlock;
  flowBlocksMap: Map<string, FlowBlock> = new Map();

  constructor(private blocks: FixedFlowBlocks) {
    // 初始化布局引擎
    this.flowBlocksTree = this.generateFixedLayoutByBlocks({
      blocks: this.blocks,
    });
  }

  /**
   * 获取 FlowBlock节点
   * @returns {FlowBlock} - FlowBlock
   */
  getFlowBlockById(id: string): FlowBlock | undefined {
    if (this.flowBlocksMap.has(id)) {
      return this.flowBlocksMap.get(id);
    }
    return undefined;
  }

  /**
   * 生成固定布局的流程图
   * @param opts - 包含 blocks 的选项
   * @returns {FlowBlock} - 根 FlowBlock
   */
  generateFixedLayoutByBlocks(opts: { blocks: FixedFlowBlocks }) {
    const { blocks } = opts;
    let rootBlock: FlowBlock | undefined;
    let previousBlock: FlowBlock | undefined;
    let i = 0;
    while (i < blocks.length) {
      const { data, id, type } = blocks[i];
      let flowblock: FlowBlock | undefined = undefined;
      if (type === "custom") {
        flowblock = new FlowBlock(id, blocks[i]);

        this.flowBlocksMap.set(id, flowblock);
      }

      if (!flowblock) {
        throw new Error(`Block type ${type} is not supported`);
      }

      if (previousBlock) {
        previousBlock.setNext(flowblock);
      }

      if (!rootBlock) {
        rootBlock = flowblock;
      }

      i++;
    }

    if (!rootBlock) {
      throw new Error("No root block found");
    }

    return rootBlock;
  }

  /**
   * 清除 FlowBlock 的视图大小缓存
   * @param flowblock - 要清除缓存的 FlowBlock
   */
  clearViewSizeCacheByTree(flowblock: FlowBlock) {
    let currentBlock: FlowBlock | undefined = flowblock;
    while (currentBlock) {
      currentBlock.clearViewSizeCache();
      if (currentBlock.children) {
        currentBlock.children.forEach((child) => {
          this.clearViewSizeCacheByTree(child);
        });
      }
      currentBlock = currentBlock.next;
    }
  }

  /**
   * 将布局转换为 React Flow 数据格式
   * @returns {ReactFlowData}
   */
  exportReactFlowData(): ReactFlowData {
    // 清除 viewWidth 和 viewHeight 的缓存，重新计算
    this.clearViewSizeCacheByTree(this.flowBlocksTree);

    const { nodes, edges, endNode } =
      this.flowBlocksTree.exportReactFlowDataByFlowBlock();

    const lw = 100;
    const parentId = endNode.realParentId || endNode.id;
    const parentBlock = this.getFlowBlockById(parentId)!;

    const finalNode: Node = {
      id: `final-end`,
      data: { label: "结束" } as any,
      parentId,
      position: {
        x: (parentBlock.w - lw) / 2,
        y: parentBlock.queryViewHeight() + parentBlock.mb,
      },
      style: {
        width: lw,
        height: 1,
        textAlign: "center",
        fontSize: 12,
        color: "#bbb",
        fontWeight: "bold",
      },
    };
    return {
      nodes: nodes.concat([finalNode]),
      edges: edges.concat([
        generateEdge({
          sourceNode: endNode,
          targetNode: finalNode,
        }),
      ]),
      endNode,
    };
  }
}
