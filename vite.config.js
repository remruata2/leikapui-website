import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const baseUrl = "./";

  return {
    base: baseUrl,
    plugins: [react()],
    build: {
      outDir: "dist",
      minify: true,
    },
    server: {
      https: {
        key: fs.readFileSync("../localhost-key.pem"),
        cert: fs.readFileSync("../localhost.pem"),
      },
    },
  };
});
