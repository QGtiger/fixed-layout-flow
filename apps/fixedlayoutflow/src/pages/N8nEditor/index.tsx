import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { n8nExpression, n8nLanguage } from "codemirror-lang-n8n-expression";
import { githubDark } from "@uiw/codemirror-theme-github";
import { autocompletion } from "@codemirror/autocomplete";

import "./index.css";

// 自定义自动补全
const n8nCompleter = (context) => {
  const word = context.matchBefore(/\w*/);
  if (!word) return null;

  return {
    from: word.from,
    options: [
      { label: "$json", type: "variable", info: "当前节点的输入数据" },
      { label: "$node", type: "variable", info: "节点相关信息" },
      { label: "$parameter", type: "variable", info: "节点参数" },
      { label: "Math", type: "class", info: "数学函数" },
      { label: "Date", type: "class", info: "日期处理" },
      { label: "Array", type: "class", info: "数组操作" },
      { label: "last()", type: "function", info: "获取数组最后一个元素" },
      { label: "if()", type: "function", info: "n8n条件函数" },
    ],
  };
};

const N8nExpressionEditor = () => {
  const [code, setCode] = useState(
    `{{ 8n表达式示例\n  $json.data.users.map(user => user.name).join(', ') }}`
  );

  const [result, setResult] = useState("");

  const evaluateExpression = () => {
    try {
      // 在实际应用中，这里会连接到n8n引擎进行表达式求值
      // 这里仅做简单演示
      if (code.includes("user.name")) {
        setResult("John, Jane, Mike");
      } else if (code.includes("Math.max")) {
        setResult("42");
      } else {
        setResult("表达式执行结果");
      }
    } catch (error) {
      setResult(`错误: ${error.message}`);
    }
  };

  return (
    <div className="n8n-editor">
      <div className="header">
        <h2>n8n 表达式编辑器</h2>
        <p>使用双大括号语法 {`{{ }}`} 编写动态表达式</p>
      </div>

      <div className="editor-container">
        <CodeMirror
          value={code}
          height="200px"
          // theme={githubDark}
          extensions={[
            n8nExpression(),
            n8nLanguage,
            // autocompletion({ override: [n8nCompleter] }),
          ]}
          onChange={setCode}
        />

        <div className="toolbar">
          <button onClick={evaluateExpression}>执行表达式</button>
          <div className="hint">
            <span>提示: 按 Ctrl+Space 触发自动补全</span>
          </div>
        </div>
      </div>

      {result && (
        <div className="result-panel">
          <h3>执行结果</h3>
          <div className="result-content">{result}</div>
        </div>
      )}

      <div className="documentation">
        <h3>n8n 表达式参考</h3>
        <div className="examples">
          <div>
            <h4>基础变量</h4>
            <ul>
              <li>
                <code>$json</code> - 当前节点的输入数据
              </li>
              <li>
                <code>$node</code> - 节点相关信息
              </li>
              <li>
                <code>$parameter</code> - 节点参数
              </li>
            </ul>
          </div>

          <div>
            <h4>常用函数</h4>
            <ul>
              <li>
                <code>last()</code> - 获取数组最后一个元素
              </li>
              <li>
                <code>$if(condition, trueValue, falseValue)</code>
              </li>
              <li>
                <code>$max(array)</code> - 获取最大值
              </li>
              <li>
                <code>$min(array)</code> - 获取最小值
              </li>
            </ul>
          </div>

          <div>
            <h4>JavaScript 支持</h4>
            <ul>
              <li>所有标准 JavaScript 函数</li>
              <li>ES6 语法（箭头函数、模板字符串等）</li>
              <li>Math、Date、Array 等内置对象</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default N8nExpressionEditor;
