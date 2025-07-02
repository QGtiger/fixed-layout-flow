import {
  autocompletion,
  CloseBracketConfig,
  completeFromList,
  ifIn,
} from "@codemirror/autocomplete";
import CodeMirror, { EditorView, keymap } from "@uiw/react-codemirror";
import { useState } from "react";
import { createExpressionTheme, highlightExpressions } from "./extensions";

import {
  LRLanguage,
  LanguageSupport,
  foldNodeProp,
  foldInside,
} from "@codemirror/language";

import { parserWithMetaData } from "codemirror-lang-n8n-expression";
import { parseMixed, type SyntaxNodeRef } from "@lezer/common";
import { javascriptLanguage } from "@codemirror/lang-javascript";
import { nonDollarCompletions } from "./extensions/completions/nonDollar.completions";
import { completionSources } from "./extensions/completions";
import { infoBoxTooltips } from "./extensions/tooltips";

import { githubLight } from "@uiw/codemirror-theme-github";

import "./index.css";

// const autoInsertDoubleBraces = keymap.of([
//   {
//     key: "{",
//     run: (view) => {
//       const { state } = view;
//       const { from } = state.selection.main;

//       view.dispatch({
//         changes: { from, to: from, insert: "{{  }}" },
//         selection: { anchor: from + 3 }, // 光标移到中间
//       });

//       return true;
//     },
//   },
// ]);

const isResolvable = (node: SyntaxNodeRef) => node.type.name === "Resolvable";

const n8nParserWithNestedJsParser = parserWithMetaData.configure({
  wrap: parseMixed((node) => {
    if (node.type.isTop) return null;

    return node.name === "Resolvable"
      ? { parser: javascriptLanguage.parser, overlay: isResolvable }
      : null;
  }),
});

const n8nLanguage = LRLanguage.define({ parser: n8nParserWithNestedJsParser });

const expressionCloseBracketsConfig: CloseBracketConfig = {
  brackets: ["{", "(", '"', "'", "["],
  // <> so bracket completion works in HTML tags
  before: ")]}:;<>'\"",
};

export function n8nExpression() {
  return new LanguageSupport(n8nLanguage, [
    n8nLanguage.data.of(expressionCloseBracketsConfig),
    ...completionSources().map((source) => n8nLanguage.data.of(source)),
  ]);
}

const n8nAutocompletion = () =>
  autocompletion({ icons: false, aboveCursor: true, closeOnBlur: false });

export default function CMEditor() {
  const [value, setValue] = useState(
    '{{ $json.data.users.map(user => user.name).join(", ") }}'
  );
  return (
    <CodeMirror
      theme="light"
      value={value}
      onChange={setValue}
      className=" border border-gray-300 border-solid rounded-md overflow-hidden px-1 bg-white py-[1px]"
      placeholder="请输入表达式"
      extensions={[
        // githubLight,
        // autoInsertDoubleBraces,
        EditorView.lineWrapping,
        n8nExpression(),
        n8nAutocompletion(),
        // infoBoxTooltips(),
        // createExpressionTheme(),
        // highlightExpressions(),
        // autocompletion({
        //   override: [
        //     (context) => {
        //       const r = TernServerInstance.generateAutocompletion(context, {});
        //       console.log(r);
        //       return null;
        //     },
        //   ],
        // }),
        // n8nExpression(),
      ]}
      basicSetup={{
        lineNumbers: false,
        highlightActiveLine: false,
        highlightSelectionMatches: false,
        bracketMatching: false,
        closeBrackets: false,
        foldGutter: false,
        drawSelection: false,
      }}
    />
  );
}
