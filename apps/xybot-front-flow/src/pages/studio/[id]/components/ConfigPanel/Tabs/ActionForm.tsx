import { IPaasFormSchema, IpaasSchemaForm } from "@xybot/ipaas-schema-form";
import "@xybot/ipaas-schema-form/styles.css";
import { Button, Checkbox, DatePicker, Form, TimePicker } from "antd";
import { ComponentType } from "react";
import { ConfigPanelModel } from "../model";
import dayjs from "dayjs";
import { request } from "@/api/request";
import { StudioFlowModel } from "../../../StudioFlowModel";

const testSchema: IPaasFormSchema[] = [
  {
    code: "test_input",
    name: "测试输入",
    type: "string",
    description: "这是一个测试输入框 [123](htas)",
    visible: true,
    required: true,
    group: "基础配置",
    editor: {
      kind: "Input",
      config: {
        defaultValue: "",
        placeholder: "请输入测试内容",
      },
    },
    validateRules: `function main(value, formData) {
    console.log("validateRules value", value);
    console.log("validateRules formData", formData);
    if (!value.startsWith("你大爷的")) {
      throw new Error("输入内容必须以'你大爷的'开头");
    }
    }`,
  },
  {
    code: "test_input_2",
    name: "测试输入2",
    type: "string",
    description: "这是一个测试输入框2",
    visible: true,
    required: true,
    visibleRules: 'test_input === "你大爷的"',
    group: "基础配置",
    editor: {
      kind: "Input",
      config: {
        defaultValue: "22333",
        placeholder: "请输入测试内容",
      },
    },
  },
  {
    code: "test_input_3",
    name: "测试输入3",
    type: "string",
    description: "这是一个测试输入框3",
    visible: true,
    required: true,
    group: "高级配置",
    editor: {
      kind: "Input",
      config: {
        defaultValue: "22333",
        placeholder: "请输入测试内容",
      },
    },
  },
  {
    code: "test_input_4",
    name: "测试输入3",
    type: "string",
    description: "这是一个测试输入框3",
    visible: true,
    required: true,
    group: "高级配置",
    editor: {
      kind: "Select",
      config: {
        placeholder: "请输入测试内容",
        isDynamic: true,
        dynamicScript: `function main() {
        return [
          { label: "选项1", value: "option1" },
          { label: "选项2", value: "option2" },
          { label: "选项3", value: "option3" },]
        }`,
        depItems: ["test_input_3"],
      },
    },
  },

  {
    code: "multi_select",
    name: "测试多选",
    type: "array",
    description: "这是一个测试多选框",
    required: true,
    group: "高级配置",
    editor: {
      kind: "MultiSelect",
      config: {
        placeholder: "请输入测试内容",
        isDynamic: true,
        dynamicScript: `function main() {
        return [
          { label: "选项1", value: "option1" },
          { label: "选项2", value: "option2" },
          { label: "选项3", value: "option3" },]
        }`,
        depItems: ["test_input_3"],
      },
    },
  },
];

export type FormItemValueType = {
  label?: string;
  value: any;
  type?: string;
  expression?: string;
  selectcache?: {
    value: any;
    label: string;
  }[];
};

function FormItemWarpper(Componet: ComponentType<any>) {
  return function FormItemWarpperComp(props: {
    value: FormItemValueType;
    onChange: (value: FormItemValueType) => void;
  }) {
    return (
      <Componet
        {...props}
        value={props.value?.value}
        selectcache={props.value?.selectcache}
        onChange={(v: any, option: any) => {
          if (typeof v === "object" && v.target) {
            v = v.target?.value;
          }
          props.onChange?.({
            ...props.value,
            value: v,
            selectcache: option ? [].concat(option) : undefined,
          });
        }}
      />
    );
  };
}

