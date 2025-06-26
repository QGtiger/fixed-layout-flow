import { motion, useAnimation } from "framer-motion";
import { StudioFlowModel } from "../../StudioFlowModel";
import { useEffect } from "react";
import { Resizable } from "re-resizable";
import { useSafeState } from "ahooks";
import { Popover } from "antd";
import { CloseOutlined, InfoCircleOutlined } from "@ant-design/icons";
import classNames from "classnames";
import { ConfigPanelModel } from "./model";
import { MinimalLoader } from "@/components/MinimalLoader";
import Tab from "./Tabs";

function Panel() {
  const { selectedNode, setSelectedId } = StudioFlowModel.useModel();
  const { loading } = ConfigPanelModel.useModel();
  const controls = useAnimation();
  const showPanel = !!selectedNode;
  const [safeSelectedNode, setSafeSelectedNode] = useSafeState(selectedNode!);

  useEffect(() => {
    selectedNode && setSafeSelectedNode(selectedNode!);
  }, [selectedNode]);

  const { iconUrl, sequence, connectorName, description, actionName, parent } =
    safeSelectedNode || {};

  useEffect(() => {
    if (showPanel) {
      // 如果有选中的节点，设置动画为进入状态
      controls.start({
        opacity: 1,
        x: 0,
      });
    } else {
      // 如果没有选中的节点，设置动画为退出状态
      controls.start({
        opacity: 0,
        x: "100%", // 向右移动100%
      });
    }
  }, [showPanel]);

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }} // 初始状态为透明并向右偏移
      animate={controls}
      transition={{
        duration: 0.3, // 动画持续时间
      }}
      id="config-panel"
      style={{
        height: "calc(100% - 10px)",
      }}
      className={classNames(
        " mr-2 flex flex-col   absolute right-0 top-0 pt-[36px] h-full",
        { " pointer-events-none": !showPanel }
      )}
    >
      <Resizable
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: true,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
        maxWidth={700}
        minWidth={400}
        defaultSize={{ width: 400, height: "100%" }}
        className="!h-full rounded-lg overflow-hidden  shadow-lg border border-gray-300 bg-white "
        style={{
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="relative h-[100%]" id="configPanel">
          <div
            className={`relative flex h-[100%] w-full flex-col items-center gap-[20px] overflow-hidden  px-[20px] py-[24px] shadow-[8px_0px_16px_#0a182d1a] ${""}`}
          >
            <div className="relative flex w-full flex-shrink-0 items-center self-stretch">
              <img
                className="relative h-[44px] w-[44px]"
                alt="Logo"
                src={iconUrl}
              />

              <div className="relative ml-[12px] flex flex-1 grow flex-col items-start">
                <div className="relative flex w-full flex-[0_0_auto] items-start justify-between self-stretch">
                  <div className="flex items-center">
                    <div className="relative mt-[-1.00px] w-fit text-[16px] font-normal leading-[normal] tracking-[0] text-primary-black [font-family:'PingFang_SC-Semibold',Helvetica] mr-[8px]">
                      {sequence}. {connectorName}
                    </div>

                    {description && (
                      <Popover
                        autoAdjustOverflow={true}
                        placement="bottom"
                        content={
                          <div className="max-w-[180px] min-w-[148px] max-h-[130px] text-gray-600 text-xs font-normal font-['PingFang SC'] leading-snug items-start">
                            {description}
                          </div>
                        }
                      >
                        <span className="text-[#748298]">
                          <InfoCircleOutlined className=" text-[16px] relative cursor-pointer" />
                        </span>
                      </Popover>
                    )}
                  </div>

                  <div className="flex  items-center gap-[8px]">
                    {/* {documentLink && (
                      <div className="w-[72px] h-[22px] flex-col justify-center items-end inline-flex">
                        <a
                          href={documentLink}
                          target="__blank"
                          className="text-blue-500 text-xs font-normal font-['PingFang SC'] leading-snug cursor-pointer"
                        >
                          帮助文档
                        </a>
                      </div>
                    )} */}
                    <CloseOutlined
                      className=" text-secondary-grey cursor-pointer"
                      onClick={() => {
                        setSelectedId("");
                      }}
                    />
                  </div>
                </div>
                <div className="relative mt-[4px]  w-fit text-[16px] leading-[normal] text-gray-500 text-xs [font-family:'PingFang_SC-Regular',Helvetica]">
                  {actionName || "选择" + (!parent ? "事件" : "操作")}
                </div>
              </div>
            </div>
            <div className="relative ml-[-1.00px] mr-[-1.00px] h-[1.5px] w-full self-stretch bg-gray-200 flex-shrink-0" />
            <div className="relative flex w-full flex-grow-1 flex-col gap-[7px] self-stretch overflow-hidden">
              {/* <Tab key={`${connector?.code}-${nodeData.sequence}`} /> */}
              {loading ? <MinimalLoader /> : <Tab />}
            </div>
          </div>
        </div>
      </Resizable>
    </motion.div>
  );
}

export default function ConfigPanel() {
  return (
    <ConfigPanelModel.Provider>
      <Panel />
    </ConfigPanelModel.Provider>
  );
}
