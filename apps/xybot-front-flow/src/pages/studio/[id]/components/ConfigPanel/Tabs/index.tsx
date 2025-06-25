import { Fragment } from "react";
import { ConfigPanelModel } from "../model";
import { Tooltip } from "antd";
import classNames from "classnames";
import TabCompletedIcon from "@/assets/icon_tab_completed.svg?react";
import TabNextIcon from "@/assets/icon_tab_next.svg?react";
import { ActionList } from "./ActionList";
import { StudioFlowModel } from "../../../StudioFlowModel";
import ScrollContent from "@/components/ScrollContent";
import ActionAuth from "./ActionAuth";

export default function Tab() {
  const { tabs, activeTab, setActiveTab, panelDesc } =
    ConfigPanelModel.useModel();
  const { actionList } = ConfigPanelModel.useModel();
  const { selectedNode } = StudioFlowModel.useModel();

  return (
    <div className="flex h-full flex-col">
      {tabs.length ? (
        <div className="h-full flex flex-col gap-4">
          <div className="relative inline-flex flex-[0_0_auto] items-center gap-[12px]">
            {tabs.map((tab, index) => {
              const { disabled } = tab;
              const isTabActive = activeTab === tab.key;
              return (
                <Fragment key={index}>
                  <Tooltip title={disabled ? "请先完成前面的步骤" : ""}>
                    <div
                      className={classNames(
                        "relative inline-flex flex-[0_0_auto] cursor-pointer items-center gap-[2px] border-0 border-b-[1.5px] border-transparent border-solid",
                        {
                          "  border-gray-500": isTabActive,
                        },
                        disabled
                          ? " !cursor-not-allowed text-[#75829880]"
                          : "text-primary-black"
                      )}
                      onClick={() => {
                        disabled || setActiveTab(tab.key);
                      }}
                    >
                      <div
                        className={classNames(
                          "relative mt-[-1.00px] w-fit max-w-[80px] overflow-hidden overflow-ellipsis whitespace-nowrap text-[14px] leading-[26px] tracking-[0]"
                        )}
                      >
                        {tab.name}
                      </div>
                      {tab.completed && (
                        <TabCompletedIcon className="!relative !h-[16px] !w-[16px]" />
                      )}
                    </div>
                  </Tooltip>
                  {index !== tabs.length - 1 && (
                    <TabNextIcon
                      className={classNames(
                        "relative h-[12px] w-[12px]",
                        disabled && "opacity-50"
                      )}
                    />
                  )}
                </Fragment>
              );
            })}
          </div>
          <ScrollContent
            className="h-1 flex-1  scroll-content relative"
            scrollClassName="h-full"
          >
            <div
              className={classNames("h-full", {
                " hidden": activeTab !== "action",
              })}
            >
              <ActionList
                actionList={actionList}
                activeCode={selectedNode?.actionCode}
              />
            </div>

            <div
              className={classNames("h-full", {
                " hidden": activeTab !== "auth",
              })}
            >
              <ActionAuth authId={selectedNode?.authId} />
            </div>
          </ScrollContent>
        </div>
      ) : (
        panelDesc
      )}
    </div>
  );
}
