export const EndConnector: IPaaSConnectorDetail = {
  name: "终止流程",
  code: "Exit",
  version: "V1",
  iconUrl:
    "https://xybot-oss-dev-1302949341.cos.ap-shanghai.myqcloud.com/rpa/connector_logo_1740992990477",
  description: "立即结束流程，不再执行后续步骤",
  actions: [
    {
      code: "exitFlow",
      name: "终止流程",
      description: "执行到此节点时，整个工作流将立即终止",
      viewMeta: { inputs: [] },
      outputStruct: [],
      hidden: false,
    },
  ],
  triggers: [],
  needAuth: false,
};
