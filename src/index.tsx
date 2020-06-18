import logger from './loggerSingleton';

export { default as NetworkMonitor } from './NetworkMonitor';

export const startNetworkLogging = () => {
  logger.enableXHRInterception();
};

export const getRequestLogger = () => {
  return logger.getRequests();
};
