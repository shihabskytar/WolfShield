import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: { port: 1420, strictPort: true },
  resolve: {
    alias: {
      "@wolfshield/shared": `${import.meta.dirname}/../../packages/shared/src/index.ts`,
      "@wolfshield/engine": `${import.meta.dirname}/../../packages/engine/src/index.ts`,
    },
  },
});
