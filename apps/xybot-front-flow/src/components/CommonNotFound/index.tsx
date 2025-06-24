import { Button, Result } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CommonNotFound() {
  const nav = useNavigate();
  useEffect(() => {
    document.title = "404";
  }, []);
  return (
    <Result
      status={404}
      className="mt-20"
      title="404"
      subTitle="抱歉，您访问的页面不存在。"
      extra={
        <Button
          onClick={() => {
            nav("/"); // 使用 useNavigate 导航到首页
          }}
        >
          返回首页
        </Button>
      }
    ></Result>
  );
}
