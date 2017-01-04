import { clientConfig } from './webpack.client.prod';
import { serverConfig } from './webpack.server.prod';
export const config = [
  // Client
  clientConfig,

  // Server
  serverConfig,
];
