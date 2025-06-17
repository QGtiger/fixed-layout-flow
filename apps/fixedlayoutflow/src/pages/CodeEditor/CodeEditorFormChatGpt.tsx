import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";
import { useEffect, useMemo } from "react";

const globalData = {
  name: "$",
  type: "object",
  label: "全局变量",
  children: [
    {
      name: "a",
      type: "object",
      label: "数字数组",
      children: [
        {
          name: "p",
          type: "array",
          label: "p",
          children: [
            {
              name: "array[index]",
              type: "object",
              label: "数组索引",
              children: [
                {
                  name: "pp",
                  type: "number",
                  label: "pp",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// 将 globalData 转换为扁平路径补全项
function getCompletionsFromGlobalData(globalData) {
  const completions = [];

  function traverse(node, path = "") {
    if (node.name === "array[index]") {
      path += "[0]"; // 假设默认访问下标0
    } else if (path) {
      path += "." + node.name;
    } else {
      path = node.name;
    }

    completions.push({
      label: node.name,
      type: node.type,
      detail: node.label,
      apply: node.name === "array[index]" ? "[0]" : node.name,
    });

    if (node.children) {
      node.children.forEach((child) => traverse(child, path));
    }
  }

  if (globalData) {
    globalData.children?.forEach((child) => traverse(child, globalData.name));
  }

  return completions;
}

const completions = getCompletionsFromGlobalData(globalData);

// 提示函数
const customCompletion = (context: CompletionContext) => {
  const word = context.matchBefore(/\$[.\w\[\]]*/);
  if (!word) return null;

  return {
    from: word.from,
    options: completions,
    validFor: /^\w*$/,
  };
};

function myCompletions(context: CompletionContext) {
  const word = context.matchBefore(/\w*/);
  if (!word || !word.text) return null;
  if (word.from == word.to && !context.explicit) return null;
  return {
    from: word.from,
    options: [
      { label: "match", type: "keyword" },
      { label: "hello", type: "variable", info: "(World)" },
      { label: "magic", type: "text", apply: "⠁⭒*.✩.*⭒⠁", detail: "macro" },
    ],
  };
}

export default function CodeEditorFormChatGpt() {
  return (
    <CodeMirror
      value="$.a."
      height="200px"
      extensions={[javascript(), autocompletion({ override: [myCompletions] })]}
    />
  );
}
