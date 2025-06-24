import { Login } from "@xbot-fe/Design";
import { ConfigProvider, message } from "antd";

import LoginBg from "@/assets/login-bg.png";

import "./index.css";
import classNames from "classnames";
import { API_URL } from "@/api";
import usePlatform from "@/hooks/usePlatform";
import { UserModel } from "@/models/UserModel";

const forgetUrl = () => {
  return window.YD?.ENV === "private"
    ? ""
    : window.YD?.HOME_URL + "/password/?sel=enterprise";
};

export default function LoginPage() {
  const { userLogin } = UserModel.useModel();
  const { isMobile } = usePlatform();

  const from = new URLSearchParams(window.location.search).get("from");

  const w = isMobile ? "w-[90%]" : "w-[418px]";

  const onLoginSuc = (data: any) => {
    console.log("登录成功", data);
    if (data.code == 200) {
      userLogin({
        token: data.access_token,
        redirectUrl: from ?? "/",
      });
    }
  };

  const bg = LoginBg; // isMobile ? LoginBg : LoginPcBg;

  return (
    <div
      style={{
        background: `url(${bg}) no-repeat center center`,
        backgroundSize: "cover",
      }}
      className={classNames(
        "w-full h-[100vh] flex items-center justify-center !bg-cover custom-login"
      )}
    >
      <div className={w}>
        <ConfigProvider prefixCls="ant">
          <Login
            title="Flow登录"
            forgetUrl={forgetUrl()}
            source="chatbot"
            logonUrl=""
            Basic="Y29uc29sZTpzVVdpeTZzTmlYZDBlNUxo"
            apiUrl={API_URL || "https://test-api.yingdao.com"}
            onLoginSuccess={onLoginSuc}
            onLoginError={(data: any) => {
              console.log("登录失败", data);
              message.error(data.msg);
            }}
            disableSSO
          />
        </ConfigProvider>
      </div>
    </div>
  );
}
