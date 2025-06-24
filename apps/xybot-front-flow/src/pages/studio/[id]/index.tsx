import { CircleLoader } from "@/components/CircleLoader";
import { StudioFlowModel } from "./StudioFlowModel";
import { Block, FixedFlowLayout } from "@fixedflow/layout";
import "@fixedflow/layout/styles.css";

function CustomNodeRenderer({ data }: Block<WorkflowNode>) {
  return (
    <div className=" flex flex-col bg-white rounded-md shadow-md border overflow-hidden border-gray-300 w-[300px] hover:shadow-lg hover:border-blue-400 transition-all duration-200">
      <div className=" px-4 py-2 bg-[linear-gradient(to_top,rgb(0,0,0,0.0)_0%,rgba(242,242,255)_100%)]">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <img src={data?.iconUrl} alt="" className=" w-6 h-6 object-cover" />
            <span className=" text-sm ">{data?.connectorName}</span>
          </div>
        </div>
      </div>
      <div className=" px-4">
        <div className=" devider h-[1px] bg-gray-300"></div>
      </div>
      <div className="px-4 py-3 pb-4">
        <div
          className=" text-gray-700"
          style={{
            lineHeight: "2",
            wordBreak: "break-all",
            wordWrap: "break-word",
          }}
        >
          {/* <HighlightTemplate content={data?.description || "无描述"} /> */}
        </div>
      </div>
    </div>
  );
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
    return <CircleLoader />;
  }

  return (
    <div className=" h-[100vh] bg-[#f2f3f5]">
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
        viewMode
      />
    </div>
  );
}
