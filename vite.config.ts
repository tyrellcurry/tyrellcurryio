import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve, basename, dirname } from "path";
import { globSync } from "fs";

const rootHtml = Object.fromEntries(
  globSync("*.html").map((file) => [basename(file, ".html"), resolve(file)])
);

const blogHtml = Object.fromEntries(
  globSync("blog/*.html").map((file) => {
    const slug = basename(file, ".html");
    return [`blog/${slug}`, resolve(file)];
  })
);

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: { ...rootHtml, ...blogHtml },
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:8081",
    },
  },
});
