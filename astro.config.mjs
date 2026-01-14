// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import react from "@astrojs/react";

// https://astro.build/config

const getAllowedHost = () => {
  const allowedUrl = process.env.ALLOWED_ORIGINS;
  if (allowedUrl) {
    try {
      const url = new URL(allowedUrl);
      return url.hostname;
    } catch (e) {
      return null;
    }
  }
  return null;
};

const allowedHost = getAllowedHost();
const allowedHosts = ["localhost", "127.0.0.1",];
if (allowedHost && !allowedHosts.includes(allowedHost)) {
  allowedHosts.push(allowedHost);
}

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        $fonts: resolve("./src/assets/fonts"),
      },
    },
    preview: {
      allowedHosts,
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  integrations: [react()],
});
