import type { Completion } from "@codemirror/autocomplete";
import { getType } from "../../../utils/workflowUtils";
import { Decoration, EditorView } from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";
import { getExpression } from "./expression";

export function runInSandbox(
  code: string,
  options?: {
    saftContextMap?: Record<string, any>;
    onSandboxError?: (error: Error) => void;
    onSandboxSuccess?: (result: any) => void;
  }
) {
  const {
    saftContextMap = {},
    onSandboxError,
    onSandboxSuccess,
  } = options || {};
  // 创建安全的执行上下文
  const safeContext = {
    // 预置的安全API
    ...saftContextMap,
  };

  // 创建代理以防止访问非允许的属性
  const sandbox = new Proxy(safeContext, {
    has() {
      return true; // 允许访问所有属性
    },
    get(target, key, receiver) {
      return Reflect.get(target, key, receiver);
    },
  });

  // 使用Function构造函数执行代码
  try {
    const fn = new Function("sandbox", `with(sandbox) { return ${code} }`);
    onSandboxSuccess?.(fn(sandbox));
  } catch (error) {
    console.error("Sandbox execution error:", error);
    onSandboxError?.(error as Error);
  }
}

export const nativeSelectionTheme = EditorView.baseTheme({
  "&.cm-editor .cm-content": {
    caretColor: "auto !important", // 使用原生光标
  },
  "&.cm-editor .cm-content .cm-line": {
    caretColor: "auto !important", // 使用原生光标
  },
  "&.cm-editor .cm-selectionBackground, &.cm-editor .cm-selectionMatch": {
    background: "transparent !important", // 禁用 CodeMirror 选区背景
  },
  "&.cm-editor .cm-line::selection": {
    background: "#ccc", // 使用浏览器默认选区颜色（Windows 是蓝色）
  },
});

export const createExpressionTheme = (highlightColor = "#e3f2fd") =>
  EditorView.theme({
    // 基础表达式样式
    ".cm-expression": {
      backgroundColor: highlightColor,
      borderRadius: "3px",
    },
  });

// 表达式高亮扩展
export const highlightExpressions = () => {
  // @ts-expect-error interface 不匹配
  return EditorView.decorations.compute(["selection"], (state) => {
    const builder = new RangeSetBuilder();
    const doc = state.doc.toString();
    const regex = /{{[^{}]*}}/g;
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

export function getCompletionsByExpr(
  expr: string,
  wordAfter: string,
  sampleMap: Record<string, any>
): Completion[] {
  const dollarMatch = expr.match(/.*\$(.*)$/);
  const exp = dollarMatch?.[1];
  console.log("匹配到的表达式:", getExpression(expr), "原始表达式:", expr);
  if (!dollarMatch) return [];
  const expWithDollar = `$${exp}`;
  // 各个分割符 后续的长度
  const a = expWithDollar.split("$").pop()!.length;
  const b = expWithDollar.split("[").pop()!.length;
  const c = expWithDollar.split(".").pop()!.length;

  // 去最短的一条
  const min = Math.min(a, b, c) + 1; // +1 是因为要去除分隔符本身的长度
  // 去除 分隔符的部分。 就是要动态计算的
  const calcExp = expWithDollar.slice(0, -min);
  //
  const lastPart = expWithDollar.slice(calcExp.length);
  console.log(
    "计算:",
    calcExp,
    "最后部分:",
    lastPart,
    "表达式:",
    expWithDollar
  );
  let data: any = {};
  if (!calcExp) {
    data = sampleMap;
  } else {
    // calcExp 如果后面有 空格 就不管  例如 $('RP' + 'A')    .
    if (calcExp.trim() === calcExp) {
      runInSandbox(calcExp, {
        saftContextMap: {
          $: (nodeId: string) => {
            // 这里可以根据 nodeId 获取对应的节点数据
            return sampleMap[nodeId] || {};
          },
        },
        onSandboxSuccess(result) {
          data = result;
        },
      });
    }
  }

  const keysMap = (() => {
    if (typeof data !== "object") {
      return {}; // 如果 data 不是对象，直接返回空对象
    }
    return Object.keys(data).reduce(
      (acc, k) => {
        // 为空 => $('
        if (!calcExp) {
          acc[k] = [`$('${k}')`, `$("${k}")`];
        } else {
          if (Array.isArray(data)) {
            acc[k] = [
              `[${k}]`, // 假设是数组的第一个元素
            ];
          } else {
            acc[k] = [
              `.${k}`,
              `['${k}']`, // 假设是数组的第一个元素
              `["${k}"]`, // 假设是对象的 pp 属性
            ];
          }
        }
        return acc;
      },
      {} as Record<string, string[]>
    );
  })();

  console.log("keysMap:", keysMap);

  // 然后用 lastPart 来匹配对应的属性
  return Object.entries(keysMap).reduce((acc, [key, tempList]) => {
    const it = tempList.find((it) => it.startsWith(lastPart));
    if (it) {
      const value = data[key];
      const type = getType(value);
      acc.push({
        label: it,
        type: "keyword",
        detail: `Type: ${type}`,
        apply: (view) => {
          const { state } = view;
          const { from: start } = state.selection.main;
          const insert = it.slice(lastPart.length);

          let i = 1;
          let end = 0;
          while (true) {
            const w = wordAfter.slice(0, i);
            if (insert.endsWith(w)) {
              end = i;
              break; // 如果最后一个字符和 wordAfter 的第一个字符相同，就不再添加后缀
            }
            if (i >= insert.length) {
              break; // 防止无限循环
            }
            i++;
          }

          // 替换掉原来的表达式
          view.dispatch({
            changes: {
              from: start,
              to: start,
              insert: end ? insert.slice(0, -end) : insert, // 如果 end > 0 就去掉最后的字符
            },
            selection: { anchor: start + insert.length }, // 光标移到新插入的内容后面
          });
        },
        info: JSON.stringify(value, null, 2), // 显示值的详细信息

        render: () => {
          const div = document.createElement("div");
          div.innerHTML = `
            <span style="color: #4fc3f7; font-weight: bold">start</span>
            <span style="color: #888; margin-left: 8px">→ 开始方法</span>
          `;
          return div;
        },
        // 这里可以根据 value 的类型进一步处理
        // 比如如果是函数，可以显示函数签名等
      } as Completion);
    }
    return acc;
  }, [] as Completion[]);
}
