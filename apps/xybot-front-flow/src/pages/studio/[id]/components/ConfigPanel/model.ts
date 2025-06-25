import { createCustomModel } from "@/common/createModel";
import { StudioFlowModel } from "../../StudioFlowModel";
import { IPaaSModel } from "../../IPaaSModel";
import { useReactive, useRequest } from "ahooks";
import { useEffect } from "react";

interface TabProps {
  completed: boolean;
  name: string;
  disabled?: boolean;
  key: "form" | "test" | "auth" | "action";

  hidden?: boolean;
}

export const ConfigPanelModel = createCustomModel(() => {
  const { selectedNode } = StudioFlowModel.useModel();
  const { queryIPaaSConnectorDetail } = IPaaSModel.useModel();
  const isTriggerNode = !selectedNode?.parent;

  const {
    connectorCode,
    version,
    actionCode,
    authId,
    formStatus,
    sample,
    description,
  } = selectedNode || {};

  const viewModel = useReactive({
    tabs: [] as TabProps[],
    activeTab: "action" as TabProps["key"],
  });

  const { data, loading, runAsync } = useRequest(
    async ({ code, version }: { code: string; version: string }) => {
      const detail = await queryIPaaSConnectorDetail({ code, version });

      const { actions, triggers, needAuth } = detail;

      const items = isTriggerNode ? triggers : actions;

      const actionItem = actions
        .concat(triggers)
        .find((item) => item.code === actionCode);

      const _tabs: TabProps[] = [
        {
          name: isTriggerNode ? "事件" : "操作",
          completed: !!actionCode,
          key: "action",
        },
        {
          name: "授权",
          completed: !!authId,
          key: "auth",
          hidden: !needAuth,
        },
        {
          name: "配置",
          completed: !!formStatus,
          key: "form",
          hidden: !actionItem?.viewMeta?.inputs?.length,
        },
        {
          name: "测试",
          completed: !!sample,
          key: "test",
          // TODO 特定连接器不需要测试
          hidden: false,
        },
      ];

      const tabs = _tabs.filter((item) => !item.hidden);
      // 只显示 action tab 并且 只有一个action => 不显示tab 显示 对应action的 描述文案
      if (viewModel.tabs.length === 1 && items.length === 1) {
        viewModel.tabs = [];
      } else {
        // disabled 依赖上一个 tab 的 completed 状态
        tabs.reduce((prev, curr) => {
          curr.disabled = !prev.completed;
          if (curr.disabled) {
            curr.completed = false;
          }
          return curr;
        });
        viewModel.tabs = tabs;
        const formIndex = tabs.findIndex((item) => item.key === "form");
        const unCompletedIndex = tabs.findIndex((item) => !item.completed);
        let i = 0;
        if (formIndex == -1) {
          // 没有配置的话
          i = unCompletedIndex;
        } else if (unCompletedIndex === -1) {
          // 没有未完成的 tab
          i = formIndex;
        } else {
          // 存在配置的话，
          i = unCompletedIndex > formIndex ? formIndex : unCompletedIndex;
        }
        viewModel.activeTab = tabs.at(i)?.key || "action";
      }

      return detail;
    },
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (connectorCode && version) {
      runAsync({ code: connectorCode, version });
    }
  }, [connectorCode, version]);

  return {
    connectorDetail: data,
    loading,
    isTriggerNode,
    actionList: (isTriggerNode ? data?.triggers : data?.actions) || [],
    ...viewModel,
    setActiveTab: (key: TabProps["key"]) => {
      viewModel.activeTab = key;
    },
    panelDesc: description || data?.description,
  };
});
