export type FormItemValueType = {
  label?: string;
  value: any;
  type?: string;
  expression?: string;
};

export type IPaasDynamicFormItem = {
  type: IPaasFormFieldEditorKind;
  payload: IPaasFormSchema;
  next: (
    current: IPaasDynamicFormItem,
    acient: IPaasDynamicFormItem[]
  ) => IPaasDynamicFormItem | null;
  parent: IPaasDynamicFormItem | null;
};

export type IPaasCommonFormFieldProps<T = string> = {
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  name: string;
  schemaInfo: IPaasFormSchema;
};

export type IPaasFormSchema = {
  code: string | string[];
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  description?: string;
  visible?: boolean;
  visibleRules?: string;
  required: boolean;
  validateRules?: string;
  editor: {
    kind: IPaasFormFieldEditorKind;
    config: any; // 类型推导欠缺
  };

  group?: string;
};

export type IPaasFormFieldEditorKind =
  | "Input"
  | "Textarea"
  | "DatetimePicker"
  | "InputNumber"
  | "InputWithCopy"
  | "Select"
  | "Webhook"
  | "DynamicActionForm"
  | "VariableGenerator"
  | "MultiSelect"
  | "Upload";

export type IPaasFormFieldEditorConfig = {
  Input: {
    defaultValue: string;
    placeholder: string;
  };
  Textarea: {
    defaultValue: string;
    placeholder: string;
  };
  DatetimePicker: {
    placeholder: string;
    valueFormat:
      | "YYYY-MM-DD"
      | "YYYY-MM-DD HH:mm:ss"
      | "accurateToSeconds"
      | "accurateToMilliseconds";
  };
  InputNumber: {
    defaultValue: number;
    placeholder: string;
  };
  InputWithCopy: {
    defaultValue: string;
    btnText: string;
  };
  Select: {
    isDynamic?: boolean;
    defaultValue: string;
    placeholder: string;
    depItems: string[];
    dynamicScript: string;
  };
  Webhook: {};
  DynamicActionForm: {
    depItems: string[];
    dynamicScript: string;
  };
  MultiSelect: {
    placeholder: string;
    depItems: string[];
    dynamicScript: string;
  };
};
