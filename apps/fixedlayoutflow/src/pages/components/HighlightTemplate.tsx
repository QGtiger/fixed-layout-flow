import classNames from "classnames";
import React from "react";
import ExpressHighlight from "./ExpressHighlight";

interface HighlightTemplateProps {
  content: string;
  highlightClassName?: string; // 可选的自定义高亮类名
}

const HighlightTemplate: React.FC<HighlightTemplateProps> = ({
  content,
  highlightClassName = "highlight-template", // 默认类名
}) => {
  // 使用正则表达式分割字符串，匹配 [[]] 及其内容
  const parts = content.split(/(\[\[.*?\]\])/);

  return (
    <span>
      {parts.map((part, index) => {
        // 检查是否是 [[]] 内的内容
        const isTemplate =
          part.startsWith("[[[") && part.endsWith("]]]")
            ? false // 排除 [[[]]] 情况
            : part.startsWith("[[") && part.endsWith("]]");

        if (isTemplate) {
          // 提取 [[]] 内的内容（去掉 [[ 和 ]]）
          const innerContent = part.substring(2, part.length - 2);
          return (
            <span
              key={index}
              className={classNames(highlightClassName, " px-1 ")}
            >
              <span className="px-0.5 py-[3px] rounded border border-gray-300">
                <ExpressHighlight content={innerContent} />
              </span>
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

export default HighlightTemplate;
