import logger from './loggerSingleton';
import { StartNetworkLoggingOptions } from './types';
import createHar from './utils/createHar';

export { default } from './components/NetworkLogger';

export const startNetworkLogging = (options?: StartNetworkLoggingOptions) => {
  logger.enableXHRInterception(options);
};

export const stopNetworkLogging = () => {
  logger.disableXHRInterception();
};

export const getRequests = () => logger.getRequests();

export const clearRequests = () => logger.clearRequests();

export const createHarFile = () => createHar(logger.getRequests());

export { getBackHandler } from './backHandler';

export type { ThemeName, Theme } from './theme';
