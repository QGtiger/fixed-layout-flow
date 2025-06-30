import { IPaasCommonFormFieldProps } from "@/type";
import { Button, Input, message, Space } from "antd";
import { getLocals } from "@/utils";

function copyText(text: string) {
  const input = document.createElement("input");
  // input 隐藏到视窗外面
  input.style.position = "fixed";
  input.style.left = "-9999px";

  document.body.appendChild(input);
  input.value = text;
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);

  message.success(getLocals().copySuc);
}

export default function CustomInputWithCopy(
  props: IPaasCommonFormFieldProps<string> & {
    btnText: string;
  }
) {
  return (
    <Space.Compact className="w-full">
      <Input disabled value={props.value} readOnly />
      <Button
        type="primary"
        onClick={() => {
          copyText(props.value || "");
        }}
      >
        {props.btnText || getLocals().copy}
      </Button>
    </Space.Compact>
  );
}
