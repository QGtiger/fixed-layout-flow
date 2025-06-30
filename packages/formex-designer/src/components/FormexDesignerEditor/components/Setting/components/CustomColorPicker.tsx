import { ColorPicker, theme } from "antd";
import { FormexItemEditorProps } from "./type";
import {
  generate,
  green,
  presetPalettes,
  red,
  blue,
  purple,
} from "@ant-design/colors";

import type { ColorPickerProps } from "antd";

type Presets = Required<ColorPickerProps>["presets"][number];

function genPresets(presets = presetPalettes) {
  return Object.entries(presets).map<Presets>(([label, colors]) => ({
    label,
    colors,
    key: label,
  }));
}

export default function CustomColorPicker(props: FormexItemEditorProps) {
  const { onChange } = props;
  const { token } = theme.useToken();
  const presets = genPresets({
    green,
    blue,
    red,
    purple,
  });
  return (
    <ColorPicker
      {...props}
      presets={presets}
      onChange={(color) => {
        onChange?.(color.toHexString());
      }}
    />
  );
}
