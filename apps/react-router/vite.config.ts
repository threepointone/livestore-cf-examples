import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// import { livestoreDevtoolsPlugin } from "@livestore/devtools-vite";
import devtoolsJson from "vite-plugin-devtools-json";

export default defineConfig({
  optimizeDeps: {
    exclude: ["@livestore/wa-sqlite"]
  },
  worker: { format: "es" },
  plugins: [
    devtoolsJson(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    // this is causing the "invoke was called before connect" error
    // livestoreDevtoolsPlugin({ schemaPath: "./app/livestore/schema.ts" }),
    reactRouter(),
    tsconfigPaths()
  ]
});
