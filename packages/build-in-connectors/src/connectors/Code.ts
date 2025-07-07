export const CodeConnector: IPaaSConnectorDetail = {
  name: "运行代码",
  code: "codeConnector",
  version: "V1",
  iconUrl:
    "https://xybot-oss-dev-1302949341.cos.ap-shanghai.myqcloud.com/rpa/connector_logo_1725350516036",
  description: "python代码编辑器",
  documentLink: "https://www.yingdao.com/yddoc/iPaaS/734682280286654464",
  actions: [
    {
      code: "python",
      name: "Python",
      description: "编写python代码",
      viewMeta: {
        inputs: [
          {
            name: "输入参数",
            code: "params",
            visible: true,
            type: "string",
            editor: {
              kind: "CodeParams",
              config: {},
            },
            required: false,
          },
          {
            name: "代码",
            code: "code",
            visible: true,
            type: "string",
            editor: {
              kind: "CodeEditor",
              config: {
                defaultValue:
                  "# 当前python运行环境已经默认为您内置了基础工具包以及部分全局变量，具体信息请点击上方查看帮助文档进行查看。注：提供的python代码必须包含main函数，且函数内必须包含return，否则将会没有返回值\ndef main(arg1):\n    return 'Hello World'",
              },
            },
            required: true,
          },
        ],
      },
      outputStruct: [
        {
          key: "65bca693-bd6d-4123-b2a7-c70bb3d91577",
          name: "result",
          label: "执行结果",
          type: "any",
        },
      ],
      hidden: false,
    },
  ],
  triggers: [],
  needAuth: false,
};
