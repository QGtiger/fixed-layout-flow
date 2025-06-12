import React, { memo, useRef } from "react";
import { FlowModel } from "../model";
import { Tooltip } from "antd";

interface ExpressHighlightProps {
  content: string;
  highlightClassName?: string; // 可选的自定义高亮类名
}

function analysisExpress(
  express: string,
  struct: OutputStructItem[]
): {
  error: boolean;
  label?: string;
} {
  const tokens = express.split(".");
  let token: string | undefined = tokens.shift();
  let lastItem: OutputStructItem | undefined = undefined;
  let lastStruct: OutputStructItem[] = struct;
  while (token) {
    lastItem = lastStruct.find((item) => item.name === token);
    if (!lastItem) {
      return { error: true };
    }

    token = tokens.shift();
    lastStruct = lastItem.children || [];
  }

  if (!lastItem) {
    return { error: true };
  }

  return {
    error: false,
    label: lastItem.label,
  };
}

const ExpressNode = memo(({ express }: { express: string }) => {
  const { nodeController } = FlowModel.useModel();
  const tokens = express.split(".");
  const nodeId = tokens[0];
  const node = nodeController.getNode(nodeId);
  const containerRef = useRef<HTMLDivElement>(null);
  if (!node) {
    return <span className="text-red-500">Node not found</span>;
  }
  const { iconUrl } = node;
  const { error, label } = analysisExpress(
    tokens.slice(1).join("."),
    node.outputStruct || []
  );
  if (error) {
    return <span className="text-red-500">Invalid expression</span>;
  }
  return (
    <Tooltip
      title={express}
      placement="top"
      getPopupContainer={() => containerRef.current || document.body}
    >
      <div
        ref={containerRef}
        className=" inline-flex items-center gap-1 text-xs text-gray-700"
      >
        <img src={iconUrl} className=" w-3 h-3 object-cover" alt="" />
        <div className="w-[0.5px] h-[10px] bg-gray-400"></div>
        <span>{label}</span>
      </div>
    </Tooltip>
  );
  // return express;
});

const ExpressHighlight: React.FC<ExpressHighlightProps> = ({
  content,
  highlightClassName = "highlight-template", // 默认类名
}) => {
  // 使用正则表达式分割字符串，匹配 {{ }} 及其内容
  const parts = content.split(/(\{\{.*?\}\})/);

  return (
    <span>
      {parts.map((part, index) => {
        // 检查是否是 {{ }} 内的内容
        const isTemplate = part.startsWith("{{") && part.endsWith("}}");

        if (isTemplate) {
          // 提取 {{ }} 内的内容（去掉 {{ 和 }}）
          const innerContent = part.substring(2, part.length - 2);
          return (
            <span key={index} className={highlightClassName}>
              <span className="px-0.5 rounded border border-gray-200 bg-blue-100">
                <ExpressNode express={innerContent} />
              </span>
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};

export default ExpressHighlight;
