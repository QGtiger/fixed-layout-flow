import React, { useState, useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView, Decoration } from "@codemirror/view";
import { EditorState, RangeSetBuilder } from "@codemirror/state";

// 可配置的主题
const createExpressionTheme = (highlightColor = "#e3f2fd") =>
  EditorView.theme({
    // 基础表达式样式
    ".cm-expression": {
      backgroundColor: highlightColor,
      borderRadius: "3px",
    },
    // 选中部分的样式（半透明叠加）
    ".cm-expression-selected": {
      backgroundColor: "rgba(25, 118, 210, 0.3)", // 半透明蓝色
    },
  });

// 表达式高亮扩展
const highlightExpressions = () => {
  return EditorView.decorations.compute(["selection"], (state) => {
    const builder = new RangeSetBuilder();
    const doc = state.doc.toString();
    const regex = /{{[^{}]*}}/g;
    let match;

    // 1. 始终添加所有表达式的基础装饰
    while ((match = regex.exec(doc)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      builder.add(start, end, Decoration.mark({ class: "cm-expression" }));
    }

    // 2. 添加选中部分的特殊装饰
    for (const range of state.selection.ranges) {
      if (!range.empty) {
        const start = range.from;
        const end = range.to;

        // 检查选中是否与任何表达式重叠
        regex.lastIndex = 0; // 重置正则
        while ((match = regex.exec(doc)) !== null) {
          const exprStart = match.index;
          const exprEnd = exprStart + match[0].length;

          // 如果选中与表达式有重叠
          if (start < exprEnd && end > exprStart) {
            // 添加选中装饰（只覆盖实际选中部分）
            const from = Math.max(start, exprStart);
            const to = Math.min(end, exprEnd);
            builder.add(
              from,
              to,
              Decoration.mark({ class: "cm-expression-selected" })
            );
          }
        }
      }
    }

    return builder.finish();
  });
};

export default function ExpressionEditor() {
  const [code, setCode] = useState(`// 表达式编辑器示例
{{ $('Webhook').item.json.params.gg.pp }}

// 使用数组索引
{{ $('Data').value[0].id.name }}

// 使用方法调用
{{ $('Data').value.map(item => item.name) }}

// 普通代码不会被高亮
const normalCode = "This is not an expression";`);

  const [highlightColor, setHighlightColor] = useState("#e3f2fd");

  const extensions = useMemo(
    () => [
      createExpressionTheme(highlightColor),
      highlightExpressions(),
      EditorView.baseTheme({
        // 增强选中可见性
        "&.cm-focused .cm-selectionBackground": {
          background: "rgba(25, 118, 210, 0.2)", // 更柔和的默认选中背景
        },
      }),
    ],
    [highlightColor]
  );

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <label>高亮颜色: </label>
        <input
          type="color"
          value={highlightColor}
          onChange={(e) => setHighlightColor(e.target.value)}
        />
      </div>

      <CodeMirror
        value={code}
        height="300px"
        theme="light"
        extensions={extensions}
        onChange={(value) => setCode(value)}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: false,
          highlightSelectionMatches: false,
          bracketMatching: true,
          closeBrackets: true,
          foldGutter: false,
        }}
      />
    </div>
  );
}
