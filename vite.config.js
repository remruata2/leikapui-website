import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

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
      port: 3002,
      host: true,
    },
  };
});
