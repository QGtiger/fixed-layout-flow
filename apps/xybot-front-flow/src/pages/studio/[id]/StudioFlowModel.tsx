import { request } from "@/api/request";
import { createCustomModel } from "@/common/createModel";
import { useCreation, useReactive, useRequest } from "ahooks";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import type { FixedFlowBlocks } from "@fixedflow/layout";

/**
 * 生成flowName
 * @returns
 */
export function generateFlowName() {
  return `新建任务_${Date.now()}`;
}

const WorkFlowEditRouterKey = "draft";

export function isDraftFlow(flowId: string) {
  return flowId === WorkFlowEditRouterKey;
}

export const StudioFlowModel = createCustomModel(() => {
  const { id } = useParams<"id">();
  const viewModel = useReactive({
    nodes: [] as WorkflowNode[],
  });
  if (!id) {
    throw new Error("Flow ID is required");
  }

  const { loading } = useRequest(async () => {
    if (isDraftFlow(id)) {
      // Handle draft flow logic here
      console.log("This is a draft flow");
    } else {
      return request<{
        meta: string;
      }>({
        method: "POST",
        url: "/api/flow/v1/flows/getFlowDetail",
        data: {
          flowId: id,
          env: "dev",
        },
      }).then(({ data }) => {
        if (data) {
          const r = JSON.parse(data.meta);
          viewModel.nodes = r.nodes || [];
        }
      });
    }
  });

  const { nodes: worlflows } = viewModel;

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

  return { loading, blocks };
});
