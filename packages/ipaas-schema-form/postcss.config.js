module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "postcss-prefix-selector": {
      prefix: ".ipaas-schema-form",
      transform(prefix, selector, prefixedSelector) {
        // 排除不需要加前缀的选择器
        if (selector.includes("html") || selector.includes("body")) {
          return selector;
        }
        return prefixedSelector;
      },
    },
  },
};
