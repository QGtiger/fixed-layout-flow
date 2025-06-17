import React, { useState, useRef, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";

// 全局变量 $ 的数据结构定义
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

// 获取类型图标
const getTypeIcon = (type) => {
  switch (type) {
    case "object":
      return "{}";
    case "array":
      return "[]";
    case "number":
      return "123";
    case "string":
      return "abc";
    case "function":
      return "ƒ";
    default:
      return "?";
  }
};

// 自定义自动补全函数
const customCompletions = (context: CompletionContext) => {
  const word = context.matchBefore(/\$[\w\.\[\]]*/);
  if (!word || (word.from === word.to && !context.explicit)) return null;

  // 解析当前路径
  const path = word.text
    .substring(1)
    .split(/\.|\[|\]/)
    .filter(Boolean);

  // 查找当前路径对应的节点
  let currentNode = globalData;
  for (const segment of path) {
    if (segment === "array[index]") continue; // 跳过数组索引

    const child = (currentNode.children || []).find((c) => c.name === segment);
    if (!child) {
      currentNode = null;
      break;
    }
    currentNode = child;
  }

  // 如果没有找到节点，返回空
  if (!currentNode || !currentNode.children) return null;

  // 生成补全选项
  const options = currentNode.children.map((child) => {
    const isArrayItem = child.name === "array[index]";
    const name = isArrayItem ? "array" : child.name;

    return {
      label: name,
      type: child.type,
      detail: child.label,
      apply: isArrayItem
        ? "array"
        : child.name +
          (child.children ? (child.type === "array" ? "[$1]" : ".") : ""),
    };
  });

  console.log(options);

  return {
    from: word.from,
    options: options.map((option) => ({
      label: option.label,
      detail: option.detail,
      type: option.type,
      apply: option.apply,
      boost: 99,
      render: (element) => {
        const icon = document.createElement("span");
        icon.className = "cm-type-icon";
        icon.textContent = getTypeIcon(option.type);
        icon.style.marginRight = "8px";
        icon.style.padding = "2px 4px";
        icon.style.borderRadius = "3px";
        icon.style.background =
          option.type === "object"
            ? "#e3f2fd"
            : option.type === "array"
              ? "#f3e5f5"
              : option.type === "number"
                ? "#e8f5e9"
                : "#fff8e1";
        icon.style.color =
          option.type === "object"
            ? "#1976d2"
            : option.type === "array"
              ? "#7b1fa2"
              : option.type === "number"
                ? "#388e3c"
                : "#f57f17";
        icon.style.fontSize = "0.8em";
        icon.style.fontWeight = "bold";

        const label = document.createElement("span");
        label.textContent = option.label;
        label.style.fontWeight = "bold";

        const detail = document.createElement("span");
        detail.textContent = ` — ${option.detail}`;
        detail.style.opacity = "0.7";
        detail.style.fontSize = "0.9em";

        element.appendChild(icon);
        element.appendChild(label);
        element.appendChild(detail);
      },
    })),
  };
};

// 自定义自动补全扩展
const customCompletion = autocompletion({
  override: [customCompletions],
  activateOnTyping: true,
});

const extensions = [javascript(), customCompletion];

// 初始代码
const initialCode = `// 使用全局变量 $ 及其属性
const value = $.a.p[0].pp;
console.log(value);

// 尝试输入 $. 查看代码提示
// 或者输入 $.a.p[0].`;

const CodeEditor = () => {
  const [code, setCode] = useState(initialCode);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const editorRef = useRef(null);

  // 处理主题切换
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      className="editor-container"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* 标题栏 */}
      <div
        style={{
          backgroundColor: isDarkMode ? "#1e1e1e" : "#f5f5f5",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid " + (isDarkMode ? "#333" : "#ddd"),
        }}
      >
        <h2 style={{ margin: 0, color: isDarkMode ? "#fff" : "#333" }}>
          React CodeMirror 编辑器
          <span
            style={{
              fontSize: "0.8em",
              background: "#4caf50",
              color: "white",
              padding: "2px 6px",
              borderRadius: "4px",
              marginLeft: "10px",
            }}
          >
            自定义代码提示
          </span>
        </h2>
        <div>
          <button
            onClick={toggleTheme}
            style={{
              background: "none",
              border: "1px solid " + (isDarkMode ? "#666" : "#999"),
              color: isDarkMode ? "#fff" : "#333",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            {isDarkMode ? "☀️ 浅色模式" : "🌙 深色模式"}
          </button>
        </div>
      </div>

      {/* 主编辑区 */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
        }}
      >
        <div style={{ flex: 1 }}>
          <CodeMirror
            ref={editorRef}
            value={code}
            height="100%"
            extensions={extensions}
            onChange={(value) => setCode(value)}
            theme={isDarkMode ? "dark" : "light"}
            basicSetup={{
              lineNumbers: false,
              highlightActiveLineGutter: true,
              highlightActiveLine: true,
              foldGutter: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              highlightSelectionMatches: true,
              syntaxHighlighting: true,
              searchKeymap: true,
              lintKeymap: true,
            }}
          />
        </div>

        {/* 属性结构面板 */}
        <div
          style={{
            width: "250px",
            backgroundColor: isDarkMode ? "#252526" : "#f8f9fa",
            borderLeft: "1px solid " + (isDarkMode ? "#333" : "#ddd"),
            padding: "15px",
            overflowY: "auto",
          }}
        >
          <h3
            style={{
              color: isDarkMode ? "#fff" : "#333",
              marginTop: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                display: "inline-block",
                background: "#4caf50",
                color: "white",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                textAlign: "center",
                lineHeight: "24px",
                marginRight: "10px",
                fontSize: "0.8em",
              }}
            >
              $
            </span>
            全局变量结构
          </h3>

          <div
            style={{
              marginTop: "10px",
              padding: "10px",
              background: isDarkMode ? "#2d2d2d" : "#fff",
              borderRadius: "6px",
              border: "1px solid " + (isDarkMode ? "#444" : "#eee"),
              boxShadow: isDarkMode
                ? "0 2px 5px rgba(0,0,0,0.3)"
                : "0 2px 5px rgba(0,0,0,0.05)",
            }}
          >
            <PropertyTree data={globalData} level={0} isDarkMode={isDarkMode} />
          </div>

          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              background: isDarkMode ? "#2d2d2d" : "#fff",
              borderRadius: "6px",
              border: "1px solid " + (isDarkMode ? "#444" : "#eee"),
              fontSize: "0.9em",
              color: isDarkMode ? "#aaa" : "#666",
            }}
          >
            <p>
              <strong>使用说明：</strong>
            </p>
            <ul style={{ paddingLeft: "20px" }}>
              <li>
                在编辑器中输入{" "}
                <code
                  style={{
                    background: isDarkMode ? "#333" : "#eee",
                    padding: "2px 4px",
                  }}
                >
                  $.
                </code>{" "}
                触发代码提示
              </li>
              <li>
                使用{" "}
                <code
                  style={{
                    background: isDarkMode ? "#333" : "#eee",
                    padding: "2px 4px",
                  }}
                >
                  Tab
                </code>{" "}
                或{" "}
                <code
                  style={{
                    background: isDarkMode ? "#333" : "#eee",
                    padding: "2px 4px",
                  }}
                >
                  Enter
                </code>{" "}
                选择提示项
              </li>
              <li>
                数组属性会自动添加索引占位符{" "}
                <code
                  style={{
                    background: isDarkMode ? "#333" : "#eee",
                    padding: "2px 4px",
                  }}
                >
                  [$1]
                </code>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 状态栏 */}
      <div
        style={{
          backgroundColor: isDarkMode ? "#1e1e1e" : "#f5f5f5",
          padding: "5px 20px",
          borderTop: "1px solid " + (isDarkMode ? "#333" : "#ddd"),
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.85em",
          color: isDarkMode ? "#aaa" : "#666",
        }}
      >
        <div>当前路径: {code.match(/\$[\w\.\[\]]*/)?.[0] || "无"}</div>
        <div>
          行数: {code.split("\n").length} | 字符: {code.length}
        </div>
      </div>
    </div>
  );
};

