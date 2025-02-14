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
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: '**/*.html', context: "static" },
      ],
    }),
  ]
};
