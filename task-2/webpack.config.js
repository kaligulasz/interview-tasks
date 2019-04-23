const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const sourcePath = path.join(__dirname, './src');
const distPath = path.join(__dirname, './dist');

module.exports = (env = {}) => {
  const isProduction = env.production === true;

  return {
    entry: './src/js/main.js',
    output: {
      path: distPath,
      filename: '[name].js',
      chunkFilename: '[name].chunk.js',
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname, 'src'),
          loader: 'babel-loader',
        },
        {
          test: /\.scss$/,
          use: [
            isProduction
              ? MiniCssExtractPlugin.loader
              : {
                loader: 'style-loader',
              }, {
              loader: 'css-loader',
              options: {
                url: false,
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
        },
      ],
    },

    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
        }),
        new OptimizeCSSAssetsPlugin({}),
      ],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Split vendor code to its own chunk(s)
          vendors: {
            test: /[\\/]node_modules[\\/]/i,
            chunks: 'all',
          },
        },
      },
      // The runtime should be in its own chunk
      runtimeChunk: {
        name: 'runtime',
      },
    },

    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src/index.html'),
        filename: 'index.html',
        inject: 'body',
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
    ],

    devtool: isProduction ? 'hidden-source-map' : 'cheap-module-eval-source-map',

    devServer: {
      host: 'localhost',
      contentBase: sourcePath,
      compress: true,
      port: 8080,
    },
  };
};
