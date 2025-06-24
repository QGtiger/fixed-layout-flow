import axios from "axios";
import { createMessage } from "@/utils/customMessage";
import { navigate } from "@/utils/navigation";

// 走控制台登录
const ACCESS_TOKEN_KEY = "ACCESS_TOKEN";

export const API_URL = process.env.API_URL || window.YD?.API_URL;

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  if (!token) {
    return localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export const client = axios.create({
  // @ts-ignore
  baseURL: API_URL,
});

client.interceptors.request.use((config) => {
  const headers = {
    Authorization: `Bearer ${getAccessToken()}`,
    "Xybot-Product": "rpa",
  };

  Object.assign(config.headers, headers);

  return config;
});

client.interceptors.response.use(
  // @ts-expect-error
  (res) => {
    const { code, data, msg } = res.data;
    if (code === 200) {
      return {
        success: true,
        data,
        code,
      };
    } else {
      if (code == 401) {
        // 未登录
        setAccessToken("");

        navigate("/login");
      }

      createMessage(
        {
          type: "error",
          content: msg,
        },
        {
          hideOther: true,
        }
      );

      return {
        success: false,
        data,
        code,
        errorMsg: msg,
      };
    }
  },
  (error) => {
    return {
      success: false,
      data: null,
      code: 500,
      errorMsg: error.message,
    };
  }
);
