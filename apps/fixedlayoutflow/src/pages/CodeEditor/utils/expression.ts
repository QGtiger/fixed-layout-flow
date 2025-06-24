/**
 * 获取字符串中， 最后的一个表达式
 * @param str 字符串
 * @returns 返回一个表达式字符串
 * 如果字符串中包含变量或函数调用，则返回一个表达式字符串
 * @example
 * getExpression("a + b") // "b"
 * getExpression("$(a).b") // "$(a).b"
 * getExpression("$(a + b)") // "$(a + b)"
 * getExpression("$(a + b).c") // "$(a + b).c"
 * getExpression("$(a + b).c.d.e  ") // ""
 * getExpression("1 + ('123123')") // "('123123')"
 */
export function getExpression(str: string) {
  // 实现思路： 调用此方法时, 用户肯定是输入了 . [ 才会被触发
  // 所以我可以倒推， 从尾部往前推
  // 对于特殊字符，例如 空格 . [ ] 等时，本直接返回 空字符，但是 可能是在字符串里面，例如 "[". 这样就是可以的
  const bracketsMap: Record<string, string> = {
    "(": ")",
    "[": "]",
  };

  // 引号
  const quotes = ["'", '"'];

  const rightBrackets = Object.values(bracketsMap);
  const leftBrackets = Object.keys(bracketsMap);

  let r = str.length - 1;
  const bracketsByRight: string[] = [];
  let inQuotes = false; // 是否在引号内
  let quoteChar = ""; // 当前引号类型
  let result: string | undefined = undefined;

  while (true) {
    if (r < 0) {
      // 没有括号了，说明已经找到了表达式
      if (!bracketsByRight.length) {
        // success
        result = str.slice(0).trim(); // 返回表达式
      }
      break; // 如果没有括号了，直接跳出
    }
    const char = str[r];

    // 在引号里面的话
    if (inQuotes) {
      // 如果当前字符是引号，并且是匹配的引号，说明结束了
      if (char === quoteChar) {
        inQuotes = false; // 结束引号
        quoteChar = ""; // 清空当前引号类型
      }
    } else {
      // 找到特殊字符，并且没有在托号内，就报错
      if (char === " " || char === "{" || char === "}") {
        // 不在括号内 就表示表达式结束了
        if (!bracketsByRight.length) {
          // success
          result = str.slice(r + 1).trim(); // 返回表达式
          break; // 如果没有括号了，直接跳出
        }
      } else {
        // 排查到引号
        if (quotes.includes(char)) {
          inQuotes = true;
          quoteChar = char; // 记录当前引号类型
        } else {
          // 如果是左括号，说明是一个表达式的开始
          if (leftBrackets.includes(char)) {
            const topItem = bracketsByRight[bracketsByRight.length - 1];
            // 如果栈顶元素不是 是匹配的右括号，说明表达式错误
            if (!topItem || bracketsMap[char] !== topItem) {
              if (!bracketsByRight.length) {
                // success
                result = str.slice(r + 1).trim(); // 返回表达式
              }
              break; // 不匹配，直接跳出
            }
            bracketsByRight.pop();
          } else if (rightBrackets.includes(char)) {
            // 如果是右括号，说明是一个表达式的结束
            bracketsByRight.push(char);
          }
        }
      }
    }
    r--;
  }

  return result;
}
