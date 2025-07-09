import { Decoration, EditorView, RangeSetBuilder } from "@uiw/react-codemirror";

export const createExpressionTheme = (highlightColor = "#dcf4e6") =>
  EditorView.theme({
    // 基础表达式样式
    ".cm-expression": {
      backgroundColor: highlightColor,
      borderRadius: "3px",
      color: "rgb(41, 163, 102)",
    },
  });

// 表达式高亮扩展
export const highlightExpressions = () => {
  // @ts-expect-error interface 不匹配
  return EditorView.decorations.compute(["selection"], (state) => {
    const builder = new RangeSetBuilder();
    const doc = state.doc.toString();
    const regex = /\{\{([\s\S]+?)\}\}/g; // 匹配 {{ ... }} 的正则表达式
    let match;

    // 1. 始终添加所有表达式的基础装饰
    while ((match = regex.exec(doc)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      builder.add(start, end, Decoration.mark({ class: "cm-expression" }));
    }

    return builder.finish();
  });
};
