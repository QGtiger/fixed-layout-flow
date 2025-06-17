import CodeMirror from "@uiw/react-codemirror";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";
import { javascript } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import { keymap, EditorView } from "@codemirror/view";
import { useCreation } from "ahooks";
import { generateSampleDataByOutputStruct } from "../../utils/workflowUtils";
import {
  createExpressionTheme,
  getCompletionsByExpr,
  highlightExpressions,
} from "./utils";
import { useState } from "react";

const autoInsertDoubleBraces = keymap.of([
  {
    key: "{",
    run: (view) => {
      const { state } = view;
      const { from } = state.selection.main;

      view.dispatch({
        changes: { from, to: from, insert: "{{  }}" },
        selection: { anchor: from + 3 }, // 光标移到中间
      });

      return true;
    },
  },
]);

export default function CustomCodeEditor(props: {
  structMap: Record<string, OutputStructItem[]>;
}) {
  const [, setCode] = useState("");
  const { structMap } = props;

  const sampleMap = useCreation(() => {
    if (!structMap) return;
    const sample = Object.entries(structMap).reduce(
      (acc, [key, struct]) => {
        // 这里可以对每个结构进行处理
        return {
          ...acc,
          [key]: generateSampleDataByOutputStruct(struct),
        };
      },
      {} as Record<string, any>
    );
    console.log("生成的示例数据:", sample);
    return sample;
  }, [structMap]);

  function myCompletions(context: CompletionContext): any {
    const { state, pos } = context;
    const line = state.doc.lineAt(pos);
    const textBefore = line.text.slice(0, pos);
    const textAfter = line.text.slice(pos);

    console.log("Text Before:", textBefore, "\nText After:", textAfter);

    const inExpression =
      /{{[^{}]*$/.test(textBefore) && /[^{}]*}}/.test(textAfter);

    // {{ 2123123123.  11 {{ 2 }} }} 这里是获取 后一个
    const expression = textBefore.match(/.*{{\s*(.*)$/)?.[1]; // ?.trim(); 不用去除空格  /.*{{\s*([^\s]*)$/ 为什么不是用 [^\s]*] 是因为 $('RP' + "A")
    // console.log("In Expression:", inExpression, "Expression:", expression);
    if (!inExpression || !expression) return null; // 如果不在表达式中，直接返回 null

    const result = getCompletionsByExpr(expression, textAfter, sampleMap || {});
    return result.length
      ? {
          from: pos,
          options: result,
        }
      : null;
  }

  return (
    <CodeMirror
      theme="light"
      value="222"
      onChange={(value) => setCode(value)}
      extensions={[
        autocompletion({ override: [myCompletions] }),
        autoInsertDoubleBraces,
        EditorState.transactionFilter.of((tr) => {
          return tr.newDoc.lines > 1 ? [] : [tr];
        }),
        createExpressionTheme(),
        highlightExpressions(),
        EditorView.lineWrapping,
      ]}
      basicSetup={{
        lineNumbers: false,
        highlightActiveLine: false,
        highlightSelectionMatches: false,
        bracketMatching: false,
        closeBrackets: false,
        foldGutter: false,
      }}
    />
  );
}
