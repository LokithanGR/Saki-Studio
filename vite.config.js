import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const sheetsUrl = env.VITE_SHEETS_API_URL || "";

  let proxy = undefined;
  try {
    if (sheetsUrl) {
      const u = new URL(sheetsUrl);
      proxy = {
        "/api/gallery": {
          target: u.origin,
          changeOrigin: true,
          secure: true,
          rewrite: () => u.pathname
        }
      };
    }
  } catch {}

  return {
    plugins: [react()],
    server: { proxy }
  };
});
