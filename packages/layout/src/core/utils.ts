import { Block } from "@/type";
import { FlowBlock } from "./blocks/FlowBlock";

export function exportBlock(blockIns: FlowBlock): Block {
  const block = blockIns.blockData;
  if (block.type === "pathRule") {
    return {
      ...block,
      blocks: blockIns.next && exportBlocks(blockIns.next),
    };
  } else if (block.type === "paths") {
    return {
      ...block,
      blocks:
        blockIns.children?.map((child) => {
          return exportBlock(child);
        }) || [],
    };
  } else if (block.type === "loop") {
    return {
      ...block,
      blocks: blockIns.innerBlock && exportBlocks(blockIns.innerBlock),
    };
  } else {
    return block;
  }
}

export function exportBlocks(root: FlowBlock): Block[] {
  let current: FlowBlock | undefined = root;
  const blocks: Block[] = [];
  while (current) {
    blocks.push(exportBlock(current));
    current = current.next;
  }
  return blocks;
}
