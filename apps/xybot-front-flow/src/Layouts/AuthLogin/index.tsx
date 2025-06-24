import { getAccessToken } from '@/api';
import { UserModel } from '@/models/UserModel';
import { useMount } from 'ahooks';
import { Spin } from 'antd';
import { PropsWithChildren } from 'react';

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
    return <Spin spinning fullscreen />;
  }
  return children;
};
