import vinext from "vinext";
import { defineConfig } from "vite";
import { nitro } from "nitro/vite";
import tailwindcss from "@tailwindcss/postcss";

/** Vercel build target. Cloudflare bindings stay isolated in vite.config.ts. */
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  plugins: [vinext(), nitro()],
});
