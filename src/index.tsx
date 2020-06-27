import logger from './loggerSingleton';

export { default } from './components/NetworkLogger';

export const startNetworkLogging = () => {
  logger.enableXHRInterception();
};

export const getRequestLogger = () => {
  return logger.getRequests();
};

export type { ThemeName } from './theme';
