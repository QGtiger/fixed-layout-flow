import { EditorState, StateField } from "@codemirror/state";
import { EditorView, showTooltip } from "@codemirror/view";

interface Tooltip {
  pos: number;
  above?: boolean;
  strictSide?: boolean;
  arrow?: boolean;
  create: (view: EditorView) => {
    dom: HTMLElement;
  };
}

function getTriggerTooltips(state: EditorState): readonly Tooltip[] {
  const selection = state.selection.main;
  const pos = selection.from;

  // 获取光标前一个字符
  const prevChar = pos > 0 ? state.doc.sliceString(pos - 1, pos) : "";

  // 定义需要触发提示的字符
  const triggerChars = [".", "[", "$"];

  // 如果前一个字符不是触发字符，则不显示工具提示
  // if (!triggerChars.includes(prevChar)) return [];

  // 获取触发字符前的单词
  const line = state.doc.lineAt(pos);
  const textBeforeCursor = line.text.slice(0, pos - line.from);
  // const lastSpaceIndex = Math.max(
  //   textBeforeCursor.lastIndexOf(" "),
  //   textBeforeCursor.lastIndexOf("\n"),
  //   textBeforeCursor.lastIndexOf(";"),
  //   textBeforeCursor.lastIndexOf("(")
  // );
  const wordBeforeTrigger = textBeforeCursor.slice(0);

  // 根据不同的触发字符显示不同的提示内容
  let tooltipContent = "";
  switch (prevChar) {
    case ".":
      tooltipContent = `属性建议: ${wordBeforeTrigger}`;
      break;
    case "[":
      tooltipContent = `键名建议: ${wordBeforeTrigger}`;
      break;
    case "$":
      tooltipContent = `变量建议: ${wordBeforeTrigger}`;
      break;
    default:
      return [];
  }

  return [
    {
      pos: pos,
      above: true,
      strictSide: true,
      arrow: true,
      create: () => {
        const dom = document.createElement("div");
        dom.className = "cm-tooltip-cursor";
        dom.textContent = tooltipContent;
        return { dom };
      },
    },
  ];
}

export const triggerTooltipField = StateField.define<readonly Tooltip[]>({
  create: getTriggerTooltips,
  update(tooltips, tr) {
    if (!tr.docChanged && !tr.selection) return tooltips;
    return getTriggerTooltips(tr.state);
  },
  provide: (f) => showTooltip.computeN([f], (state) => state.field(f)),
});

export const tooltipBaseTheme = EditorView.baseTheme({
  ".cm-tooltip.cm-tooltip-cursor": {
    backgroundColor: "#66b",
    color: "white",
    border: "none",
    padding: "2px 7px",
    borderRadius: "4px",
    "& .cm-tooltip-arrow:before": {
      borderTopColor: "#66b",
    },
    "& .cm-tooltip-arrow:after": {
      borderTopColor: "transparent",
    },
  },
});
