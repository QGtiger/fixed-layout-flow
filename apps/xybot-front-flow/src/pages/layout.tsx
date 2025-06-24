import { useLocation, useNavigate, useOutlet } from "react-router-dom";
import {
  App,
  Button,
  ConfigProvider,
  message,
  Modal,
  notification,
  Result,
} from "antd";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

import "./layout.css";
import { useEffect } from "react";
import { NotificationRef } from "@/utils/customNotification";
import { useMount } from "ahooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MessageRef } from "@/utils/customMessage";
import { setLocation, setNavigator } from "@/utils/navigation";
import { UserModel } from "@/models/UserModel";
import { ModalRef } from "@/utils/customModal";
import ConsoleLayoutWrapper from "./consoleLayout";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  useMount(() => {
    console.error(error);
  });

  return (
    <Result
      status="500"
      title="500"
      subTitle="抱歉，系统出现了一些问题，请稍后再试。"
      className="mt-20"
      extra={
        <div className="flex gap-4 justify-center">
          <Button type="primary" onClick={resetErrorBoundary}>
            刷新
          </Button>
          <Button
            type="primary"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            返回首页
          </Button>
        </div>
      }
    />
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export default () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [api, notificationHolder] = notification.useNotification();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modalApi, modalContextHolder] = Modal.useModal();

  useEffect(() => {
    NotificationRef.current = api;
    MessageRef.current = messageApi;
    ModalRef.current = modalApi;
  });

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  useEffect(() => {
    setLocation(location);
  }, [location]);

  return (
    <App>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#3875f6", // Match your primary color
              },
            }}
          >
            <UserModel.Provider>
              <ConsoleLayoutWrapper />
              <div>
                {notificationHolder}
                {messageContextHolder}
                {modalContextHolder}
              </div>
            </UserModel.Provider>
          </ConfigProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </App>
  );
};
