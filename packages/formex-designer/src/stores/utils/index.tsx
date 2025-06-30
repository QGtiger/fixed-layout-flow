import { Form, Typography } from "antd";
import MaterialWrapper from "./MaterialWrapper";
import { useEffect } from "react";

export function MaterialWrapperHoc(
  Component: React.FC<MaterialItemProps>
): React.FC<MaterialItemProps> {
  return function WrappedComponent(props: MaterialItemProps) {
    return (
      <MaterialWrapper {...props}>
        <Component {...props} />
      </MaterialWrapper>
    );
  };
}

export function FormItemHoc(
  Component: React.FC<MaterialItemProps>
): React.FC<MaterialItemProps> {
  return function FormItemWrappedComponent(props: MaterialItemProps) {
    return (
      <Form.Item
        name={props.id}
        required={props.required}
        rules={[
          {
            validator: async (_, value) => {
              if (props.required && !value) {
                return Promise.reject(new Error(`请填写 ${props.name || ""}`));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        {<Component {...props} />}
      </Form.Item>
    );
  };
}

export function FormItemLabelHoc(
  Component: React.FC<MaterialItemProps>
): React.FC<
  MaterialItemProps<{
    name: string;

    // 组件的默认值
    defaultValue?: any;
    onChange?: (value: any) => void;
    required?: boolean;
  }>
> {
  return function FormItemWrappedComponent(props) {
    const { defaultValue, ...otherProps } = props;
    // 组件的默认值
    useEffect(() => {
      defaultValue && props.onChange?.(defaultValue || undefined);
    }, [defaultValue]);
    return (
      <div className="flex flex-col gap-2">
        {props.name && (
          <div className="label font-semibold">
            <Typography.Text>
              {props.name}
              {props.required ? "(必填)" : ""}
            </Typography.Text>
          </div>
        )}
        <Component {...otherProps} />
      </div>
    );
  };
}
