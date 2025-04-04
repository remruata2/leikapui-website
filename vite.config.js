import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const baseUrl = "./";
  const timestamp = new Date().getTime(); // Add timestamp for cache busting

  return {
    base: baseUrl,
    plugins: [react()],
    build: {
      outDir: "dist",
      minify: true,
      rollupOptions: {
        output: {
          // Add cache busting to chunk and asset filenames
          entryFileNames: `assets/[name]-[hash]-${timestamp}.js`,
          chunkFileNames: `assets/[name]-[hash]-${timestamp}.js`,
          assetFileNames: `assets/[name]-[hash]-${timestamp}.[ext]`,
        },
      },
    },
    server: {
      port: 3002,
      host: true,
    },
  };
});
