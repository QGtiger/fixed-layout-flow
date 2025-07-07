export const LoopConnector: IPaaSConnectorDetail = {
  name: "循环",
  code: "Loop",
  version: "V1",
  iconUrl:
    "https://winrobot-pub-a-1302949341.cos.ap-shanghai.myqcloud.com/image/20240914094233/a4db454aae8d3773af29622c48bdf1f2.svg",
  description: "依次循环数组中的每一项进行自动化操作",
  documentLink: "https://www.yingdao.com/yddoc/iPaaS/734713662211788800",
  actions: [
    {
      code: "forEach",
      name: "forEach循环",
      description: "依次循环数组中的每一项进行自动化操作",
      viewMeta: {
        inputs: [
          {
            code: "loopItem",
            name: "循环列表",
            description: "待循环遍历的列表",
            type: "any",
            editor: {
              kind: "Input",
              config: {},
            },
            required: true,
          },
        ],
      },
      outputStruct: [
        {
          name: "item",
          label: "item",
          type: "any",
        },
        {
          name: "index",
          label: "index",
          type: "number",
        },
      ],
      hidden: false,
    },
    {
      code: "forCount",
      name: "For 次数循环",
      description: "执行指定次数的自动化操作",
      viewMeta: {
        inputs: [
          {
            code: "start",
            name: "起始值",
            description: "循环的起始数值(最小为1)",
            type: "number",
            editor: {
              kind: "InputNumber",
              config: {
                min: 1,
                step: 1,
                precision: 0,
                defaultValue: 1,
              },
            },
            required: true,
            validateRules:
              "function main(value, formValue) {\n if(value < 1) throw new Error('起始值不能小于1')\n return true;\n}",
          },
          {
            code: "end",
            name: "结束值",
            description: "循环的结束数值(最小为1)",
            type: "number",
            editor: {
              kind: "InputNumber",
              config: {
                min: 1,
                step: 1,
                precision: 0,
                defaultValue: 2,
              },
            },
            required: true,
            validateRules:
              "function main(value, formValue) {\n if(value < 1) throw new Error('结束值不能小于1')\n if(value <= formValue.start) throw new Error('结束值必须大于起始值')\n const loopCount = Math.ceil((value - formValue.start) / formValue.step)\n return true;\n}",
          },
          {
            code: "step",
            name: "递增值",
            description: "每次循环的递增值(必须为整数)",
            type: "number",
            editor: {
              kind: "InputNumber",
              config: {
                min: 1,
                step: 1,
                precision: 0,
                defaultValue: 1,
              },
            },
            required: true,
            validateRules:
              "function main(value, formValue) {\n if(value <= 0) throw new Error('递增值必须大于0')\n if(value > (formValue.end - formValue.start)) throw new Error('递增值必须小于(结束值-起始值)')\n return true;\n}",
          },
        ],
      },
      outputStruct: [
        {
          name: "item",
          label: "item",
          type: "any",
        },
        {
          name: "index",
          label: "index",
          type: "number",
        },
      ],
      hidden: true,
    },
  ],
  triggers: [],
  needAuth: false,
};
