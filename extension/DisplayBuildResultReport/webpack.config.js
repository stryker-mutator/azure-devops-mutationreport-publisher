const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  target: "node",
  entry: "./src/DisplayBuildResultTab.tsx",
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
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "azure-devops-ui/buildScripts/css-variables-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.woff$/,
        use: "base64-inline-loader"
      },
      {
        test: /\.html$/,
        use: "file-loader"
      },
      {
        test: /\.js$/,
        use: 'raw-loader',
        include: [
          path.resolve("node_modules/iframe-resizer/js/iframeResizer.contentWindow.min.js")
        ]
      }
    ]
  },
  plugins: [new CopyWebpackPlugin([{ from: "**/*.html", context: "static" }])]
};
