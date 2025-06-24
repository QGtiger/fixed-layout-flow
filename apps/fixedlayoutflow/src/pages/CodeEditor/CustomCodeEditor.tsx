import CodeMirror from "@uiw/react-codemirror";
import { autocompletion } from "@codemirror/autocomplete";
import { EditorState } from "@codemirror/state";
import { keymap, EditorView } from "@codemirror/view";
import { useCreation } from "ahooks";
import { generateSampleDataByOutputStruct } from "../../utils/workflowUtils";
import { createExpressionTheme, highlightExpressions } from "./utils";
import { useState } from "react";

import "./index.css";
import { getCompletionsBySample } from "./utils/completionsBySample";

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

  return (
    <CodeMirror
      theme="light"
      value="222"
      onChange={(value) => setCode(value)}
      extensions={[
        // 自动 输入 { => {{  }}
        autoInsertDoubleBraces,
        // 单行文本
        EditorState.transactionFilter.of((tr) => {
          return tr.newDoc.lines > 1 ? [] : [tr];
        }),
        // 表达式高亮 样式
        createExpressionTheme(),
        // 表达式解析
        highlightExpressions(),
        EditorView.lineWrapping,
        // 代码补全逻辑
        autocompletion({
          override: [
            (context) => {
              return getCompletionsBySample(context, sampleMap);
            },
          ],
        }),
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
