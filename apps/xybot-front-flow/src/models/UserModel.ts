import { getAccessToken, setAccessToken } from "@/api";
import { request } from "@/api/request";
import { createCustomModel } from "@/common/createModel";
import { useMount, useReactive, useRequest } from "ahooks";
import { useLocation, useNavigate } from "react-router-dom";

interface UserInfo {
  organizationUuid: string;
  userId: string;
  uuid: string;
  grade: string;
  avatarUrl?: string;
  enterpriseUserName: string;
  name: string;
  enterpriseUuid: string;
  nickName: string;
}

export const UserModel = createCustomModel(() => {
  const nav = useNavigate();
  const { pathname, search } = useLocation();
  const userViewModel = useReactive<UserInfo>({
    nickName: "",
    uuid: "",
    organizationUuid: "",
    userId: "",
    grade: "",
    avatarUrl: "",
    enterpriseUserName: "",
    name: "",
    enterpriseUuid: "",
  });

  const { loading: queryUserInfoLoading, runAsync: queryUserInfo } = useRequest(
    async (token: string) => {
      console.log("设置", token);
      setAccessToken(token);
      if (!token) {
        // 清空登录信息
        Object.assign(userViewModel, {
          nickName: "",
          uuid: "",
        });
      } else if (!userViewModel.uuid) {
        console.log("查询用户信息", token);
        const { data } = await request<UserInfo>({
          url: "/api/v1/user/info/rich",
          method: "get",
        });

        if (data) {
          Object.assign(userViewModel, data);
        }
      }
      return userViewModel;
    },
    {
      manual: true,
    }
  );

  useMount(() => {
    const token = getAccessToken();
    if (token) {
      queryUserInfo(token);
    }
  });

  return {
    queryUserInfoLoading,
    userInfo: userViewModel,

    userLogin: (opt: { token: string; redirectUrl?: string }) => {
      const { token, redirectUrl = "/" } = opt;
      return queryUserInfo(token).then((r) => {
        console.log("跳转到", redirectUrl);
        nav(redirectUrl, {
          replace: true,
        });
        return r;
      });
    },
    userLogout() {
      queryUserInfo("");
      nav(`/login?from=${encodeURIComponent(pathname + search)}`, {
        replace: true,
      });
    },
  };
});
