import { build } from "esbuild";
import sveltePlugin from "esbuild-svelte";
import { sveltePreprocess } from "svelte-preprocess";

await build({
  entryPoints: ["src/background/index.ts"],
  bundle: true,
  outfile: "dist/background/index.js",
  platform: "browser",
  target: "firefox109",
  format: "iife",
  globalName: "SessionSwitcher",
  minify: false,
  sourcemap: false,
});

await build({
  entryPoints: ["src/popup/index.ts"],
  bundle: true,
  outfile: "dist/popup/index.js",
  platform: "browser",
  target: "firefox109",
  format: "iife",
  minify: true,
  sourcemap: false,
  loader: {
    ".css": "css",
  },
  plugins: [
    sveltePlugin({
      preprocess: sveltePreprocess(),
      compilerOptions: {
        css: "injected",
      },
    }),
  ],
});
