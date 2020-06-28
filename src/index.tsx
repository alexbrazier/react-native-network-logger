import logger from './loggerSingleton';
import type { StartNetworkLoggingOptions } from './types';

export { default } from './components/NetworkLogger';

export const startNetworkLogging = (options?: StartNetworkLoggingOptions) => {
  logger.enableXHRInterception(options);
};

export const getRequests = () => logger.getRequests();

export const clearRequests = () => logger.clearRequests();

export type { ThemeName } from './theme';
