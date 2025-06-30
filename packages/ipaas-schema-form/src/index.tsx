import { Form, FormProps } from "antd";
import "./index.css";
import { IPaasFormSchema } from "./type";
import CreateSchemaFormItem from "./components/CreateSchemaFormItem";
import {
  createIpaasSchemaStore,
  IpaasSchemaStoreConfig,
  IpaasSchemaStoreType,
  StoreContext,
  useIpaasSchemaStore,
} from "./store";
import { useRef } from "react";
import { formValueNormalize } from "./utils";

function Wrapper({ schema }: { schema: IPaasFormSchema[] }) {
  const { normalize } = useIpaasSchemaStore();
  const values = Form.useWatch([]);

  // normalize 一下
  // {a: {value: 1}} => {a: 1}
  const formValues = formValueNormalize(values, normalize);

  return <CreateSchemaFormItem schema={schema} formValues={formValues} />;
}

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
    dynamicScriptExcuteWithFormSchema,
    normalize,
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
          <Wrapper schema={schema} />
        </Form>
      </div>
    </StoreContext.Provider>
  );
}

export * from "./type";

export { useEditor, useIpaasSchemaStore } from "./store";
