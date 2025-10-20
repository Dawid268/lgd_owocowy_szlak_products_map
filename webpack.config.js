const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = {
  entry: {
    map: './src/js/ts/map.ts',
    admin: './src/admin/ts/admin.ts',
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png)$/i,
        type: "asset",
      },
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "./js/[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    new webpack.AutomaticPrefetchPlugin(),
    new webpack.BannerPlugin({
      banner: 'Source code repository: https://github.com/Dawid268/lgd_owocowy_szlak_products_map',
    }),
    new HtmlWebpackPlugin({
      title: "leaflet-map",
      template: "src/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "img/1/map-style.css",
    }),
    new CopyPlugin({
      patterns: [
        { 
          from: "src/img/1", 
          to: "img/1",
          filter: (resourcePath) => {
            // Copy all files from src/img/1 directory
            return true;
          }
        },
      ],
    }),
  ],
  optimization: {
    // ImageMinimizerPlugin disabled due to missing dependency
    // minimizer: [
    //   new ImageMinimizerPlugin({
    //     minimizer: {
    //       implementation: ImageMinimizerPlugin.squooshMinify,
    //       options: {
    //         encodeOptions: {
    //           mozjpeg: { quality: 10 },
    //           webp: { lossless: 1 },
    //           avif: { cqLevel: 0 },
    //         },
    //       },
    //     },
    //   }),
    // ],
  },
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 4000,
  },
};
