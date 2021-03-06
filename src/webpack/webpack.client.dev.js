var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
var path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

//var bizConfig = require(path.join(process.cwd(), 'biz.config.ts'));

module.exports = webpackMerge(commonConfig, {
  target: 'web',

  entry: {
    'root': './biz.client' // TODO: Make this dynamic
  },

  output: {
    path: helpers.root('dist/client'),
    filename: '[name].js'
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('common'),

    new CopyWebpackPlugin([{
      context: 'src',
      from: '**/index.html',
      to: '..'
    }])
  ],

  node: {
    global: true,
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
});
