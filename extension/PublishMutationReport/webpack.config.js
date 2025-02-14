const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  target: "node",  
  entry: "./src/publish.ts",
  resolve: {
    extensions: [".ts", ".js", ".png"],
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
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: './task.json', context: "./" },
        { from: './icon.png', context: "./" },
      ],
    }),
  ]
}
