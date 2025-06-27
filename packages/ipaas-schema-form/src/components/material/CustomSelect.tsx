import { useIpaasSchemaStore } from "@/store";
import { IPaasFormFieldEditorConfig } from "@/type";
import { SearchOutlined } from "@ant-design/icons";
import { useDebounceFn, useRequest } from "ahooks";
import { Divider, Form, Input, Select, SelectProps, Skeleton } from "antd";
import { useEffect, useRef, useState } from "react";

export default function CustomSelect(
  props: {
    value: any;
    selectCache?: {
      value: any;
      label: string;
    }[];
  } & IPaasFormFieldEditorConfig["Select"] &
    SelectProps
) {
  const {
    depItems,
    isDynamic,
    dynamicScript,
    selectCache: selectCache,
    ...otherProps
  } = props;
  const { dynamicDebounce, dynamicScriptExcuteWithOptions } =
    useIpaasSchemaStore();
  const [options, setOptions] = useState([] as any[]);
  const shouldRefreshOptions = useRef(true);

  const { run: searchOptions, loading } = useRequest(
    async () => {
      if (isDynamic === false) return;
      if (!dynamicScript || !dynamicScriptExcuteWithOptions) return;
      const res = await dynamicScriptExcuteWithOptions({
        script: dynamicScript,
        extParams: {},
      });
      setOptions(res);
      shouldRefreshOptions.current = false;
    },
    {
      manual: true,
    }
  );

  const { run: debounceRun } = useDebounceFn(
    () => {
      searchOptions();
    },
    {
      wait: dynamicDebounce,
    }
  );

  const preDepValuesRef = useRef<any[]>([]);
  const depValues = Form.useWatch(depItems);

  useEffect(() => {
    if (JSON.stringify(depValues) !== JSON.stringify(preDepValuesRef.current)) {
      shouldRefreshOptions.current = true;
      preDepValuesRef.current = depValues || [];
    }
  });

  return (
    <Select
      labelRender={(labelInvalue) => {
        const { label, value } = labelInvalue;

        if (label) {
          return label;
        }
        const item = selectCache?.find((it) => it.value === value);
        return item?.label || value;
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
                onChange={debounceRun}
                // onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
            <Divider style={{ margin: "0px 0" }} />
            <div>
              {loading ? <Skeleton active paragraph={{ rows: 3 }} /> : menu}
            </div>
          </div>
        );
      }}
      onOpenChange={(open) => {
        if (open && shouldRefreshOptions.current) {
          searchOptions();
        }
      }}
      {...otherProps}
    ></Select>
  );
}
