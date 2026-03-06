import logger from './loggerSingleton';
import { StartNetworkLoggingOptions } from './types';
import {
  registerNetworkTransport,
  unregisterNetworkTransport,
} from './transportRegistry';

export { default } from './components/NetworkLogger';

export const startNetworkLogging = (options?: StartNetworkLoggingOptions) => {
  logger.enableXHRInterception(options);
};

export const stopNetworkLogging = () => {
  logger.disableXHRInterception();
};

export const getRequests = () => logger.getRequests();

export const clearRequests = () => logger.clearRequests();

export { getBackHandler } from './backHandler';
export { registerNetworkTransport, unregisterNetworkTransport };
export type { NetworkTransportAdapter } from './transportRegistry';

export type { ThemeName, Theme } from './theme';
