import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { babel } from "@rollup/plugin-babel";

// https://vite.dev/config/
export default defineConfig({
  base: "/projetointegrador_2m/",

  plugins: [
    react(),
    babel({
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      babelHelpers: "bundled",
      presets: ["@babel/preset-typescript"],
      plugins: [
        ["babel-plugin-react-compiler", {}],
      ],
    }),
  ],

  css: {
    postcss: "./postcss.config.js",
  },

  server: {
    port: 5173,
    open: true,
  },
});