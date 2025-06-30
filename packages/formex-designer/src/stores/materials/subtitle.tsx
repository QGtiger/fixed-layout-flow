import Editor from "@toast-ui/editor";
import { useEffect, useRef } from "react";

import "@toast-ui/editor/toastui-editor.css";

import "prismjs/themes/prism.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";

// Step 1. Import prismjs
import Prism from "prismjs";

// Step 2. Import language files of prismjs that you need
import "prismjs/components/prism-clojure.js";

import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";

export default function SubTitle(
  props: MaterialItemProps<{
    text: string;
  }>
) {
  const editorInsRef = useRef<any>(null);

  useEffect(() => {
    if (!editorInsRef.current) {
      editorInsRef.current = Editor.factory({
        el: document.querySelector("#viewer")!,
        viewer: true,
        initialValue: props.text,
        plugins: [[codeSyntaxHighlight, { highlighter: Prism }]],
      });
    }

    editorInsRef.current.setMarkdown(props.text);
  }, [props.text]);

  return (
    <div className="my-4">
      <div id="viewer"></div>
    </div>
  );
}
