import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const offlineRoot = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig({
  root: offlineRoot,
  base: "./",
  publicDir: false,
  plugins: [react()],
  build: {
    outDir: `${projectRoot}/offline-reader`,
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: `${offlineRoot}/index.html`,
      output: {
        format: "iife",
        entryFileNames: "assets/reader.js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});
