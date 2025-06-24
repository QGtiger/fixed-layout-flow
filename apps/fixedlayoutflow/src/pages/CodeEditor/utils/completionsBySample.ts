import type { Completion, CompletionContext } from "@codemirror/autocomplete";
import { runInSandbox } from ".";
import { getType } from "../../../utils/workflowUtils";

export function getCompletionsByExpr(
  expr: string,
  wordAfter: string,
  sampleMap: Record<string, any>
): Completion[] {
  const dollarMatch = expr.match(/.*\$(.*)$/);
  const exp = dollarMatch?.[1];
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

export function getCompletionsBySample(
  context: CompletionContext,
  sampleMap?: Record<string, any>
): any {
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
