import { IPaasCommonFormFieldProps, IPaasFormFieldEditorConfig } from "@/type";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useMemo } from "react";

const format = "YYYY-MM-DD HH:mm:ss";
const defaultValueFormat = "accurateToMilliseconds";

export default function CustomDatetimePicker(
  props: IPaasCommonFormFieldProps<any> &
    IPaasFormFieldEditorConfig["DatetimePicker"]
) {
  const { valueFormat = defaultValueFormat, value } = props;

  const formatData = (e: any) => {
    if (valueFormat === "accurateToSeconds") {
      return e.unix();
    } else if (valueFormat === "accurateToMilliseconds") {
      return e.valueOf();
    } else {
      return e.format(valueFormat);
    }
  };

  const formatValue = useMemo(() => {
    if (valueFormat === "accurateToSeconds") {
      return dayjs.unix(value).format(format);
    } else if (valueFormat === "accurateToMilliseconds") {
      return dayjs(value).format(format);
    } else {
      return dayjs(value).format(format);
    }
  }, [value]);

  return (
    <DatePicker
      showTime
      {...props}
      value={props.value ? dayjs(formatValue) : null}
      onChange={(e) => {
        if (e) {
          props.onChange?.(formatData(e));
        } else {
          props.onChange?.(null);
        }
      }}
      style={{ width: "100%" }}
      format={format}
      disabledDate={() => false}
    />
  );
}
