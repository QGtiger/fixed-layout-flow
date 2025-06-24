import { autocompletion } from "@codemirror/autocomplete";
import CodeMirror from "@uiw/react-codemirror";
import { TernServerInstance } from "./extensions/autocompletion";
import { n8nExpression } from "codemirror-lang-n8n-expression";
import { useState } from "react";

export default function CMEditor() {
  const [value, setValue] = useState(
    '{{ $json.data.users.map(user => user.name).join(", ") }}'
  );
  return (
    <CodeMirror
      theme="light"
      value={value}
      onChange={setValue}
      extensions={[
        autocompletion({
          override: [
            (context) => {
              const r = TernServerInstance.generateAutocompletion(context, {});
              console.log(r);
              return null;
            },
          ],
        }),
        // n8nExpression(),
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
