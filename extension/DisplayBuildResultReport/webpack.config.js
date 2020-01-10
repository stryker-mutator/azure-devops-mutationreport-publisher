const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  target: "node",
  entry: "./src/build-result-report-tab.ts",
  devServer: {
    https: true,
    port: 3000
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "azure-devops-extension-sdk": path.resolve("node_modules/azure-devops-extension-sdk"),
      "azure-devops-extension-api": path.resolve("node_modules/azure-devops-extension-api"),
      "azure-devops-ui": path.resolve("node_modules/azure-devops-ui")
    }
  },
  stats: {
    warnings: false
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
              use: {
                  loader: "ts-loader",
                  options: {
                      transpileOnly: true
                  }
              }
      },
      {
        test: /\.html$/,
        use: "file-loader"
      }
    ]
  },
  plugins: [new CopyWebpackPlugin([{ from: "**/*.html", context: "static" }])]
};
