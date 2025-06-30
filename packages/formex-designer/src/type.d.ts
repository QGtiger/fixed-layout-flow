type DatePickerFormat = "YYYY-MM-DD" | "YYYY/MM/DD";

interface Setter {
  type: string;
  name: string;
  label: string;
  componentProps?: Record<string, any>;
}

interface MaterialItem {
  code: string;
  name: string;
  desc: string;
  icon?: React.ReactNode;
  defaultProps?: Record<string, any>;
  hidden?: boolean;

  configSetter?: Setter[];

  dev: React.FC<MaterialItemProps<Record<string, any>>>;
  prod: React.FC<MaterialItemProps>;
}

type MaterialItemProps<T = any> = {
  id: string;
  code: string;

  required?: boolean;
} & T;

interface FormexItem {
  code: string;

  id: string;
  props?: Record<string, any>;

  children?: FormexItem[];
}

interface FormexSchemaV1 {
  version: "1.0";
  formItems: FormexItem[];
}

type FormexSchema = FormexSchemaV1;
