export const WaitConnector: IPaaSConnectorDetail = {
  name: "等待",
  code: "Wait",
  version: "V1",
  iconUrl:
    "https://xybot-oss-dev-1302949341.cos.ap-shanghai.myqcloud.com/rpa/connector_logo_1739757478689",
  description: "等待一段时间",
  actions: [
    {
      code: "waitForTime",
      name: "等待一段时间",
      description: "适用于需要短暂延迟一段时间再执行的流程",
      viewMeta: {
        inputs: [
          {
            name: "等待时长",
            code: "waitTime",
            type: "integer",
            editor: {
              kind: "Number",
              config: {
                defaultValue: "5",
              },
            },
            required: true,
            validateRules:
              "function main(value, formValue) { const time = formValue.timeUnit === 'minute' ? Number(value) * 60 : Number(value) ; if(time < 5 || time > 300) throw new Error('超出等待时长范围; 最小为5秒, 最大为5分钟')}",
          },
          {
            name: "时间单位",
            code: "timeUnit",
            type: "string",
            editor: {
              kind: "Select",
              config: {
                defaultValue: "second",
                options: [
                  { label: "秒", value: "second" },
                  { label: "分", value: "minute" },
                ],
              },
            },
            required: true,
          },
        ],
      },
      outputStruct: [],
      hidden: false,
    },
  ],
  triggers: [],
  needAuth: false,
};
