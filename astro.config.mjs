// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import react from "@astrojs/react";

// https://astro.build/config

const assetsBaseUrl = process.env.ASSETS_BASE_URL || "/";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        $fonts: resolve("./src/assets/fonts"),
      },
    },
  },

  integrations: [react()],
  base: assetsBaseUrl,
});
