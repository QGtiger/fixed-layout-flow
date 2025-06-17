export const COMMON_METHODS = {
  array: [
    { name: "slice", detail: "提取数组片段", example: "slice(start, end)" },
    { name: "map", detail: "映射数组", example: "map(item => item.value)" },
    {
      name: "filter",
      detail: "过滤数组",
      example: "filter(item => item.valid)",
    },
    { name: "last", detail: "获取最后一项", example: "last()" },
    { name: "length", detail: "数组长度", type: "property" },
  ],
  object: [
    { name: "keys", detail: "获取所有键名", example: "keys()" },
    { name: "values", detail: "获取所有值", example: "values()" },
  ],
  string: [
    { name: "length", detail: "字符串长度", type: "property" },
    { name: "toUpperCase", detail: "转换为大写", example: "toUpperCase()" },
    { name: "toLowerCase", detail: "转换为小写", example: "toLowerCase()" },
    { name: "trim", detail: "去除首尾空格", example: "trim()" },
    { name: "split", detail: "分割字符串", example: "split(',')" },
    { name: "replace", detail: "替换字符串", example: "replace('old', 'new')" },
    {
      name: "includes",
      detail: "检查是否包含子串",
      example: "includes('sub')",
    },
  ],
  number: [
    { name: "toFixed", detail: "格式化数字", example: "toFixed(2)" },
    { name: "isEven", detail: "检查是否为偶数", example: "isEven()" },
    { name: "isOdd", detail: "检查是否为奇数", example: "isOdd()" },
    { name: "toString", detail: "转换为字符串", example: "toString()" },
    {
      name: "toLocaleString",
      detail: "本地化数字格式",
      example: "toLocaleString()",
    },
  ],
  boolean: [
    {
      name: "toNumber",
      detail: "转换为数字",
      example: "toNumber()",
    },
    {
      name: "toString",
      detail: "转换为字符串",
      example: "toString()",
    },
  ],
};
