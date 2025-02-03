const cfg = require('./config.json');
const path = require('path');

const webpack = require('webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");


const webpackPlugins = {
  development: [
    new BrowserSyncPlugin({
      proxy: cfg.url.loc,
      host: `${cfg.siteName}.loc`,
      cors: true,
      open: 'external',
      notify: false,
      logLevel: "info"
    }),
  ],
  production: [
    new CssMinimizerPlugin(),
    new ImageMinimizerPlugin({

      minimizer: {
        implementation: ImageMinimizerPlugin.imageminMinify,
        filename: (pathData) => {
          const filepath = path.dirname(pathData.filename).split("\\").join("/");
          return `${filepath}/[name][ext]`
        },
        options: {
          plugins: [
            "imagemin-gifsicle",
            "imagemin-mozjpeg",
            "imagemin-pngquant",
          ],
        },
      },
    }),
  ],
  common: [
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({
      filename: `css/styles.css`,
      ignoreOrder: true,
    }),
    new ImageMinimizerPlugin({

      generator: [
        {
          // Apply generator for ?as=webp
          preset: "webp",
          filename: (pathData) => {
            const filepath = path.dirname(pathData.filename).split("\\").join("/");
            return `${filepath}/[name][ext]`
          },
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: ["imagemin-webp"],
          },
        },
      ],
      deleteOriginalAssets: false,
      // loader: false,
    }),

  ]
}

module.exports = (env, argv) => {

  return {

    entry: [path.resolve(__dirname, 'src/index.js')],
    devtool: 'source-map',
    stats: 'errors-warnings',
    resolve: {
      extensions: ['.js', '.jsx']
    },
    output: {
      path: path.resolve(__dirname, `app/wp-content/themes/${cfg.themeName}/assets`),
      filename: 'js/scripts.js',
      clean: true,
      assetModuleFilename: (pathData) => {
        const filepath = path.dirname(pathData.filename).split("/").slice(2).join("/");
        return `${filepath}/[name][ext]`;
      },
    },

    // LOADERS
    module: {
      rules: [

        // IMAGES
        {
          test: /\.(jpe?g|png|gif)$/i,
          type: 'asset/resource',
        },

        // SVG
        {
          test: /\.svg$/,
          use: [
            'babel-loader',
            {
              loader: 'react-svg-loader',
              options: {
                svgo: {
                  plugins: [{ removeViewBox: false }],
                },
              },
            },
          ],
        },

        // FONTS
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },

        // CSS
        {
          test: /\.s?css/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 1,
                modules: {
                  auto: true,
                  localIdentName: "[local]_[hash:base64:5]",
                },
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                postcssOptions: {
                  plugins: [
                    require('autoprefixer'),
                    require('postcss-import')
                  ]
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              }
            }
          ]
        },

        // JS
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
              plugins: ["@babel/plugin-transform-runtime"]
            },
          }
        },

        // GraphQL
        {
          test: /\.gql?$/,
          use: [
            {
              loader: 'webpack-graphql-loader',
              options: {
                minify: true
              }
            }
          ]
        }
      ]
    },

    // PLUGINS
    plugins: [
      ...webpackPlugins[argv.mode],
      ...webpackPlugins.common,
    ],
  }

}