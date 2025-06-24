import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { createHtmlPlugin } from "vite-plugin-html";
import { CodeInspectorPlugin } from "code-inspector-plugin";
import path from "path";

const YD = () => {
  if (process.env.NODE_ENV === "production") {
    return {};
  } else {
    return {
      API_URL: process.env?.API_URL || "https://test-api.yingdao.com",
    };
  }
};

export default defineConfig(({ mode }) => {
  const env =
    mode === "development" ? loadEnv(mode, process.cwd(), "") : process.env;

  return {
    base: "/",
    plugins: [
      react(),
      createHtmlPlugin({
        entry: "/src/.xybot/main.tsx",
        // @ts-expect-error 就这样吧
        viteNext: true,
        inject: {
          tags: [
            {
              injectTo: "head",
              tag: "script",
              children: `window.YD=${JSON.stringify(YD())}`,
            },
          ],
        },
      }),
      CodeInspectorPlugin({
        bundler: "vite",
      }),
    ],

    define: {
      "process.env": env,
    },
    resolve: {
      alias: [
        { find: "@", replacement: path.resolve(__dirname, "src") },
        { find: "xybot", replacement: path.resolve(__dirname, "src/.xybot") },
      ],
    },
    build: {
      manifest: true,
    },
  };
});
