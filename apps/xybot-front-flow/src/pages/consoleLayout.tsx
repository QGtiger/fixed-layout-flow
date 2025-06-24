import { ConfigProvider, Layout, Menu, MenuProps, Typography } from "antd";
import classNames from "classnames";
import ChatBotLogo from "@/assets/chatbot_logo.png";
import {
  HistoryOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { useBoolean } from "ahooks";
import { useLocation, useNavigate, useOutlet } from "react-router-dom";
import { ConsoleModel } from "./model";
import { AuthLoginLayout } from "@/Layouts/AuthLogin";
import LayoutMenuFooter from "./LayoutMenuFooter";

function ConsoleLayout() {
  const outlet = useOutlet();
  const [collapsed, collapsedAction] = useBoolean(window.innerWidth < 768);
  const { hideConsoleMenu } = ConsoleModel.useModel();
  const nav = useNavigate();

  const menuList: MenuProps["items"] = [
    {
      key: "/flow",
      label: "Flow 工作台",
      icon: <RobotOutlined />,
      onClick(item) {
        nav(item.key);
      },
    },
    {
      key: "/logs",
      label: "执行记录",
      icon: <HistoryOutlined />,
      onClick(item) {
        nav(item.key);
      },
    },
  ];
  const { pathname } = useLocation();

  let _hideConsoleMenu = window.__MICRO_APP_ENVIRONMENT__
    ? true
    : hideConsoleMenu;
  if (localStorage.getItem("testMode") === "true") {
    _hideConsoleMenu = false;
  }

  const layoutBgClassName = window.__MICRO_APP_ENVIRONMENT__
    ? "!bg-white"
    : "!bg-gradient-to-b from-[#E6ECFF] via-[#F0F9FF] via-50% to-[#F0F9FF]";

  if (window.__MICRO_APP_ENVIRONMENT__) {
    return outlet;
  }

  // 如何是登录页面的话
  if (pathname === "/login") {
    return outlet;
  }

  return (
    <AuthLoginLayout>
      <ConfigProvider
        theme={{
          components: {
            Layout: {
              triggerBg: "raba(0, 0, 0, 0)",
            },
          },
        }}
      >
        <Layout
          className={
            "cus-layout w-full h-[100vh]  relative " + layoutBgClassName
          }
        >
          <Layout.Sider
            reverseArrow
            collapsible
            onCollapse={collapsedAction.toggle}
            collapsed={collapsed}
            width={260}
            className={classNames("!bg-transparent h-full", {
              " hidden": _hideConsoleMenu,
            })}
            trigger={
              <div className="">
                {collapsed ? (
                  <MenuUnfoldOutlined className="!text-[#758298] text-[14px] transition-color" />
                ) : (
                  <MenuFoldOutlined className="!text-[#758298] text-[14px] transition-color" />
                )}
              </div>
            }
          >
            <div className="flex flex-col h-full">
              <div
                className={classNames([
                  "bg-transparent py-5 flex items-center space-x-3  mx-1",
                  collapsed ? "px-4" : "px-4 ",
                ])}
              >
                <img
                  src={ChatBotLogo}
                  alt="logo"
                  className="w-[40px] h-[40px] rounded-md shadow-md"
                />
                <Typography.Text
                  className={classNames([
                    "text-xl text-black font-semibold text-nowrap transition-all opacity-100 w-[138px]",
                    {
                      "w-0 !opacity-0": collapsed,
                    },
                  ])}
                >
                  Flow
                </Typography.Text>
              </div>

              <div
                className={classNames([
                  "flex-1",
                  !collapsed ? "overflow-y-auto" : undefined,
                ])}
              >
                <Menu
                  inlineIndent={16}
                  // mode={collapsed ? 'vertical' : 'inline'}
                  // inlineCollapsed={collapsed}
                  items={menuList}
                  selectedKeys={[pathname]}
                  className="w-full box-border px-4 !border-r-0 !bg-transparent menu"
                />
              </div>

              <LayoutMenuFooter collapsed={collapsed} />
            </div>
          </Layout.Sider>
          <Layout.Content className="bg-white rounded-l-2xl !pb-0 overflow-auto !m-0">
            <main
              className={classNames(
                "box-border w-full h-full py-[30px] px-10 min-w-[1120px] overflow-x-auto",
                {
                  "!p-0": _hideConsoleMenu,
                }
              )}
            >
              {outlet}
            </main>
          </Layout.Content>
        </Layout>
      </ConfigProvider>
    </AuthLoginLayout>
  );
}

export default function ConsoleLayoutWrapper() {
  return <ConsoleModel.Provider>{<ConsoleLayout />}</ConsoleModel.Provider>;
}
