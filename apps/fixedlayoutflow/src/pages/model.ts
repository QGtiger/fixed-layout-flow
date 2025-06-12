import type { FixedFlowBlocks } from "@fixedflow/layout";
import { createCustomModel } from "../common/createModel";
import { useCreation, useMount, useReactive } from "ahooks";

import { Meta } from "./meta";
import { compress, uncompress } from "../utils";
import useWorkflowNodeMap from "./hooks/useWorkflowNodeController";

export interface FlowModelProps {
  worlflows: WorkflowNode[];
}

export const FlowModel = createCustomModel(() => {
  const viewModel = useReactive({
    worlflows: [] as WorkflowNode[],
    isLoading: true,
  });

  const { worlflows } = viewModel;

  useMount(() => {
    function loadWorkflowFromMeta(data: { nodes: WorkflowNode[] }) {
      viewModel.worlflows = data.nodes;
      viewModel.isLoading = false;
    }

    const nodeMeta = localStorage.getItem("fixedflow:nodeMeta");
    if (nodeMeta) {
      try {
        const parsedMeta = JSON.parse(nodeMeta);
        console.log("load workflow from localStorage", parsedMeta);
        loadWorkflowFromMeta(parsedMeta);
      } catch (error) {
        console.error("Failed to parse nodeMeta from localStorage", error);
      }
    }

    const hash = window.location.hash.slice(1);
    console.log("hash", compress(Meta));
    if (hash) {
      console.log(JSON.parse(uncompress(hash)));
      loadWorkflowFromMeta(JSON.parse(uncompress(hash)));
    }

    const flowOssUrl = new URL(location.href).searchParams.get("flowOssUrl");
    if (flowOssUrl) {
      fetch(decodeURIComponent(flowOssUrl))
        .then((res) => res.json())
        .then((data) => {
          loadWorkflowFromMeta(data);
        });
    }

    window.addEventListener("message", ({ data: eventData }) => {
      if (eventData.type === "fixedflow:load") {
        const { nodeMeta } = eventData.data;
        loadWorkflowFromMeta(JSON.parse(nodeMeta));
      }
    });

    //@ts-expect-error 累心该错误
    window["test"] = () => {
      window.postMessage(
        {
          type: "fixedflow:load",
          data: {
            nodeMeta: Meta,
          },
        },
        "*"
      );
    };
  });

  const blocks: FixedFlowBlocks = useCreation(() => {
    console.log("convert worlflows to blocks", worlflows);
    if (worlflows.length === 0) {
      return [];
    }
    const workflowMap = new Map<string, WorkflowNode>();
    worlflows.forEach((item) => {
      workflowMap.set(item.id, item);
    });

    function findNodeById(id: string): WorkflowNode {
      const node = workflowMap.get(id);
      if (!node) {
        throw new Error(`Node with id ${id} not found`);
      }
      return node;
    }

    function createBlocks(
      id: string,
      blocks: FixedFlowBlocks = []
    ): FixedFlowBlocks {
      const currNode = findNodeById(id);
      blocks.push(createBlock(currNode));

      if (currNode.next) {
        createBlocks(currNode.next, blocks);
      }

      return blocks;
    }

    function createBlock(node: WorkflowNode): FixedFlowBlocks[number] {
      const { id, connectorCode, next } = node;
      if (connectorCode === "Path") {
        return {
          id,
          type: "paths",
          data: node,
          blocks: node.children?.map((childId) => {
            const childNode = findNodeById(childId);
            return createBlock(childNode);
          }),
        };
      } else if (
        connectorCode === "PathRule" ||
        connectorCode === "DefaultPath"
      ) {
        return {
          id,
          type: "pathRule",
          data: node,
          blocks: next ? createBlocks(next) : [],
        };
      } else if (connectorCode === "Loop") {
        return {
          id,
          type: "loop",
          data: node,
          blocks: node.children?.[0] ? createBlocks(node.children[0]) : [],
        };
      } else if (!connectorCode) {
        return {
          id,
          type: "placeholder",
        };
      }

      return {
        id,
        type: "custom",
        data: node,
      };
    }

    return createBlocks(worlflows[0].id);
  }, [worlflows]);

  const nodeController = useWorkflowNodeMap(worlflows);

  return {
    blocks,
    ...viewModel,
    nodeController,
  };
});
