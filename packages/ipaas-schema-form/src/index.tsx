import { Form, FormProps } from "antd";
import "./index.css";
import { IPaasFormSchema } from "./type";
import CreateSchemaFormItem from "./components/CreateSchemaFormItem";

export function IpaasSchemaForm(
  props: FormProps & {
    schema: IPaasFormSchema[];
  }
) {
  const { schema, ...restProps } = props;
  const [form] = Form.useForm();
  return (
    <div className="ipaas-schema-form ">
      <Form form={form} layout="vertical" {...restProps}>
        <CreateSchemaFormItem schema={schema} />
      </Form>
    </div>
  );
}

export * from "./type";
