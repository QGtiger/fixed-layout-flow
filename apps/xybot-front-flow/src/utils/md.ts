import { ENV, setGlobalBuryConfig, sendBuryById } from '@xybot/bury';

export enum MDType {
  ADD_TRIGGER = 'add_trigger',
  ADD_ACTION = 'add_action',

  SWITCH_TRIGGER_ITEM = 'switch_trigger_item',

  SWITCH_ACTION_ITEM = 'switch_action_item',

  SEARCH_NODE = 'search_node',

  ADD_FLOW = 'add_flow',

  DEPLOY_FLOW = 'deploy_flow',
}

interface FlowInfo {
  connectors: string[];
  name: string;
  creator: string;
  trigger: {
    actionCode: string;
    actionName: string;
    connectorCode: string;
    connectorName: string;
    connectorVersion: string;
    meta: string;
    triggerType: string;
  };
  flowId: string;
  flowVersion: string;
}

// 通过埋点类型，推导埋点params
type MDParams = {
  [MDType.ADD_TRIGGER]: {
    triggerName: string;
    triggerCode: string;
    version: string;
  };
  [MDType.ADD_ACTION]: {
    actionName: string;
    actionCode: string;
    version: string;
  };
  [MDType.SWITCH_TRIGGER_ITEM]: {
    triggerName: string;
    triggerCode: string;
    version: string;

    triggerItemName: string;
    triggerItemCode: string;
    triggerItemType: string;
  };
  [MDType.SWITCH_ACTION_ITEM]: {
    actionName: string;
    actionCode: string;
    version: string;

    actionItemName: string;
    actionItemCode: string;
  };
  [MDType.SEARCH_NODE]: {
    searchKey: string;
  };

  [MDType.ADD_FLOW]: FlowInfo;

  [MDType.DEPLOY_FLOW]: FlowInfo;
};

export function initMdConfig(userInfo: {
  name: string;
  uuid: string;
  enterpriseRoleCode: string;
  enterpriseUserName: string;
  enterprise: {
    name: string;
  };
}) {
  localStorage.setItem('uuid', userInfo.uuid);
  localStorage.setItem('user', JSON.stringify(userInfo));
  localStorage.setItem('userName', userInfo.name);
  localStorage.setItem('enterpriseName', userInfo.enterprise.name);

  setGlobalBuryConfig({
    useConsoleUrl: true,
    beforeReport: (data) => {
      if (data?.body) {
        // @ts-expect-error 类型错误
        data.body.project = 'flow';
      }
      return data;
    },
  });
}

export function sendBuryByFlow<T extends MDType>(type: T, params: MDParams[T]) {
  sendBuryById(type, params);
}
