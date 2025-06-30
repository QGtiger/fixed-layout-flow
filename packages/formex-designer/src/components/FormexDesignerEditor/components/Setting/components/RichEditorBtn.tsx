import { Button, Modal } from "antd";
import { Editor } from "@toast-ui/react-editor";

import "@toast-ui/editor/toastui-editor.css";
import "@toast-ui/editor/dist/i18n/zh-cn";
import { useEffect, useRef } from "react";

import "prismjs/themes/prism.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";

// Step 1. Import prismjs
import Prism from "prismjs";

// Step 2. Import language files of prismjs that you need
import "prismjs/components/prism-clojure.js";

import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import { EditOutlined } from "@ant-design/icons";
import { FormexModel } from "@/stores/FormexModel";

function RichEditor({
  value,
  onChange,
  handleImageUpload,
}: {
  value?: string;
  onChange?: (value: string) => void;
  handleImageUpload?: (
    file: File,
    callback: (url: string, desc: string) => void
  ) => void;
}) {
  const editorRef = useRef<Editor>(null);

  useEffect(() => {
    const editor = editorRef.current?.getInstance();
    if (!editor) return;

    const handleChange = () => {
      const markdown = editor.getMarkdown();
      onChange?.(markdown);
    };

    editor.on("change", handleChange);
    // @ts-ignore
    return () => editor.off("change", handleChange);
  }, []);

  return (
    <Editor
      ref={editorRef}
      previewStyle="vertical"
      height={`${window.innerHeight - 300}px`}
      language="zh-CN"
      hooks={{
        // @ts-expect-error
        addImageBlobHook: handleImageUpload, // handleImageUpload,
      }}
      placeholder="请输入内容"
      initialValue={value}
      plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
      viewer
    />
  );
}

export default function RichEditorBtn(props: {
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [modal, modalHolder] = Modal.useModal();
  const { handleImageUpload } = FormexModel.useModel();

  const showModal = () => {
    let content = props.value || "";
    modal.confirm({
      icon: null,
      title: "富文本编辑器",
      width: 1200,
      centered: true,
      content: (
        <div className="mt-4">
          <RichEditor
            {...props}
            onChange={(s) => {
              content = s;
            }}
            handleImageUpload={handleImageUpload}
          />
        </div>
      ),
      okText: "保存",
      cancelText: "取消",
      onOk() {
        props.onChange?.(content);
      },
      onCancel() {
        return new Promise<void>((resolve, reject) => {
          if (props.value !== content) {
            modal
              .confirm({
                title: "是否保存修改？",
                content: "您有未保存的修改，是否保存？",
                centered: true,
                okText: "保存",
                cancelText: "不保存",
                onOk() {
                  props.onChange?.(content);
                },
              })
              .then(() => {
                resolve();
              }, reject);
          } else {
            resolve();
          }
        });
      },
    });
  };
  return (
    <div>
      <Button block onClick={showModal} icon={<EditOutlined />}>
        编辑
      </Button>
      {modalHolder}
    </div>
  );
}
