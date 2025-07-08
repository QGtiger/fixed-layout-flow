import {
  IPaasFormSchema,
  IpaasSchemaForm,
  CustomInputWithCopy,
} from "@xybot/ipaas-schema-form";
import "@xybot/ipaas-schema-form/styles.css";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Segmented,
  TimePicker,
} from "antd";
import { ComponentType, useEffect } from "react";
import { ConfigPanelModel } from "../model";
import dayjs from "dayjs";
import { request } from "@/api/request";
import { StudioFlowModel } from "../../../StudioFlowModel";
import ConditionEditor from "./components/ConditionEditor";
import { getOrigin } from "@/utils/path";
import { useParams } from "react-router-dom";
import CustomFormexDesigner from "./components/FormexDesigner";
import { useBoolean, useCreation, useDebounceFn, useUpdate } from "ahooks";
import { deepClone, uploadFileByFlow } from "@/utils";
import classNames from "classnames";
import { motion } from "framer-motion";
import MonacoEditor from "./components/MonacoEditor";
import { CMEditor } from "./components/CMEditor";
import ScrollContent from "@/components/ScrollContent";

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

const noExpressionKinds = [
  "DynamicActionForm",
  "CheckboxGroup",
  "FormexDesigner",
  "ConditionEditor",
  "CodeEditor",
];

function FormItemWarpper(Componet: ComponentType<any>) {
  return function FormItemWarpperComp(props: {
    value: FormItemValueType;
    editorkind: string;
    onChange: (value: FormItemValueType) => void;
  }) {
    const { value: expValue } = props;
    const { value, isExpression = false, selectcache } = expValue || {};
    const [showExp, showExpAction] = useBoolean(false);
    const [hoverExp, hoverExpAction] = useBoolean(false);

    const noExpress = noExpressionKinds.includes(props.editorkind);

    const show = (showExp || hoverExp) && !noExpress;

    return (
      <div
        className=" relative"
        onMouseOver={hoverExpAction.setTrue}
        onMouseLeave={hoverExpAction.setFalse}
      >
        {isExpression ? (
          <CMEditor />
        ) : (
          <Componet
            {...props}
            value={value}
            selectcache={selectcache}
            onChange={(v: any, option: any) => {
              if (typeof v === "object" && v.target) {
                v = v.target?.value;
              }
              props.onChange?.({
                ...expValue,
                value: v,
                selectcache: option ? [].concat(option) : undefined,
              });
            }}
            onBlur={showExpAction.setFalse}
            onFocus={showExpAction.setTrue}
          />
        )}
        {!noExpress && (
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: show ? 1 : 0, y: show ? `-100%` : -18 }}
            transition={{ duration: 0.2 }}
            className={classNames(" absolute right-0 -top-0.5")}
          >
            <Segmented
              size="small"
              className=" bg-gray-300 text-xs"
              value={isExpression}
              onChange={(v) => {
                props.onChange?.({
                  ...expValue,
                  isExpression: v,
                });
              }}
              options={[
                {
                  value: false,
                  label: "常规",
                },
                {
                  value: true,
                  label: "高级",
                },
              ]}
            />
          </motion.div>
        )}
      </div>
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
  ScheduleDatetimePicker: (props: any) => {
    return (
      <DatePicker
        showTime
        format={{
          format: "YYYY-MM-DD HH:mm",
        }}
        className="w-full"
        value={props.value ? dayjs(props.value) : ""}
        onChange={(date, dateString) => {
          props.onChange(dateString);
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
  ConditionEditor,
  FormexDesigner: CustomFormexDesigner,
  CodeEditor: MonacoEditor,
  Webhook: CustomInputWithCopy,
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

function replaceTemplateText(text: string, data: any) {
  if (!text) return "";
  return text.replace(/{{(.*?)}}/g, (match, key) => {
    return data[key.trim()] || "";
  });
}

export default function ActionForm() {
  const [form] = Form.useForm();
  const { actionItem, selectedNode, updateNode } = ConfigPanelModel.useModel();
  const { id } = useParams<{ id: string }>();

  if (!actionItem || !selectedNode || !id) return <span></span>;
  const { connectorCode, version, authId, inputs } = selectedNode;

  const finalInputs: IPaasFormSchema[] = actionItem.viewMeta.inputs || [];
  finalInputs.forEach((it) => {
    if (it.editor?.kind === "InputWithCopy") {
      it.editor.config.defaultValue = replaceTemplateText(
        it.editor.config.defaultValue,
        {
          flowId: id,
          host: getOrigin(),
        }
      );
    }
  });

  return (
    <div className="flex flex-col  h-full gap-2">
      <ScrollContent
        className="h-1 flex-1  scroll-content relative "
        scrollClassName="h-full px-1"
      >
        <IpaasSchemaForm
          id="custom-form"
          editorMap={ExtraEditorMap}
          schema={finalInputs}
          form={form}
          uploadFile={uploadFileByFlow}
          onValuesChange={async () => {
            const status = await form
              .validateFields({
                validateOnly: true,
              })
              .then(
                () => true,
                ({ errorFields }) => {
                  return !errorFields?.length;
                }
              );
            updateNode({
              inputs: form.getFieldsValue(),
              formStatus: status,
            });
          }}
          // @ts-expect-error
          commonEditorWarpper={FormItemWarpper}
          normalize={normalize} // 只返回 value 字段
          initialValues={inputs}
          validatefield={({ form, name, value, validate }) => {
            return new Promise<void>(async (resolve, reject) => {
              const v: FormItemValueType = value;
              if (v?.isExpression) {
                resolve();
              } else {
                validate(v).then(resolve, reject);
              }
            });
          }}
          // validateTrigger={["onBlur"]}
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
            console.log(
              "dynamicScriptExcuteWithOptions formValues",
              formValues
            );
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

            console.log("query");

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
      </ScrollContent>
      <Button
        type="primary"
        onClick={() => {
          console.log(
            "form.getFieldsValue()",
            form.getFieldValue(["robotUuid", ["value"]]),
            form.getFieldsValue()
          );
          form.validateFields();
        }}
        className=" flex-shrink-0"
      >
        完成
      </Button>
    </div>
  );
}
