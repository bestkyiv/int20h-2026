// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import react from "@astrojs/react";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config

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
  output: "static",
  adapter: cloudflare(),
});