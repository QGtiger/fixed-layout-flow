import { UserModel } from "@/models/UserModel";
import { EllipsisOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Typography } from "antd";
import classNames from "classnames";

export default function LayoutMenuFooter({
  collapsed,
}: {
  collapsed: boolean;
}) {
  const {
    userInfo: { avatarUrl, enterpriseUserName, name },
    userLogout,
  } = UserModel.useModel();

  const dropdownItems: any[] = [
    {
      label: <div onClick={userLogout}>退出登录</div>,
      key: "logout",
      title: "",
    },
  ];

  return (
    <div className="mx-4 mt-2 mb-4">
      <div
        className={classNames([
          "h-[65px] py-3 rounded-2xl flex items-center border border-solid ",
          collapsed
            ? "border-transparent px-0 justify-center"
            : "border-[#E2E6EB] px-3 justify-between ",
        ])}
      >
        <div className="inline-flex items-center">
          {collapsed ? (
            <Dropdown
              menu={{
                items: dropdownItems,
              }}
              getPopupContainer={() => document.body}
            >
              {avatarUrl ? (
                <Avatar
                  className="cursor-pointer"
                  src={avatarUrl}
                  size="large"
                ></Avatar>
              ) : (
                <Avatar className="cursor-pointer" size="large">
                  {enterpriseUserName ?? "-"}
                </Avatar>
              )}
            </Dropdown>
          ) : (
            <Avatar
              style={{
                backgroundColor: "#f56a00",
              }}
              size="large"
            >
              {enterpriseUserName}
            </Avatar>
          )}
          <div
            className={classNames([
              "flex-col justify-center items-start ml-3",
              collapsed ? "hidden" : "inline-flex",
            ])}
          >
            <Typography.Text
              ellipsis={{
                tooltip: enterpriseUserName,
              }}
              className="text-[#212C3F] text-[13px] leading-[18px] mb-0.5 w-[130px]"
            >
              {enterpriseUserName}
            </Typography.Text>
            <Typography.Text
              ellipsis={{
                tooltip: name,
              }}
              className="text-[#758298] text-[12px] w-[130px]"
            >
              {name}
            </Typography.Text>
          </div>
        </div>
        <Dropdown
          menu={{
            items: dropdownItems,
          }}
          getPopupContainer={() => document.body}
        >
          <EllipsisOutlined
            className={classNames([
              "cursor-pointer text-[#758298] w-4 h-4 text-base",
              collapsed ? "!hidden" : "!block",
            ])}
          />
        </Dropdown>
      </div>
    </div>
  );
}
