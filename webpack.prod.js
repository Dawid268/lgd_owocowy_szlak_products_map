const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/js/map.ts",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|svg)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // 8kb
          },
        },
      },
      {
        test: /\.ts?$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: false,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "js/map.[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    assetModuleFilename: "assets/[name].[contenthash][ext]",
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: 'Source code repository: https://github.com/Dawid268/lgd_owocowy_szlak_products_map\nBuilt on: ' + new Date().toISOString(),
    }),
    new HtmlWebpackPlugin({
      title: "Mapa Produktów - Owoce Lubelszczyzny",
      template: "src/index.html",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: "css/styles.[contenthash].css",
    }),
    new CopyPlugin({
      patterns: [
        { 
          from: "src/img/1", 
          to: "img/1",
          filter: (resourcePath) => {
            // Only copy data.json, skip other files that are handled by webpack
            return resourcePath.endsWith('data.json');
          }
        },
      ],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
      // ImageMinimizerPlugin disabled due to compatibility issues
      // new ImageMinimizerPlugin({
      //   minimizer: {
      //     implementation: ImageMinimizerPlugin.sharpMinify,
      //     options: {
      //       encodeOptions: {
      //         mozjpeg: { quality: 80 },
      //         webp: { quality: 80 },
      //         avif: { quality: 80 },
      //       },
      //     },
      //   },
      // }),
    ],
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
  performance: {
    hints: "warning",
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};
