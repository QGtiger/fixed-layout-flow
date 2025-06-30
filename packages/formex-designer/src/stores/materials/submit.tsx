import { Button, ConfigProvider } from "antd";
import { FormexModel } from "../FormexModel";

export default function Submit(
  props: MaterialItemProps<{
    text: string;
    textColor?: string;
  }>
) {
  const { disableSubmit, onFormexFinish } = FormexModel.useModel();
  return (
    <Button
      type="primary"
      // htmlType="submit"
      block
      style={{
        color: props.textColor,
      }}
      onClick={(e) => {
        if (!disableSubmit) {
          onFormexFinish();
        }
      }}
    >
      {props.text}
    </Button>
  );
}
