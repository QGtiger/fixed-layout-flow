import { CloseOutlined, FormOutlined } from "@ant-design/icons";
import { useBoolean } from "ahooks";
import { App, Button, ConfigProvider, Drawer } from "antd";
import { deepClone, uploadFileByFlow } from "@/utils";

export default function CustomFormexDesigner({
  onClose,
  value,
  onChange,
  ...restProps
}: {
  onClose?: () => void;
  value?: any;
  onChange?: (value: any) => void;
}) {
  const [open, openAction] = useBoolean(false);
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#7f70f5" } }}>
      <ConfigProvider theme={{ token: { colorPrimary: "#000000" } }}>
        <Button
          size="small"
          className="!h-[36px] text-[#7c7b7b]"
          block
          onClick={openAction.setTrue}
          icon={<FormOutlined />}
          {...restProps}
        >
          表单设计器
        </Button>
      </ConfigProvider>
      <Drawer
        open={open}
        closable={false}
        width="95%"
        styles={{
          body: {
            padding: 0,
          },
        }}
        destroyOnClose
      >
        <div className=" relative">
          222
          <div
            className=" absolute right-5 top-5"
            style={{
              zIndex: 100,
            }}
          >
            <CloseOutlined
              className="cursor-pointer"
              onClick={openAction.setFalse}
            />
          </div>
        </div>
      </Drawer>
    </ConfigProvider>
  );
}
