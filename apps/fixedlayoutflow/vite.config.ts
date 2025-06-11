import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig(() => {
  const isWebBuild = process.env.VITE_BUILD_MODE === "web";
  if (isWebBuild) {
    return {
      base: "https://winrobot-pub-a.oss-cn-hangzhou.aliyuncs.com/static/fixedlayoutflow/dist/",
      plugins: [react()],
      resolve: {
        alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
      },
    };
  }
  return {
    base: process.env.NODE_ENV === "development" ? "/" : "/fixed-layout-flow/",
    plugins: [react()],
    resolve: {
      alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
    },
  };
});
