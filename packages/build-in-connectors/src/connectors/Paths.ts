export const PathsNodeCode = "Path";

export const PathsConnector: IPaaSConnectorDetail = {
  code: PathsNodeCode,
  name: "分支",
  iconUrl: "",
  version: "1.0.0",
  description: "分支判断",
  documentLink: "https://www.yingdao.com/yddoc/iPaaS/729940208326426624?",
  needAuth: false,
  actions: [
    {
      code: "pathsWithRunOne",
      name: "分支",
      description: "互斥分支，从左到右依次进行条件判断，直至有一条分支能够运行",
      outputStruct: [],
      viewMeta: {},
    },
    // {
    //   code: 'broadcast',
    //   name: '广播',
    //   description: '非互斥分支，从左到右依次执行',

    //   inputs: [],
    //   hidden: true,
    // },
  ],

  triggers: [],
};
