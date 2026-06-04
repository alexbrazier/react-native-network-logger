"use strict";

import logger from "./loggerSingleton.js";
export { default } from "./components/NetworkLogger.js";
export const startNetworkLogging = options => {
  logger.enableXHRInterception(options);
};
export const stopNetworkLogging = () => {
  logger.disableXHRInterception();
};
export const getRequests = () => logger.getRequests();
export const clearRequests = () => logger.clearRequests();
export { getBackHandler } from "./backHandler.js";
//# sourceMappingURL=index.js.map