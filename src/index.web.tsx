import { StartNetworkLoggingOptions } from './types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const startNetworkLogging = (options?: StartNetworkLoggingOptions) => {
  console.warn('startNetworkLogging is not implemented on this platform');
};

export const getRequests = () => [];

export const clearRequests = () => {};

export { getBackHandler } from './backHandler';

export { ThemeName } from './theme';

export default () => null;
