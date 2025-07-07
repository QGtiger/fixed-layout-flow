export const JSONConnector: IPaaSConnectorDetail = {
  name: "JSON 助手",
  code: "JSONHelper",
  version: "V1",
  iconUrl:
    "https://winrobot-pub-a-1302949341.cos.ap-shanghai.myqcloud.com/image/20240401164500/4e354f6bc1c794e08fe79ddd3ebc926f.svg",
  description: "JSON 助手",
  documentLink: "https://www.yingdao.com/yddoc/iPaaS/729939963624497152",
  actions: [
    {
      code: "jsonparse",
      name: "JSON Parse",
      description: "反序列化，将JSON 字符串解析为对象",
      viewMeta: {
        inputs: [
          {
            name: "源字符串",
            code: "source",
            type: "object",
            editor: {
              kind: "Input",
              config: {
                defaultValue: "",
              },
            },
            required: true,
          },
        ],
      },
      outputStruct: [
        {
          key: "4021c0bf-e39f-4b37-b466-92ee28548958",
          name: "targetJSON",
          label: "目标 JSON",
          type: "object",
        },
      ],
      hidden: false,
    },
    {
      code: "jsonserialize",
      name: "JSON Serialize",
      description: "序列化，将对象转换为 JSON 字符串",
      viewMeta: {
        inputs: [
          {
            name: "源 JSON",
            code: "sourceJSON",
            type: "string",
            editor: {
              kind: "Input",
              config: {
                defaultValue: "",
              },
            },
            required: true,
          },
        ],
      },
      outputStruct: [
        {
          key: "06221fd9-1eb8-46d2-a636-e5c9d9d94e31",
          name: "targetString",
          label: "目标字符串",
          type: "string",
        },
      ],
      hidden: false,
    },
  ],
  triggers: [],
  needAuth: false,
};
