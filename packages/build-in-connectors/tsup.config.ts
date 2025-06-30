import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: ["src/index.ts"],
  dts: true,
  clean: true,
  format: ["esm", "cjs"],
  external: ["react", "react-dom"],
  treeshake: true,
  // minify: true,
  sourcemap: true,
  splitting: true,
  // target: 'node14',
  ignoreWatch: ["**/dist", "**/node_modules"],

  // 使用 esbuildOptions 配置别名
  // esbuildOptions(options) {
  //   options.define = {
  //     ...options.define,
  //     "process.env.NODE_ENV": JSON.stringify(
  //       process.env.NODE_ENV || "development"
  //     ),
  //   };

  //   // 配置路径别名
  //   options.alias = {
  //     ...options.alias,
  //     "@": path.resolve(__dirname, "src"),
  //   };
  // },
});
