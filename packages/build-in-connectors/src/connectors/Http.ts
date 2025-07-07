export const HttpConnector: IPaaSConnectorDetail = {
  name: "Http请求",
  code: "http",
  version: "V1",
  iconUrl:
    "https://xybot-oss-dev-1302949341.cos.ap-shanghai.myqcloud.com/rpa/connector_logo_1723175458670",
  description: "Http请求",
  documentLink: "https://www.yingdao.com/yddoc/flow/729641610180501504",
  actions: [
    {
      code: "sendRequest",
      name: "发送请求",
      description: "发送请求",
      viewMeta: {
        inputs: [
          {
            name: "请求方法",
            code: "method",
            visible: true,
            type: "string",
            editor: {
              kind: "Select",
              config: {
                options: [
                  {
                    label: "GET",
                    value: "GET",
                  },
                  {
                    label: "POST",
                    value: "POST",
                  },
                  {
                    label: "DELETE",
                    value: "DELETE",
                  },
                  {
                    label: "HEAD",
                    value: "HEAD",
                  },
                  {
                    label: "OPTIONS",
                    value: "OPTIONS",
                  },
                  {
                    label: "PATCH",
                    value: "PATCH",
                  },
                ],
              },
            },
            required: true,
          },
          {
            name: "请求URL",
            code: "url",
            visible: true,
            type: "string",
            editor: {
              kind: "Input",
              config: {},
            },
            required: true,
          },
          {
            name: "请求头",
            code: "header",
            visible: true,
            type: "string",
            editor: {
              kind: "Textarea",
              config: {
                defaultValue: "{}",
              },
            },
            required: false,
          },
          {
            name: "请求体",
            code: "body",
            visible: true,
            type: "string",
            editor: {
              kind: "Textarea",
              config: {
                defaultValue: "{}",
              },
            },
            required: false,
          },
          {
            name: "超时时间(s)",
            code: "timeout",
            visible: true,
            type: "string",
            editor: {
              kind: "InputNumber",
              config: {
                min: 1,
                max: 120,
                defaultValue: 30,
              },
            },
            required: false,
          },
        ],
      },
      outputStruct: [
        {
          key: "74abcdfd-bbc4-40fc-98d2-5256214fb7b8",
          name: "header",
          label: "响应头",
          type: "object",
        },
        {
          key: "090aba95-e551-49e0-a834-13eadff155c6",
          name: "body",
          label: "响应内容",
          type: "object",
        },
        {
          key: "15f66588-8b0a-41f5-be84-8df900770ae9",
          name: "statusCode",
          label: "响应状态码",
          type: "string",
        },
      ],
      hidden: false,
    },
  ],
  triggers: [],
  needAuth: false,
};
