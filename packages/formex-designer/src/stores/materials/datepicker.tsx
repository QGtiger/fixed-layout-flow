import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useRef } from "react";

export default function CustomDatePicker(props: {
  format: DatePickerFormat;
  value?: any;
  onChange?: (value: any) => void;
  [key: string]: any;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { onChange, value, format } = props;
  return (
    <div ref={ref}>
      <DatePicker
        {...props}
        style={{ width: "100%" }}
        value={value && dayjs(value, format)}
        onChange={(date, dateString) => {
          onChange?.(dateString);
        }}
        getPopupContainer={() => ref.current || document.body}
      />
    </div>
  );
}
