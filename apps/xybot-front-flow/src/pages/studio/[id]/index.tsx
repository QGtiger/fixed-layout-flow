import { StudioFlowModel } from "./StudioFlowModel";
import { Block, FixedFlowLayout } from "@fixedflow/layout";
import "@fixedflow/layout/styles.css";
import { GeometricLoader } from "@/components/GeometricLoader";
import CustomNode from "./components/CustomNode";
import ConfigPanel from "./components/ConfigPanel";

function CustomNodeRenderer({ data }: Block<WorkflowNode>) {
  if (!data) return null;
  return <CustomNode {...data} />;
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
  console.log("blocks", blocks, loading);

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
      />

      <ConfigPanel />
    </div>
  );
}
