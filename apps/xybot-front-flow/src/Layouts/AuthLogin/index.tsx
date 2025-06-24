import { getAccessToken } from "@/api";
import { CircleLoader } from "@/components/CircleLoader";
import { UserModel } from "@/models/UserModel";
import { useMount } from "ahooks";
import { PropsWithChildren } from "react";

export const AuthLoginLayout = ({ children }: PropsWithChildren<{}>) => {
  const {
    userInfo: { uuid },
    userLogout,
  } = UserModel.useModel();

  const token = getAccessToken();

  useMount(() => {
    if (!token) {
      userLogout();
    }
  });

  if (!token || !uuid) {
    return <CircleLoader />;
  }
  return children;
};
