import classNames from "classnames";
import { StudioFlowModel } from "../StudioFlowModel";

export default function CustomNode(prop: WorkflowNode) {
  const { setSelectedId, selectedNode } = StudioFlowModel.useModel();
  return (
    <div
      onClick={() => {
        setSelectedId(prop.id);
      }}
      className={classNames(
        " flex flex-col bg-white rounded-md shadow-md border overflow-hidden border-gray-300 w-[300px] hover:shadow-lg hover:border-blue-400 transition-all duration-200",
        {
          " ring-2 ring-blue-400": selectedNode?.id === prop.id,
        }
      )}
    >
      <div className=" px-4 py-2 bg-[linear-gradient(to_top,rgb(0,0,0,0.0)_0%,rgba(242,242,255)_100%)]">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <img src={prop?.iconUrl} alt="" className=" w-6 h-6 object-cover" />
            <span className=" text-sm ">{prop?.connectorName}</span>
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
