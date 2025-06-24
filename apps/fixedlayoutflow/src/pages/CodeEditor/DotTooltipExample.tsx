import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { tooltipBaseTheme, triggerTooltipField } from "./utils/tooltipBySample";

export default function TriggerTooltipExample() {
  const extensions = [javascript(), triggerTooltipField, tooltipBaseTheme];

  return (
    <div style={{ height: "100%" }}>
      <CodeMirror
        value={`// 在以下字符后查看工具提示: . [ $\nconst obj = { name: 'John', age: 30 };\nobj.\nobj[\n$`}
        height="200px"
        extensions={extensions}
      />
    </div>
  );
}
