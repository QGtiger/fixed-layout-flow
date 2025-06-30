import { Select } from "antd";

const options: {
  value: DatePickerFormat;
  label: string;
}[] = [
  {
    value: "YYYY-MM-DD",
    label: "YYYY-MM-DD",
  },
  {
    value: "YYYY/MM/DD",
    label: "YYYY/MM/DD",
  },
];

export default function DatePickerFormatSelector({
  value,
  onChange,
}: {
  value?: DatePickerFormat;
  onChange?: (value: string) => void;
}) {
  return (
    <Select
      placeholder="请选择"
      value={value}
      onChange={onChange}
      options={options}
      variant="filled"
    />
  );
}
