import logger from './loggerSingleton';

export { default } from './NetworkLogger';

export const startNetworkLogging = () => {
  logger.enableXHRInterception();
};

export const getRequestLogger = () => {
  return logger.getRequests();
};
