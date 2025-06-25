import { Fragment } from "react";
import { ConfigPanelModel } from "./model";
import { Tooltip } from "antd";
import classNames from "classnames";
import TabCompletedIcon from "@/assets/icon_tab_completed.svg?react";
import TabNextIcon from "@/assets/icon_tab_next.svg?react";

export default function Tab() {
  const { tabs, activeTab, setActiveTab, panelDesc } =
    ConfigPanelModel.useModel();

  return (
    <div className="flex h-full flex-col">
      {tabs.length ? (
        <div className="h-full flex flex-col">
          <div className="relative inline-flex flex-[0_0_auto] items-center gap-[12px]">
            {tabs.map((tab, index) => {
              const { disabled } = tab;
              const isTabActive = activeTab === tab.key;
              return (
                <Fragment key={index}>
                  <Tooltip title={disabled ? "请先完成前面的步骤" : ""}>
                    <div
                      className={classNames(
                        "relative inline-flex flex-[0_0_auto] cursor-pointer items-center gap-[2px]",
                        {
                          active: isTabActive,
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
                          "relative mt-[-1.00px] w-fit max-w-[80px] overflow-hidden overflow-ellipsis whitespace-nowrap text-[14px] leading-[20px] tracking-[0]"
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
        </div>
      ) : (
        panelDesc
      )}
    </div>
  );
}