// 递归渲染属性树
const PropertyTree = ({ data, level, isDarkMode }) => {
  const [expanded, setExpanded] = useState(level < 2);

  const toggleExpand = () => {
    if (data.children && data.children.length) {
      setExpanded(!expanded);
    }
  };

  return (
    <div style={{ marginLeft: level > 0 ? "15px" : "0" }}>
      <div
        onClick={toggleExpand}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "4px 0",
          cursor: data.children ? "pointer" : "default",
          color: isDarkMode
            ? level === 0
              ? "#4fc3f7"
              : "#fff"
            : level === 0
              ? "#0277bd"
              : "#333",
        }}
      >
        {data.children && (
          <span style={{ marginRight: "5px", fontSize: "0.8em" }}>
            {expanded ? "▼" : "►"}
          </span>
        )}
        <span
          style={{
            display: "inline-block",
            background: isDarkMode
              ? data.type === "object"
                ? "#0d47a1"
                : data.type === "array"
                  ? "#4a148c"
                  : data.type === "number"
                    ? "#1b5e20"
                    : "#333"
              : data.type === "object"
                ? "#bbdefb"
                : data.type === "array"
                  ? "#e1bee7"
                  : data.type === "number"
                    ? "#c8e6c9"
                    : "#f5f5f5",
            color: isDarkMode ? "#fff" : "#000",
            padding: "1px 6px",
            borderRadius: "4px",
            fontSize: "0.75em",
            marginRight: "6px",
          }}
        >
          {getTypeIcon(data.type)}
        </span>
        <strong>{data.name}</strong>
        {data.label && data.label !== data.name && (
          <span style={{ marginLeft: "6px", opacity: 0.7, fontSize: "0.9em" }}>
            {data.label}
          </span>
        )}
      </div>

      {expanded && data.children && (
        <div
          style={{
            marginLeft: "10px",
            borderLeft: "1px dashed " + (isDarkMode ? "#444" : "#ddd"),
            paddingLeft: "10px",
          }}
        >
          {data.children.map((child, index) => (
            <PropertyTree
              key={index}
              data={child}
              level={level + 1}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
