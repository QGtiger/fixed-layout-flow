import React, { useCallback, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView, showTooltip } from "@codemirror/view";
import { StateField, EditorState } from "@codemirror/state";

// 定义工具提示接口
interface Tooltip {
  pos: number;
  above?: boolean;
  strictSide?: boolean;
  arrow?: boolean;
  create: (view: EditorView) => {
    dom: HTMLElement;
  };
}

// 定义工具提示的位置和内容
function getCursorTooltips(state: EditorState): readonly Tooltip[] {
  const selection = state.selection.main;
  const line = state.doc.lineAt(selection.from);
  const text = line.text;
  const wordStart = text.lastIndexOf(" ", selection.from - line.from) + 1;
  const wordEnd = text.indexOf(" ", selection.from - line.from);
  const word = text.slice(wordStart, wordEnd === -1 ? undefined : wordEnd);

  if (!word) return [];

  return [
    {
      pos: selection.from,
      above: true,
      strictSide: true,
      arrow: true,
      create: () => {
        const dom = document.createElement("div");
        dom.className = "cm-tooltip-cursor";
        dom.textContent = `Current word: ${word}`;
        return { dom };
      },
    },
  ];
}

// 创建工具提示状态字段
const cursorTooltipField = StateField.define<readonly Tooltip[]>({
  create: getCursorTooltips,
  update(tooltips, tr) {
    if (!tr.docChanged && !tr.selection) return tooltips;
    return getCursorTooltips(tr.state);
  },
  provide: (f) => showTooltip.computeN([f], (state) => state.field(f)),
});

const cursorTooltipBaseTheme = EditorView.baseTheme({
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

export default function TooltipExample() {
  const editorRef = useRef<EditorView>();

  // 获取编辑器实例
  const onCreateEditor = useCallback((view: EditorView, state: EditorState) => {
    editorRef.current = view;
  }, []);

  // 配置扩展
  const extensions = [
    javascript(),
    cursorTooltipField,
    cursorTooltipBaseTheme,
    EditorView.updateListener.of((update) => {
      if (update.selectionSet) {
        // 当选择变化时，可以在这里添加额外的逻辑
      }
    }),
  ];

  return (
    <div style={{ height: "100%" }}>
      <CodeMirror
        value={`// 移动光标到单词上查看工具提示
const example = "Hello World";
function test() {
  return example;
}`}
        height="200px"
        extensions={extensions}
        onCreateEditor={onCreateEditor}
      />
    </div>
  );
}
