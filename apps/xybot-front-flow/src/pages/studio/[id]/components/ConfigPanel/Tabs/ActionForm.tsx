import { IPaasFormSchema, IpaasSchemaForm } from "@xybot/ipaas-schema-form";
import "@xybot/ipaas-schema-form/styles.css";
import { Button, Form } from "antd";
import { ComponentType } from "react";

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
];

export type FormItemValueType = {
  label?: string;
  value: any;
  type?: string;
  expression?: string;
};

function FormItemWarpper(Componet: ComponentType<any>) {
  return function FormItemWarpperComp(props: {
    value: FormItemValueType;
    onChange: (value: FormItemValueType) => void;
  }) {
    console.log("FormItemWarpperComp props", props);
    return (
      <Componet
        {...props}
        value={props.value?.value}
        label={props.value?.label}
        onChange={(v: any) => {
          console.log("FormItemWarpperComp onChange", v);
          if (typeof v === "object") {
            v = v.target?.value;
          }
          props.onChange?.({ ...props.value, value: v });
        }}
      />
    );
  };
}

export default function ActionForm() {
  const [form] = Form.useForm();
  return (
    <div className="flex flex-col">
      <IpaasSchemaForm
        id="custom-form"
        schema={testSchema}
        form={form}
        commonEditorWarpper={FormItemWarpper}
        normalize={(v) => v.value} // 只返回 value 字段
        initialValues={{
          test_input: {
            value: "你大爷的",
            label: "222",
            type: "string",
          },
          test_input_4: {
            value: "你大爷的",
            label: "你大爷的label",
            type: "string",
          },
        }}
        dynamicScriptExcuteWithOptions={async (config: {
          script: string;
          extParams: Record<string, any>;
        }) => {
          console.log("dynamicScriptExcuteWithOptions config", config);
          return [
            { label: "选项1", value: "option1" },
            { label: "选项2", value: "option2" },
            { label: "选项3", value: "option3" },
          ];
        }}
      />
      <Button
        type="primary"
        onClick={() => {
          console.log("form.getFieldsValue()", form.getFieldsValue());
          form.validateFields();
        }}
      >
        完成
      </Button>
    </div>
  );
}
