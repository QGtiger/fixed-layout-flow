import { useState } from "react";
import { Modal } from "antd";
import Editor, { loader } from "@monaco-editor/react";
import { EditOutlined } from "@ant-design/icons";
import "./index.css";

// 临时处理下mōnaco-editor的路径问题
const productionPath =
  process.env.NODE_ENV === "production"
    ? "/static/xybot-front-flow/dev/410"
    : "";

loader.config({
  paths: {
    vs: productionPath + "/monaco-editor/min/vs",
  },
});

interface Props {
  value?: string;
  onChange?: (value?: string) => void;
}

const MonacoEditor = (props: Props) => {
  const { value, onChange } = props;
  const [open, setOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const editorConfig: any = {
    scrollbar: {
      horizontal: "hidden",
      vertical: "hidden",
    },
    lineNumbers: "on",
    wordWrap: "on",
    suggestOnTriggerCharacters: false,
    folding: false,
    // readOnly: true,
    suggest: {
      showStatusBar: false,
    },
    lineNumbersMinChars: 3,
    quickSuggestions: false,
    selectOnLineNumbers: true,
    lineDecorationsWidth: 10,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    minimap: {
      enabled: false,
    },
    overviewRulerLanes: 0,
  };

  return (
    <div className="monaco-editor-wrapper relative">
      <div className="read-only">
        <Editor
          line={5}
          height={200}
          defaultLanguage="python"
          theme="vs-light"
          loading={null}
          value={value}
          options={editorConfig}
        ></Editor>
      </div>
      <span
        className="shadow-[0px_2px_4px_rgba(0,0,0,0.2)] rounded open-code-icon absolute inline-flex bottom-[6px] right-[6px] w-[24px] h-[24px]  items-center  justify-center cursor-pointer  "
        onClick={() => setOpen(true)}
      >
        <EditOutlined className="text-[16px] text-[#9DABBE]" />
      </span>

      <Modal
        open={open}
        closable
        centered
        destroyOnHidden
        width={800}
        title="编辑代码"
        maskClosable={false}
        onCancel={() => {
          onChange?.(value);
          setOpen(false);
        }}
        className="monaco-editor-modal"
        okButtonProps={{ style: { background: "#000" } }}
        onOk={() => {
          onChange?.(currentValue);
          setOpen(false);
        }}
      >
        <div className="monaco-editor-wrapper ">
          <Editor
            height={500}
            line={5}
            onChange={(value) => {
              setCurrentValue(value);
            }}
            defaultLanguage="python"
            theme="vs-light"
            loading={null}
            value={value}
            options={{
              ...editorConfig,
              readOnly: false,
            }}
          ></Editor>
        </div>
      </Modal>
    </div>
  );
};

export default MonacoEditor;
