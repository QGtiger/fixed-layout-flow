import { Button, ConfigProvider, Form, Result } from "antd";
import { PropsWithChildren } from "react";
import { FormexModel } from "../FormexModel";
import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  HomeOutlined,
} from "@ant-design/icons";

function SuccessPage({ primaryColor }: { primaryColor: string }) {
  const { successText, onReFill } = FormexModel.useModel();
  return (
    <div className="flex flex-col">
      <div
        className="container mx-auto px-4 mt-6 sm:mt-10  w-[100%]"
        style={{
          boxSizing: "border-box",
        }}
      >
        <div
          className="bg-white rounded-lg  shadow-t px-4 py-8 md:p-8 max-w-3xl mx-auto"
          style={{
            boxShadow: "-2px 3px 10px 2px #d9d9d9",
          }}
        >
          <Result
            icon={
              <CheckCircleFilled
                className="text-green-500 text-6xl"
                style={{
                  color: primaryColor,
                }}
              />
            }
            title={<span className="text-2xl font-medium">提交成功</span>}
            subTitle={
              <span className="text-gray-500">
                {successText ||
                  "您的表单已成功提交，我们将尽快处理您的信息。如有任何问题，请随时与我们联系。"}
              </span>
            }
            extra={[
              <div
                key="actions"
                className="flex flex-col md:flex-row justify-center gap-4 mt-8"
              >
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => onReFill()}
                  className=" text-sm"
                >
                  返回表单
                </Button>
                <Button
                  size="large"
                  icon={<HomeOutlined />}
                  onClick={() => onReFill(true)}
                  className=" text-sm"
                >
                  重新填写表单
                </Button>
              </div>,
            ]}
          />

          <div className="mt-4 border-t pt-6 text-center text-gray-500">
            {/* <p>表单编号: SF-{new Date().getTime().toString().slice(-8)}</p> */}
            <p className="mt-2">
              提交时间: {new Date().toLocaleString("zh-CN")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomForm(
  props: PropsWithChildren<
    MaterialItemProps<{
      primaryColor: string;
    }>
  >
) {
  const { formIns, showSuccessPage } = FormexModel.useModel();
  // @ts-ignore
  const { defaultValue, primaryColor, ...restProps } = props;
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryColor,
        },
      }}
    >
      <div className="px-4 md:px-10 pt-14 pb-20">
        {showSuccessPage ? (
          <SuccessPage primaryColor={primaryColor} />
        ) : (
          <Form layout="vertical" form={formIns} {...restProps}>
            <div className="max-w-[600px] mx-auto">{props.children}</div>
          </Form>
        )}
      </div>
    </ConfigProvider>
  );
}
