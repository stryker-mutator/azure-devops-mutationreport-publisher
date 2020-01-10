const path = require("path");

module.exports = {
  target: "node",  
  entry: "./src/publish.ts",
  resolve: {
    extensions: [".ts"],
    alias: {
      "azure-pipelines-task-lib": path.resolve("node_modules/azure-pipelines-task-lib")
    }
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
          }
      ]
  }
}