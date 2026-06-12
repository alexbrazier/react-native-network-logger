import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
import type { NetworkTransportAdapter } from 'react-native-network-logger';

type OpenCallback = (...args: any[]) => void;
type RequestHeaderCallback = (...args: any[]) => void;
type SendCallback = (...args: any[]) => void;
type HeaderReceivedCallback = (...args: any[]) => void;
type ResponseCallback = (...args: any[]) => void;

type NativeRequestOpenEvent = {
  id: string;
  method: string;
  url: string;
};

type NativeRequestHeaderEvent = {
  id: string;
  header: string;
  value: string;
};

type NativeRequestSendEvent = {
  id: string;
  body?: string;
};

type NativeResponseHeadersEvent = {
  id: string;
  contentType?: string;
  responseSize?: number;
  responseHeaders?: Record<string, string>;
};

type NativeResponseEvent = {
  id: string;
  status?: number;
  timeout?: number;
  response?: string;
  responseURL?: string;
  responseType?: string;
};

type NativeNetworkModule = {
  start?: () => void;
  stop?: () => void;
  makeNativeTestRequest?: (url: string) => void;
};

const moduleName = 'RNNetworkLoggerNativeTransport';
const nativeModule = NativeModules[moduleName] as
  | NativeNetworkModule
  | undefined;

let openCallback: OpenCallback = () => {};
let requestHeaderCallback: RequestHeaderCallback = () => {};
let sendCallback: SendCallback = () => {};
let headerReceivedCallback: HeaderReceivedCallback = () => {};
let responseCallback: ResponseCallback = () => {};

let isEnabled = false;
let sequence = 0;
const xhrByRequestId = new Map<
  string,
  {
    _index: number;
    responseHeaders?: Record<string, string>;
  }
>();
let subscriptions: EmitterSubscription[] = [];

const getXHR = (requestId: string) => {
  let xhr = xhrByRequestId.get(requestId);
  if (!xhr) {
    xhr = { _index: sequence++ };
    xhrByRequestId.set(requestId, xhr);
  }
  return xhr;
};

const addSubscriptions = () => {
  if (!nativeModule) return;

  const emitter = new NativeEventEmitter(nativeModule as any);
  subscriptions = [
    emitter.addListener(
      'networkLoggerRequestOpen',
      ({ id, method, url }: NativeRequestOpenEvent) => {
        const xhr = getXHR(id);
        openCallback(method, url, xhr);
      }
    ),
    emitter.addListener(
      'networkLoggerRequestHeader',
      ({ id, header, value }: NativeRequestHeaderEvent) => {
        const xhr = getXHR(id);
        requestHeaderCallback(header, value, xhr);
      }
    ),
    emitter.addListener(
      'networkLoggerRequestSend',
      ({ id, body }: NativeRequestSendEvent) => {
        const xhr = getXHR(id);
        sendCallback(body || '', xhr);
      }
    ),
    emitter.addListener(
      'networkLoggerResponseHeaders',
      ({
        id,
        contentType = '',
        responseSize = 0,
        responseHeaders = {},
      }: NativeResponseHeadersEvent) => {
        const xhr = getXHR(id);
        xhr.responseHeaders = responseHeaders;
        headerReceivedCallback(contentType, responseSize, responseHeaders, xhr);
      }
    ),
    emitter.addListener(
      'networkLoggerResponse',
      ({
        id,
        status = 0,
        timeout = 0,
        response = '',
        responseURL = '',
        responseType = '',
      }: NativeResponseEvent) => {
        const xhr = getXHR(id);
        responseCallback(
          status,
          timeout,
          response,
          responseURL,
          responseType,
          xhr
        );
        xhrByRequestId.delete(id);
      }
    ),
  ];
};

const removeSubscriptions = () => {
  subscriptions.forEach((subscription) => subscription.remove());
  subscriptions = [];
};

export const nativeNetworkLoggerTransport: NetworkTransportAdapter = {
  isInterceptorEnabled: () => isEnabled,
  setOpenCallback: (callback: OpenCallback) => {
    openCallback = callback;
  },
  setRequestHeaderCallback: (callback: RequestHeaderCallback) => {
    requestHeaderCallback = callback;
  },
  setSendCallback: (callback: SendCallback) => {
    sendCallback = callback;
  },
  setHeaderReceivedCallback: (callback: HeaderReceivedCallback) => {
    headerReceivedCallback = callback;
  },
  setResponseCallback: (callback: ResponseCallback) => {
    responseCallback = callback;
  },
  enableInterception: () => {
    if (isEnabled) return;
    if (!nativeModule?.start) return;
    addSubscriptions();
    nativeModule.start();
    isEnabled = true;
  },
  disableInterception: () => {
    if (!isEnabled) return;
    removeSubscriptions();
    xhrByRequestId.clear();
    sequence = 0;
    openCallback = () => {};
    requestHeaderCallback = () => {};
    sendCallback = () => {};
    headerReceivedCallback = () => {};
    responseCallback = () => {};
    nativeModule?.stop?.();
    isEnabled = false;
  },
};

export const isNativeTransportSupported = () => {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return false;
  }
  return !!nativeModule?.start;
};

export const makeNativeTestRequest = (url: string) => {
  nativeModule?.makeNativeTestRequest?.(url);
};
