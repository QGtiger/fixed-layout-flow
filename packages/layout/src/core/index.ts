import {
  Block,
  BlockData,
  CustomNode,
  FixedFlowBlocks,
  ReactFlowData,
} from "@/type";
import { FlowBlock } from "./blocks/FlowBlock";

import { nanoid } from "nanoid";
import { generateEdge, isPathsBlock } from "./blocks/utils";
import { FlowPathsBlock } from "./blocks/FlowPathsBlock";
import { FlowPathRuleBlock } from "./blocks/FlowPathRuleBlock";
import { FlowLoopBlock } from "./blocks/FlowLoopBlock";

function isPlaceholderBlock(block: Block) {
  return block.type === "placeholder";
}

function getPathRuleBlock(data?: BlockData): Block {
  return {
    id: `pathRule_${nanoid(5)}`,
    type: "pathRule" as const,
    data: data || {},
  };
}

function getEmptyBlock(): Block {
  return {
    id: `default_empty_${nanoid(5)}`,
    type: "placeholder",
  };
}

export class FixFlowLayoutEngine {
  flowBlocksTree: FlowBlock;
  flowBlocksMap: Map<string, FlowBlock> = new Map();

  constructor(
    private blocks: FixedFlowBlocks,
    private config: {
      pathRuleInsertIndex?: number;
      defaultPathRuleList: BlockData[];
      pathRuleData: BlockData;
    }
  ) {
    // 初始化布局引擎
    this.flowBlocksTree = this.generateFixedLayoutByBlocks({
      blocks: this.blocks.length ? this.blocks : [getEmptyBlock()],
    });
  }

  generatePathRuleList(): Block[] {
    return this.config.defaultPathRuleList.map((d) => {
      return getPathRuleBlock(d);
    });
  }

  setFlowBlockById(id: string, flowBlock: FlowBlock) {
    if (this.flowBlocksMap.has(id)) {
      throw new Error(`FlowBlock with id ${id} does exist`);
    } else {
      this.flowBlocksMap.set(id, flowBlock);
    }
  }

  /**
   * 获取 FlowBlock节点
   * @returns {FlowBlock} - FlowBlock
   */
  getFlowBlockById(id: string): FlowBlock {
    const fb = this.flowBlocksMap.get(id);
    if (!fb) {
      throw new Error(`FlowBlock with id ${id} does not exist`);
    }

    return fb;
  }

  addFlowBlockById({ id, block }: { id: string; block: Block }) {
    const fb = this.getFlowBlockById(id);
    fb.setNext(
      this.generateFixedLayoutByBlocks({
        blocks: [block],
      })
    );
  }

  /**
   * 添加路径流程块
   * @param opts - 包含 id 和 data 的选项
   */
  addPathRuleFlowBlockById({ id }: { id: string }) {
    const fb = this.getFlowBlockById(id);
    if (!isPathsBlock(fb)) {
      throw new Error(`FlowBlock with id ${id} is not a paths block`);
    }
    const _d = getPathRuleBlock(this.config.pathRuleData);

    (fb as FlowPathsBlock).addChild(
      this.generateFixedLayoutByBlocks({
        blocks: [_d],
      }),
      this.config?.pathRuleInsertIndex
    );
  }

  addInnerBlockById({ id, data }: { id: string; data: Block }) {
    const fb = this.getFlowBlockById(id);
    if (!(fb instanceof FlowLoopBlock)) {
      throw new Error(`FlowBlock with id ${id} is not a loop block`);
    }
    const innerBlock = fb.innerBlock;
    const isReplace =
      innerBlock?.blockData && isPlaceholderBlock(innerBlock?.blockData);
    fb.setInnerBlock(
      this.generateFixedLayoutByBlocks({
        blocks: [data],
      }),
      isReplace
    );
  }

  resetRootBlockById({
    replace = true,
    data,
  }: {
    data: Block;
    replace?: boolean;
  }) {
    const fb = this.generateFixedLayoutByBlocks({
      blocks: [data],
    });
    fb.setNext(this.flowBlocksTree);
    if (replace) {
      this.flowBlocksTree.drop();
    }
    this.flowBlocksTree = fb;
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
      const block = blocks[i];
      const { data, id, type } = block;
      let flowblock: FlowBlock | undefined = undefined;
      if (type === "custom" || type === "placeholder" || type === "end") {
        flowblock = new FlowBlock(id, block);
      } else if (type === "paths") {
        const fb: FlowPathsBlock = (flowblock = new FlowPathsBlock(id, block));

        const childrenBlocks = block.blocks || this.generatePathRuleList();

        childrenBlocks.forEach((b) => {
          // 递归生成子流程块
          const childBlock = this.generateFixedLayoutByBlocks({
            blocks: [b],
          });
          fb.addChild(childBlock);
        });
      } else if (type === "pathRule") {
        const fb: FlowPathRuleBlock = (flowblock = new FlowPathRuleBlock(
          id,
          block
        ));

        if (block.blocks) {
          block.blocks.forEach((b) => {
            // 递归生成子流程块
            const childBlock = this.generateFixedLayoutByBlocks({
              blocks: [b],
            });
            fb.setLastNext(childBlock);
          });
        }
      } else if (type === "loop") {
        const fb: FlowLoopBlock = (flowblock = new FlowLoopBlock(id, block));

        const innerBlock = this.generateFixedLayoutByBlocks({
          blocks: block.blocks?.length ? block.blocks : [getEmptyBlock()],
        });
        fb.setInnerBlock(innerBlock);
      }

      if (!flowblock) {
        throw new Error(`Block type ${type} is not supported`);
      }

      // 设置 FlowBlockMap
      this.setFlowBlockById(id, flowblock);

      if (previousBlock) {
        previousBlock.setNext(flowblock);
      }

      if (!rootBlock) {
        rootBlock = flowblock;
      }

      previousBlock = flowblock;
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
      if (currentBlock.innerBlock) {
        this.clearViewSizeCacheByTree(currentBlock.innerBlock);
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

    const finalNode: CustomNode = {
      id: `final-end`,
      data: {
        label: "流程结束",
        blockData: {
          id: `final-end`,
          type: "none",
          data: {},
        },
      },
      parentId,
      position: {
        x: (parentBlock.w - lw) / 2,
        y: parentBlock.queryViewHeight() + parentBlock.mb,
      },
      type: "end-flow-node",
      style: {
        width: lw,
        height: 1,
        textAlign: "center",
        fontSize: 12,
        color: "#bbb",
        fontWeight: "bold",
        padding: 0,
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
