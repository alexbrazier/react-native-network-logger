import {
  registerNetworkTransport,
  unregisterNetworkTransport,
} from 'react-native-network-logger';
import {
  isNativeTransportSupported,
  makeNativeTestRequest,
  nativeNetworkLoggerTransport,
} from './NativeTransport';

export const NATIVE_TRANSPORT_NAME = 'native';

export const registerNativeNetworkLoggerTransport = (
  name: string = NATIVE_TRANSPORT_NAME
) => {
  if (!isNativeTransportSupported()) {
    return false;
  }
  registerNetworkTransport(name, nativeNetworkLoggerTransport);
  return true;
};

export const unregisterNativeNetworkLoggerTransport = (
  name: string = NATIVE_TRANSPORT_NAME
) => {
  unregisterNetworkTransport(name);
};

export {
  isNativeTransportSupported,
  makeNativeTestRequest,
  nativeNetworkLoggerTransport,
};
