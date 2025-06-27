import { useIpaasSchemaStore } from "@/store";
import { IPaasFormFieldEditorConfig } from "@/type";
import { clearFormValueWithSchema } from "@/utils";
import { useRequest } from "ahooks";
import { Form } from "antd";
import { useEffect, useRef } from "react";
import CreateSchemaFormItem from "../CreateSchemaFormItem";

export default function DynamicForm(
  props: {
    value: any;
    name: string;
  } & IPaasFormFieldEditorConfig["DynamicActionForm"]
) {
  const { depItems, dynamicScript, name, ...otherProps } = props;
  const formIns = Form.useFormInstance();
  const { dynamicDebounce, dynamicScriptExcuteWithFormSchema } =
    useIpaasSchemaStore();

  const {
    runAsync,
    data: subSchema,
    cancel,
  } = useRequest(
    async () => {
      if (!dynamicScript || !dynamicScriptExcuteWithFormSchema) return;
      return dynamicScriptExcuteWithFormSchema({
        script: dynamicScript,
      }).then((list) => {
        if (!Array.isArray(list)) {
          return console.error(
            "dynamicScriptExcuteWithFormSchema return value is not an array"
          );
        }

        const _schema = list.map((it) => {
          // 添加默认值
          if (!it.editor) {
            it.editor = {
              kind: "Input",
              config: {},
            };
          }
          return {
            ...it,
            code: Array.prototype.concat.call([], name, it.code),
          };
        });
        const filedValue = formIns?.getFieldValue(name.split(".")) || {};
        // 动态表单清洗熟悉，隐藏字段或者，不存在字段删除
        formIns?.setFieldValue(
          name,
          clearFormValueWithSchema(list, filedValue)
        );
        return _schema;
      });
    },
    {
      debounceWait: dynamicDebounce,
      manual: true,
    }
  );

  const preDepValuesRef = useRef<any[]>([]);
  const depValues = Form.useWatch(depItems || ["__gg__"]);

  useEffect(() => {
    if (JSON.stringify(depValues) !== JSON.stringify(preDepValuesRef.current)) {
      cancel();
      runAsync();
      preDepValuesRef.current = depValues;
    }
  });

  if (!subSchema) {
    return <div className="rounded-md bg-[#f2f3f5] p-2">Loading...</div>;
  }

  return (
    <div className=" rounded-md bg-[#f2f3f5] px-4 pt-2">
      {subSchema.length ? (
        <CreateSchemaFormItem schema={subSchema} formValues={props.value} />
      ) : (
        <div className="pb-2">无额外参数</div>
      )}
    </div>
  );
}
