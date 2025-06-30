export const PathRuleCode = "PathRule";

export const DefaultPathConnector: IPaaSConnectorDetail = {
  code: "DefaultPath",
  description: "默认分支",
  name: "默认分支",
  iconUrl: "",
  needAuth: false,
  version: "1.0.0",
  hidden: true,
  actions: [
    {
      code: "pathElse",
      name: "默认分支",
      description: "默认分支",

      viewMeta: {
        inputs: [],
      },
      outputStruct: [],
    },
  ],

  triggers: [],
};

export const PathRuleConnector: IPaaSConnectorDetail = {
  code: PathRuleCode,
  name: "分支判断",
  iconUrl: "",
  version: "1.0.0",
  description: "分支判断",
  hidden: true,
  needAuth: false,
  actions: [
    {
      code: "pathIf",
      name: "分支判断",
      description: "分支判断",
      viewMeta: {
        inputs: [
          {
            code: "condition",
            name: "分支条件",
            type: "array",
            description: "如同时满足多个分支，按优先级运行第一个匹配分支",
            editor: {
              kind: "ConditionEditor",
              config: {
                defaultValue: [{ add: [{}] }],
              },
            },
            visibleRules: `function main(value, formValue) {
              console.log(value, formValue);
            }`,
          },
        ],
      },
      outputStruct: [
        {
          name: "result",
          label: "判断结果",
          type: "boolean",
        },
      ],
    },
  ],

  triggers: [],
};
