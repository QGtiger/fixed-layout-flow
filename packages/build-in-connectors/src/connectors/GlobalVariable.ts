export const GlobalVariableConnector: IPaaSConnectorDetail = {
  name: "全局变量",
  code: "GlobalVariable",
  version: "V1",
  iconUrl:
    "https://xybot-oss-dev-1302949341.cos.ap-shanghai.myqcloud.com/rpa/connector_logo_1740383083928",
  description: "全局变量",
  documentLink: "https://www.yingdao.com/yddoc/rpa/819092907966865408",
  actions: [
    {
      code: "setGlobalVariable",
      name: "设置变量值",
      description: "对已经存在的“自定义变量”重新赋值",
      viewMeta: {
        inputs: [
          {
            name: "变量名",
            code: "variableKey",
            visible: true,
            type: "string",
            editor: {
              kind: "VariableSelect",
              config: {},
            },
            required: true,
            validateRules: "function main(value, formValue) {   return true; }",
          },
          {
            name: "变量值",
            code: "variableValue",
            visible: true,
            type: "string",
            editor: {
              kind: "Textarea",
              config: {},
            },
            required: true,
            validateRules: "function main(value, formValue) {   return true; }",
          },
        ],
      },
      outputStruct: [
        {
          name: "variableValue",
          label: "变量值",
          type: "string",
        },
        {
          name: "variableName",
          label: "变量名",
          type: "string",
        },
        {
          name: "variableKey",
          label: "变量key",
          type: "string",
        },
      ],
      hidden: false,
    },
  ],
  triggers: [],
  needAuth: false,
};
