import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve, basename } from "path";
import { globSync } from "fs";

const htmlFiles = Object.fromEntries(
  globSync("*.html").map((file) => [basename(file, ".html"), resolve(file)])
);

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: htmlFiles,
    },
  },
});
