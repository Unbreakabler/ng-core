// const webpack = require('webpack');
import * as webpack from 'webpack';
import { WebpackHelper } from './helpers';

const helpers = WebpackHelper.getInstance();
/* tslint:disable */
// const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
/* tslint:enable */
import { CheckerPlugin } from 'awesome-typescript-loader';

export const commonConfig = {
  resolve: {
    extensions: [ '.js', '.ts', '.json' ],
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: [
          'awesome-typescript-loader',
          'angular2-template-loader',
        ],
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
        // exclude: [helpers.root('src/index.html')]
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file?name=assets/[name].[hash].[ext]',
      },
      {
        test: /\.css$/,
        loaders: [ 'to-string-loader', 'css-loader' ],
      },

      {
        test: /\.scss$/,
        loaders: [ 'raw-loader', 'sass-loader' ],
      },
    ],
  },

  plugins: [
    new CheckerPlugin(),

    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)src(\\|\/)linker/,
      helpers.root('./src'),
    ),
  ],

  node: {
    global: true,
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false,
  },
};
