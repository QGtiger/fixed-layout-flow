import { Form, FormProps } from "antd";
import "./index.css";
import { IPaasFormSchema } from "./type";
import CreateSchemaFormItem from "./components/CreateSchemaFormItem";
import {
  createIpaasSchemaStore,
  IpaasSchemaStoreConfig,
  IpaasSchemaStoreType,
  StoreContext,
} from "./store";
import { useRef } from "react";

export function IpaasSchemaForm(
  props: FormProps & {
    schema: IPaasFormSchema[];
  } & IpaasSchemaStoreConfig
) {
  const {
    schema,
    editorLayoutWithDesc,
    editorMap,
    commonEditorWarpper,
    dynamicScriptExcuteWithOptions,
    ...restProps
  } = props;
  const [form] = Form.useForm();
  const storeRef = useRef<IpaasSchemaStoreType>();

  if (!storeRef.current) {
    storeRef.current = createIpaasSchemaStore(props);
  }

  return (
    <StoreContext.Provider value={storeRef.current}>
      <div className="ipaas-schema-form ">
        <Form form={form} layout="vertical" {...restProps}>
          <CreateSchemaFormItem schema={schema} />
        </Form>
      </div>
    </StoreContext.Provider>
  );
}

export * from "./type";
