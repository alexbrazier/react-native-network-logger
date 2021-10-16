import logger from './loggerSingleton';
import { StartNetworkLoggingOptions } from './types';

export { default } from './components/NetworkLogger';

export const startNetworkLogging = (options?: StartNetworkLoggingOptions) => {
  logger.enableXHRInterception(options);
};

export const getRequests = () => logger.getRequests();

export const clearRequests = () => logger.clearRequests();

export { getBackHandler } from './backHandler';

export { ThemeName, Theme } from './theme';
