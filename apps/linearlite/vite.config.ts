// @ts-check

import path from "node:path";
import process from "node:process";

import { livestoreDevtoolsPlugin } from "@livestore/devtools-vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import devtoolsJson from "vite-plugin-devtools-json";

const isProdBuild = process.env.NODE_ENV === "production";

// https://vitejs.dev/config/
export default defineConfig({
  worker: isProdBuild ? { format: "es" } : undefined,
  optimizeDeps: {
    // TODO remove once fixed https://github.com/vitejs/vite/issues/8427
    exclude: ["@livestore/wa-sqlite"]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  plugins: [
    devtoolsJson(),
    react(),
    cloudflare(),
    tailwindcss(),
    livestoreDevtoolsPlugin({
      schemaPath: "./src/lib/livestore/schema/index.ts"
    }),
    svgr({
      svgrOptions: {
        svgo: true,
        plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
        svgoConfig: {
          plugins: [
            "preset-default",
            "removeTitle",
            "removeDesc",
            "removeDoctype",
            "cleanupIds"
          ]
        }
      }
    })
  ]
});
