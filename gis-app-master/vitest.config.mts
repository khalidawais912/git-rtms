import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));
const r = (p: string) => path.resolve(root, p);

export default defineConfig({
  esbuild: { jsx: "automatic" },
  resolve: {
    alias: [
      { find: /^@\/public\/(.*)$/, replacement: r("public/$1") },
      { find: /^@\/(.*)$/, replacement: r("src/$1") },
      // next/font only works inside the Next.js compiler
      { find: /^next\/font\/(google|local)$/, replacement: r("src/test/mocks/next-font.ts") },
    ],
  },
  css: { modules: { classNameStrategy: "non-scoped" } },
  test: {
    environment: "jsdom",
    setupFiles: ["src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: { include: [/\.module\.css$/] },
    restoreMocks: true,
  },
});
