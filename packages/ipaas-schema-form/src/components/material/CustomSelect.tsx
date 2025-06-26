import { useIpaasSchemaStore } from "@/store";
import { IPaasFormFieldEditorConfig } from "@/type";
import { SearchOutlined } from "@ant-design/icons";
import { useDebounceFn, useRequest } from "ahooks";
import { Divider, Form, Input, Select, Skeleton } from "antd";
import { useEffect, useRef, useState } from "react";

export default function CustomSelect(
  props: { value: any; label?: string } & IPaasFormFieldEditorConfig["Select"]
) {
  const { depItems, isDynamic, dynamicScript, label: selectLabel } = props;
  const { dynamicDebounce, dynamicScriptExcuteWithOptions } =
    useIpaasSchemaStore();
  const [options, setOptions] = useState([] as any[]);

  const { run, loading } = useRequest(
    async () => {
      if (isDynamic === false) return;
      if (!dynamicScript || !dynamicScriptExcuteWithOptions) return;
      const res = await dynamicScriptExcuteWithOptions({
        script: dynamicScript,
        extParams: {},
      });
      setOptions(res);
    },
    {
      debounceWait: dynamicDebounce,
      manual: true,
    }
  );

  const preDepValuesRef = useRef<any[]>([]);
  const depValues = Form.useWatch(depItems);

  useEffect(() => {
    if (JSON.stringify(depValues) !== JSON.stringify(preDepValuesRef.current)) {
      run();
      preDepValuesRef.current = depValues || [];
    }
  });

  return (
    <Select
      value={props.value}
      labelRender={(labelInvalue) => {
        const { label, value } = labelInvalue;

        if (label) {
          return value;
        }
        return selectLabel;
      }}
      options={options}
      popupRender={(menu) => {
        return (
          <div className="flex flex-col gap-2 p-2">
            <div className="s">
              <Input
                className="!p-0"
                variant="borderless"
                prefix={<SearchOutlined />}
                onChange={run}
              />
            </div>
            <Divider style={{ margin: "0px 0" }} />
            <div>
              {loading ? <Skeleton active paragraph={{ rows: 3 }} /> : menu}
            </div>
          </div>
        );
      }}
    ></Select>
  );
}
