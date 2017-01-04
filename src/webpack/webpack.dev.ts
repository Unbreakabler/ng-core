// var webpackMerge = require('webpack-merge');
// var clientConfig = require('./webpack.client.dev.js');
// var serverConfig = require('./webpack.server.dev.js');
import { clientConfig } from './webpack.client.dev';
import { serverConfig } from './webpack.server.dev';
export const config = [
  // Client
  clientConfig,

  // Server
  serverConfig,
];
