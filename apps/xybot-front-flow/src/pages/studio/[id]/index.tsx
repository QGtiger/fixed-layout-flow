import { StudioFlowModel } from "./StudioFlowModel";
import { Block, FixedFlowLayout } from "@fixedflow/layout";
import "@fixedflow/layout/styles.css";
import { GeometricLoader } from "@/components/GeometricLoader";
import CustomNode from "./components/CustomNode";
import ConfigPanel from "./components/ConfigPanel";

import {
  defaultPathRuleData,
  generateNodeData,
  pathRuleData,
} from "./buildInConnector";
import AddNodeModal from "./components/AddNodeModal";
import { IPaaSModel } from "./IPaaSModel";
import {
  EndConnector,
  LoopConnector,
  PathsConnector,
} from "@xybot/build-in-connectors";
import { Modal } from "antd";

function CustomNodeRenderer({ data, id }: Block<WorkflowNode>) {
  if (!data) return null;
  return <CustomNode {...data} id={id} />;
}

function PlaceholderRenderer() {
  return (
    <div className="flex items-center justify-center h-full bg-gray-100 border-dashed border-2 border-gray-300 rounded-md w-[300px] p-2">
      <span className="text-gray-500">空白节点</span>
    </div>
  );
}

export default function StudioDetail() {
  const { blocks, loading } = StudioFlowModel.useModel();
  const { queryIPaaSConnectorDetail } = IPaaSModel.useModel();
  console.log("blocks", blocks, loading);
  const [modal, modalHolder] = Modal.useModal();

  if (loading) {
    return <GeometricLoader />;
  }

  return (
    <div className=" h-full bg-[#f2f3f5] relative overflow-hidden">
      <FixedFlowLayout
        initialBlocks={blocks}
        pathRuleInsertIndex={-1}
        // @ts-expect-error 类型推导错误
        nodeRenderer={CustomNodeRenderer}
        placeholderRenderer={PlaceholderRenderer}
        edgeStokeStyle={{
          stroke: "#cccccc",
          strokeWidth: 2,
        }}
        defaultPathRuleList={[pathRuleData, defaultPathRuleData]}
        pathRuleData={pathRuleData}
        onAddBlockByData={() => {
          return new Promise((r) => {
            const ins = modal.confirm({
              title: "添加节点",
              icon: null,
              width: 800,
              content: (
                <AddNodeModal
                  onItemClick={async ({ code, version }) => {
                    const detail = await queryIPaaSConnectorDetail({
                      code,
                      version,
                    });
                    let type: Block["type"] = "custom";
                    if (detail.code === LoopConnector.code) {
                      type = "loop";
                    } else if (detail.code === EndConnector.code) {
                      type = "end";
                    } else if (detail.code === PathsConnector.code) {
                      type = "paths";
                    }
                    ins.destroy();
                    r({
                      type,
                      data: generateNodeData({
                        connectorDetail: detail,
                      }),
                    });
                  }}
                />
              ),
            });
          });
        }}
      />

      <ConfigPanel />
      {modalHolder}
    </div>
  );
}
