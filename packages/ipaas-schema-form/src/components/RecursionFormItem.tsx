import { Form } from "antd";
import { ReactNode, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { excuteScriptByValidateRules } from "../utils/excuteScript";
import { IPaasDynamicFormItem } from "@/type";
import { getLocals, replaceHtmlATagsWithMarkdown } from "@/utils";
import { IpaasSchemaStore, useEditor } from "@/store";

const customLinkRenderer = ({ href, children }: any) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

const DefaultConfig = {
  placeholder: getLocals().plzInput,
};

function CommonLayout(node1: ReactNode, node2: ReactNode) {
  return (
    <div className="flex flex-col gap-1">
      {node2}
      {node1}
    </div>
  );
}

function WrapperFieldComponent(props: {
  formItemState: IPaasDynamicFormItem;
  [x: string]: any;
}) {
  const { formItemState, ...otherProps } = props;
  const { type, payload } = props.formItemState;
  const FieldComponent = useEditor(type);
  const { editorLayoutWithDesc } = IpaasSchemaStore();
  const _config = {
    ...DefaultConfig,
    ...payload.editor.config,
  };

  const _editorLayoutWithDesc = editorLayoutWithDesc || CommonLayout;
  return (
    <div className="relative">
      {_editorLayoutWithDesc(
        <FieldComponent name={payload.code} {...otherProps} {..._config} />,
        payload.description && (
          <div className="desc text-[#888f9d]">
            <ReactMarkdown
              components={{
                a: customLinkRenderer,
              }}
            >
              {replaceHtmlATagsWithMarkdown(payload.description)}
            </ReactMarkdown>
          </div>
        )
      )}
    </div>
  );
}

export default function RecursionFormItem({
  formItemState,
}: {
  formItemState: IPaasDynamicFormItem;
}) {
  const { payload, next } = formItemState;

  const nextFieldItem = useMemo(() => {
    let current: IPaasDynamicFormItem | null = formItemState;
    if (!next || !current) return null;

    // 获取所有祖先节点
    const acients: IPaasDynamicFormItem[] = [];
    acients.unshift(current);
    while ((current = current.parent)) {
      acients.unshift(current);
    }

    // 递归渲染
    const item = next(formItemState, acients);
    if (!item) return null;
    return <RecursionFormItem formItemState={item} />;
  }, [formItemState]);

  return (
    <>
      <Form.Item
        key={payload.code.toString()}
        label={payload.name}
        name={payload.code}
        required={payload.required}
        rules={[
          ({ getFieldsValue }) => ({
            validator(_, value) {
              const formValues = getFieldsValue();
              return new Promise<void>((r, j) => {
                let errorMessages = "";
                // 必填校验
                if (payload.required) {
                  if (value === undefined || value === null || value === "") {
                    errorMessages = getLocals().emptyErrorMsg;
                  }
                }

                if (payload.validateRules) {
                  const [suc, errorMsg = getLocals().invalidErrorMsg] =
                    excuteScriptByValidateRules(
                      payload.validateRules,
                      value,
                      formValues
                    );
                  if (!suc) {
                    errorMessages = errorMsg;
                  }
                }
                if (errorMessages) {
                  j(new Error(errorMessages));
                } else {
                  r();
                }
              });
            },
          }),
        ]}
      >
        <WrapperFieldComponent formItemState={formItemState} />
      </Form.Item>
      {nextFieldItem}
    </>
  );
}
