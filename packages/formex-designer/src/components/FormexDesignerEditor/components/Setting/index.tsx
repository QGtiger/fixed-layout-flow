import { useMaterialStore } from "@/stores/useMaterialStore";
import { useSchemaStore } from "@/stores/useSchemaStore";
import { Empty, Form, Input, InputNumber, Switch } from "antd";
import RichEditorBtn from "./components/RichEditorBtn";
import BgSelector from "./components/bgSelector";
import OptionsEditor from "./components/optionsEditor";
import DatePickerFormatSelector from "./components/DatePickerFormatSelector";
import CustomColorPicker from "./components/CustomColorPicker";
import { debounce } from "lodash-es";

function renderFormElememt(setter: Setter) {
  const { type, componentProps } = setter;

  if (type === "input") {
    return <Input placeholder="请输入" {...componentProps} variant="filled" />;
  } else if (type === "inputnumber") {
    return (
      <InputNumber
        placeholder="请输入"
        className="!w-full"
        {...componentProps}
        variant="filled"
      />
    );
  } else if (type === "ricktext") {
    return <RichEditorBtn />;
  } else if (type === "bgselector") {
    return <BgSelector />;
  } else if (type === "optionseditor") {
    return <OptionsEditor />;
  } else if (type === "switch") {
    return <Switch />;
  } else if (type === "datepickerformatselelctor") {
    return <DatePickerFormatSelector />;
  } else if (type === "colorpicker") {
    return <CustomColorPicker />;
  }
}

export default function Setting() {
  const {
    selectedComponentId,
    getMaterialItemByComponentId,
    getFormexItemByComponentId,
    updateFormexItemByComponentId,
  } = useSchemaStore();
  const { materialMap } = useMaterialStore();
  const materialItem = getMaterialItemByComponentId(
    selectedComponentId,
    materialMap
  );
  const formexItem = getFormexItemByComponentId(selectedComponentId);
  if (!materialItem || !formexItem) {
    return (
      <div className="p-4 px-6 flex items-center justify-center h-full">
        <Empty description="请选择编辑组件" />
      </div>
    );
  }

  const { props } = formexItem;
  const { defaultProps, configSetter } = materialItem;
  if (!configSetter) {
    return (
      <div className="p-4 px-6 flex items-center justify-center h-full">
        <Empty description="该组件 没有配置项" />
      </div>
    );
  }
  return (
    <div
      key={selectedComponentId}
      className=" h-full overflow-auto p-4 px-6"
      onKeyDownCapture={(e) => e.stopPropagation()}
    >
      <Form
        layout="vertical"
        initialValues={{
          ...defaultProps,
          ...props,
        }}
        onValuesChange={debounce((changeValues) => {
          updateFormexItemByComponentId(selectedComponentId, changeValues);
        }, 200)}
      >
        {configSetter.map((it) => {
          return (
            <Form.Item key={it.name} name={it.name} label={it.label}>
              {renderFormElememt(it)}
            </Form.Item>
          );
        })}
      </Form>
    </div>
  );
}
