import { IPaasFormSchema } from "@/type";
import { createTempLocales } from "@xybot/i18n";
import localLangs from "./localLangs";

export function formValueNormalize(
  value: any,
  normalize?: (value: any) => any
): any {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    // 如果是对象，递归 normalize
    return Object.entries(value).reduce(
      (acc, [key, val]) => {
        acc[key] = formValueNormalize(
          normalize ? normalize(val) : val,
          normalize
        );
        return acc;
      },
      {} as Record<string, any>
    );
  }
  // 如果是基本类型，直接返回
  return value;
}

export function replaceHtmlATagsWithMarkdown(str: string) {
  str = str.replace(/'/g, `"`);
  // 正则表达式匹配<a>标签
  // 匹配具有href属性的<a>标签，可选地匹配具有title属性
  const regex =
    /<a\s+(?:[^>]*?\s+)?href="([^"]*)"(\s+title="([^"]*)")?([^>]*)?>(.*?)<\/a>/gi;

  // 使用正则表达式和替换函数进行替换
  return str.replace(regex, (match, href, title, titleText, rest, linkText) => {
    // 如果有title属性，使用title文本作为链接文本
    const linkTextToUse = titleText || linkText.trim();
    return `[${linkTextToUse}](${href})`;
  });
}

export function getLocals() {
  return createTempLocales(localLangs);
}

export function isVisibleFunc(expression: string, formValue: object) {
  return new Function(
    "context",
    `
    try {
      with(context) {
        return !!(${expression});
      }
    } catch (e) {
      return false
    }
  `
  )(formValue);
}

// 清除不可见的表单数据
export function clearFormValueWithSchema(
  schema: IPaasFormSchema[],
  formValue: Record<string, any>
) {
  try {
    const keys = Object.keys(formValue);
    const result: Record<string, any> = {};
    keys.forEach((key) => {
      const schemaItem = schema.find((it) => it.code === key);
      if (schemaItem) {
        if (schemaItem.visible || schemaItem.visible === undefined) {
          if (!schemaItem.visibleRules) {
            result[key] = formValue[key];
          } else if (
            schemaItem.visibleRules &&
            isVisibleFunc(schemaItem.visibleRules, formValue)
          ) {
            result[key] = formValue[key];
          }
        }
      }
    });
    return result;
  } catch (e) {
    return {};
  }
}
