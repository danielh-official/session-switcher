const path = require("path");
const sveltePreprocess = require("svelte-preprocess");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  mode: "production",
  entry: {
    background: "./src/background/index.ts",
    popup: "./src/popup/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]/index.js",
    clean: true,
  },
  resolve: {
    alias: {
      svelte: path.resolve("node_modules", "svelte"),
    },
    extensions: [".mjs", ".js", ".ts", ".svelte"],
    mainFields: ["svelte", "browser", "module", "main"],
    conditionNames: ["svelte", "browser", "import"],
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: {
            compilerOptions: {
              dev: false,
            },
            emitCss: false,
            hotReload: false,
            preprocess: sveltePreprocess(),
          },
        },
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /node_modules\/svelte\/.*\.mjs$/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  target: "web",
  optimization: {
    minimize: false, // Keep readable for debugging
  },
  plugins: [new BundleAnalyzerPlugin()],
};