const ExtraEditorMap: Record<string, ComponentType<any>> = {
  TimePicker: (props: any) => {
    const format = "HH:mm";
    return (
      <TimePicker
        className="w-full"
        {...props}
        format={format}
        value={props.value ? dayjs(props.value, format) : null}
        onChange={(time) => {
          props.onChange(time?.format(format));
        }}
      />
    );
  },
  RangePicker: (props: any) => {
    const value = [
      props.value?.[0] ? dayjs(props.value[0]) : "",
      props.value?.[1] ? dayjs(props.value[1]) : "",
    ] as any;
    return (
      <DatePicker.RangePicker
        className="w-full"
        value={value}
        onChange={(e, dateString) => {
          props.onChange(dateString);
        }}
      />
    );
  },
  CheckboxGroup: Checkbox.Group,
};

function formValueNormalize(value: any): any {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    // 如果是对象，递归 normalize
    return Object.entries(value).reduce(
      (acc, [key, val]) => {
        acc[key] = formValueNormalize(normalize ? normalize(val) : val);
        return acc;
      },
      {} as Record<string, any>
    );
  }
  // 如果是基本类型，直接返回
  return value;
}

function normalize(v: any) {
  return v?.value;
}

export default function ActionForm() {
  const [form] = Form.useForm();
  const { actionItem } = ConfigPanelModel.useModel();
  const { selectedNode } = StudioFlowModel.useModel();

  if (!actionItem || !selectedNode) return;
  const { connectorCode, version, authId } = selectedNode;

  return (
    <div className="flex flex-col">
      <IpaasSchemaForm
        id="custom-form"
        editorMap={ExtraEditorMap}
        schema={actionItem.viewMeta.inputs || []}
        form={form}
        commonEditorWarpper={FormItemWarpper}
        normalize={normalize} // 只返回 value 字段
        // initialValues={{
        //   test_input: {
        //     value: "你大爷的",
        //     label: "222",
        //     type: "string",
        //   },
        //   test_input_4: {
        //     value: "你大爷的",
        //     type: "string",
        //     selectCache: [
        //       {
        //         value: "你大爷的",
        //         label: "你大爷的label",
        //       },
        //     ],
        //   },
        //   multi_select: {
        //     value: ["option1", "option2"],
        //     selectCache: [
        //       {
        //         label: "选项1",
        //         value: "option1",
        //       },
        //       {
        //         label: "选项2",
        //         value: "option2",
        //       },
        //     ],
        //   },
        // }}
        // dynamicScriptExcuteWithOptions={async (config: {
        //   script: string;
        //   extParams: Record<string, any>;
        // }) => {
        //   console.log("dynamicScriptExcuteWithOptions config", config);
        //   await new Promise((resolve) => setTimeout(resolve, 1000));
        //   return [
        //     { label: "选项1", value: "option1" },
        //     { label: "选项2", value: "option2" },
        //     { label: "选项3", value: "option3" },
        //   ];
        // }}

        dynamicScriptExcuteWithOptions={async (config) => {
          if (!config.script) return [];
          const formValues = formValueNormalize(form.getFieldsValue());
          console.log("dynamicScriptExcuteWithOptions formValues", formValues);
          const { data } = await request({
            url: "/api/tool/ipaas/dynamicData/execute",
            method: "POST",
            data: {
              connectorCode,
              connectorVersion: version,
              authId,
              script: config.script,
              inputs: {
                ...formValues,
                ...config.extParams, // 传入额外参数
              },
            },
          });
          return data?.data || [];
        }}
        dynamicScriptExcuteWithFormSchema={async (config) => {
          if (!config.script) return [];

          const formValues = formValueNormalize(form.getFieldsValue());
          const { data } = await request({
            url: "/api/tool/ipaas/dynamicData/execute",
            method: "POST",
            data: {
              connectorCode,
              connectorVersion: version,
              authId,
              script: config.script,
              inputs: formValues,
            },
          });
          return data?.data || [];
        }}
      />
      <Button
        type="primary"
        onClick={() => {
          console.log(
            "form.getFieldsValue()",
            form.getFieldValue(["robotUuid", ["value"]])
          );
          form.validateFields();
        }}
      >
        完成
      </Button>
    </div>
  );
}
