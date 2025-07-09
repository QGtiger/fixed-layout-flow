import { autocompletion, CompletionContext } from "@codemirror/autocomplete";
import CodeMirror, { EditorView, keymap } from "@uiw/react-codemirror";
import { createExpressionTheme, highlightExpressions } from "./extensions";
import { nonDollarCompletions } from "./extensions/completions/nonDollar.completions";

import "./index.css";
import { TernServerInstance } from "./extensions/autocompletion";

const autoInsertDoubleBraces = keymap.of([
  {
    key: "{",
    run: (view) => {
      const { state } = view;
      const { from } = state.selection.main;

      // 判断光标前一个 是否也是 {
      const beforeChar = state.sliceDoc(from - 1, from);
      if (beforeChar === "{") {
        view.dispatch({
          changes: { from, to: from, insert: "{  }" },
          selection: { anchor: from + 2 }, // 光标移到中间
        });
      } else {
        return false;
      }

      return true;
    },
  },
]);

const regexes = {
  generalRef: /\$[^$'"]+\.(.*)/, // $input. or $json. or similar ones
  selectorRef: /\$\(['"][\S\s]+['"]\)\.(.*)/, // $('nodeName').

  numberLiteral: /\((\d+)\.?(\d*)\)\.(.*)/, // (123). or (123.4).
  singleQuoteStringLiteral: /('.*')\.([^'{\s])*/, // 'abc'.
  booleanLiteral: /(true|false)\.([^'{\s])*/, // true.
  doubleQuoteStringLiteral: /(".*")\.([^"{\s])*/, // "abc".
  dateLiteral: /\(?new Date\(\(?.*?\)\)?\.(.*)/, // new Date(). or (new Date()).
  arrayLiteral: /\(?(\[.*\])\)?\.(.*)/, // [1, 2, 3].
  indexedAccess: /([^"{\s]+\[.+\])\.(.*)/, // 'abc'[0]. or 'abc'.split('')[0] or similar ones
  objectLiteral: /\(\{.*\}\)\.(.*)/, // ({}).

  mathGlobal: /Math\.(.*)/, // Math.
  datetimeGlobal: /DateTime\.(.*)/, // DateTime.
  objectGlobal: /Object\.(.*)/, // Object. or Object.method(arg).
};

const DATATYPE_REGEX = new RegExp(
  Object.values(regexes)
    .map((regex) => regex.source)
    .join("|")
);

const n8nAutocompletion = () =>
  autocompletion({ icons: false, aboveCursor: true, closeOnBlur: false });

function generateAutocompletions(context: CompletionContext) {
  const { state, pos } = context;
  const line = state.doc.lineAt(pos);
  const textBefore = line.text.slice(0, pos);
  const textAfter = line.text.slice(pos);

  const inExpression = /{{.*?$/.test(textBefore) && /[^{}]*}}/.test(textAfter);

  if (!inExpression) return null;

  const result = TernServerInstance.generateAutocompletion(context, {});

  return {
    options: result.completions,
    from: pos,
  };
}

export function CMEditor({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <CodeMirror
      theme="light"
      value={value}
      onChange={onChange}
      className=" border border-gray-300 border-solid rounded-md overflow-hidden px-1 bg-white py-[1px]"
      placeholder="请输入表达式"
      extensions={[
        // githubLight,
        autoInsertDoubleBraces,
        EditorView.lineWrapping,
        n8nAutocompletion(),
        // ...resolvableHighlightExtension,
        // infoBoxTooltips(),
        createExpressionTheme(),
        highlightExpressions(),
        autocompletion({
          override: [generateAutocompletions],
        }),
        // n8nExpression(),
      ]}
      basicSetup={{
        lineNumbers: false,
        highlightActiveLine: false,
        highlightSelectionMatches: false,
        bracketMatching: false,
        // closeBrackets: false,
        foldGutter: false,
        drawSelection: false,
      }}
    />
  );
}
