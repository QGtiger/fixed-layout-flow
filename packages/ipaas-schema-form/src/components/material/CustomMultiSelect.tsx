import { Tooltip } from "antd";
import CustomSelect from "./CustomSelect";

export default function CustomMultiSelect(props: any) {
  return (
    <CustomSelect
      mode="multiple"
      maxTagPlaceholder={(omittedValues) => (
        <Tooltip title={omittedValues.map(({ label }) => label).join(", ")}>
          <span>+{omittedValues.length}...</span>
        </Tooltip>
      )}
      maxTagCount="responsive"
      showSearch={false}
      {...props}
    ></CustomSelect>
  );
}
