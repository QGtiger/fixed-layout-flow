import { useIpaasSchemaStore } from "@/store";
import { IPaasFormFieldEditorConfig } from "@/type";
import { SearchOutlined } from "@ant-design/icons";
import { useDebounceFn, useRequest } from "ahooks";
import { Divider, Form, Input, Select, SelectProps, Skeleton } from "antd";
import { useEffect, useRef, useState } from "react";

export default function CustomSelect(
  props: {
    value: any;
    name: string;
    selectcache?: {
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
    selectcache,
    options: propsOptions,
    name,
    ...otherProps
  } = props;
  const { dynamicDebounce, dynamicScriptExcuteWithOptions } =
    useIpaasSchemaStore();
  const [options, setOptions] = useState(propsOptions || ([] as any[]));
  const shouldRefreshOptions = useRef(!!isDynamic);
  const [sk, setSk] = useState("");

  const { run: searchOptions, loading } = useRequest(
    async () => {
      if (!dynamicScript || isDynamic === false) {
        if (!propsOptions) return;
        // 不是动态的话，走静态模糊匹配
        const _opts = !sk
          ? propsOptions
          : propsOptions?.filter((item) => {
              return (
                // @ts-expect-error
                item?.label?.toLowerCase?.().includes(sk.toLowerCase()) ||
                // @ts-expect-error
                item?.value?.toLowerCase?.().includes(sk.toLowerCase())
              );
            });
        setOptions(_opts || []);
      } else {
        if (!dynamicScript || !dynamicScriptExcuteWithOptions) return;
        const res = await dynamicScriptExcuteWithOptions({
          script: dynamicScript,
          extParams: {
            [name]: sk,
          },
        });
        setOptions(res);
      }
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
  const depValues = Form.useWatch(depItems || ["__gg__"]);

  useEffect(() => {
    if (JSON.stringify(depValues) !== JSON.stringify(preDepValuesRef.current)) {
      shouldRefreshOptions.current = true;
      preDepValuesRef.current = depValues;
    }
  });

  return (
    <Select
      labelRender={(labelInvalue) => {
        const { label, value } = labelInvalue;

        if (label) {
          return label;
        }
        const item = selectcache?.find((it) => it.value === value);
        return item?.label || value;
      }}
      popupRender={(menu) => {
        return (
          <div className="flex flex-col gap-2 p-2">
            <div className="s">
              <Input
                value={sk}
                className="!p-0"
                variant="borderless"
                prefix={<SearchOutlined />}
                onChange={(e) => {
                  setSk(e.target.value);
                  debounceRun();
                }}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="搜索选项"
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
      options={options}
    ></Select>
  );
}
