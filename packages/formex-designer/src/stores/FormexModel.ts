import { createCustomModel } from "@/common/createModel";
import { useBoolean } from "ahooks";
import { Form } from "antd";

export interface FormexModelProps {
  onFinish?: (values: any) => Promise<void>;
  disableSubmit?: boolean;
  successText?: string;
  showErrorMessage?: (text: string) => void;
  onFileUpload?: (file: File) => Promise<string>;
}

export const FormexModel = createCustomModel((props: FormexModelProps) => {
  const [formIns] = Form.useForm();
  const { onFileUpload } = props;

  const [showSuccessPage, showSuccessPageAction] = useBoolean(false);

  const onFormexFinish = async () => {
    await formIns.validateFields().then(props.onFinish);
    showSuccessPageAction.setTrue();
  };

  // 重新填写表单
  const onReFill = (reset?: boolean) => {
    reset && formIns.resetFields();
    showSuccessPageAction.setFalse();
  };

  const handleImageUpload = async (
    file: File,
    callback: (urL: string, desc: string) => void
  ) => {
    try {
      if (!onFileUpload) {
        throw new Error("onFileUpload function is not provided");
      }
      const url = await onFileUpload?.(file);

      // 4. 插入编辑器
      callback(url, file.name || "image.png");
    } catch (error) {
      console.error("上传失败:", error);
      callback("", "上传失败");
    }
  };

  return {
    ...props,
    formIns,
    showSuccessPage,
    onReFill,
    onFormexFinish,
    handleImageUpload,
  };
});
