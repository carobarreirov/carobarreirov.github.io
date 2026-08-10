import { cpSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

import { defineConfig } from "vite";

const projectRoot = import.meta.dirname;
const documentDirectories = ["cv", "papers"];

export default defineConfig({
  plugins: [
    {
      name: "copy-static-documents",
      closeBundle() {
        const outputAssets = resolve(projectRoot, "dist/assets");
        mkdirSync(outputAssets, { recursive: true });

        for (const directory of documentDirectories) {
          cpSync(
            resolve(projectRoot, `assets/${directory}`),
            resolve(outputAssets, directory),
            { recursive: true },
          );
        }
      },
    },
  ],
});
