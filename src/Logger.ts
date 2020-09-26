import XHRInterceptor from 'react-native/Libraries/Network/XHRInterceptor';
import NetworkRequestInfo from './NetworkRequestInfo';
import { Headers, RequestMethod, StartNetworkLoggingOptions } from './types';
let nextXHRId = 0;

type XHR = {
  _index: number;
  responseHeaders?: Headers;
};

export default class Logger {
  private requests: NetworkRequestInfo[] = [];
  private xhrIdMap: { [key: number]: number } = {};
  private maxRequests: number = 500;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  callback = (requests: any[]) => {};

  setCallback = (callback: any) => {
    this.callback = callback;
  };

  private getRequest = (xhrIndex?: number) => {
    if (xhrIndex === undefined) return undefined;
    const requestIndex = this.requests.length - this.xhrIdMap[xhrIndex] - 1;
    return this.requests[requestIndex];
  };

  private updateRequest = (
    index: number,
    update: Partial<NetworkRequestInfo>
  ) => {
    const networkInfo = this.getRequest(index);
    if (!networkInfo) return;
    Object.assign(networkInfo, update);
  };

  private openCallback = (method: RequestMethod, url: string, xhr: XHR) => {
    xhr._index = nextXHRId++;
    const xhrIndex = this.requests.length;
    this.xhrIdMap[xhr._index] = xhrIndex;

    const newRequest = new NetworkRequestInfo(
      `${nextXHRId}`,
      'XMLHttpRequest',
      method,
      url
    );

    if (this.requests.length >= this.maxRequests) {
      this.requests.pop();
    }

    this.requests.unshift(newRequest);
  };

  private requestHeadersCallback = (
    header: string,
    value: string,
    xhr: XHR
  ) => {
    const networkInfo = this.getRequest(xhr._index);
    if (!networkInfo) return;
    networkInfo.requestHeaders[header] = value;
  };

  private headerReceivedCallback = (
    responseContentType: string,
    responseSize: number,
    responseHeaders: Headers,
    xhr: XHR
  ) => {
    this.updateRequest(xhr._index, {
      responseContentType,
      responseSize,
      responseHeaders: xhr.responseHeaders,
    });
  };

  private sendCallback = (data: string, xhr: XHR) => {
    this.updateRequest(xhr._index, {
      startTime: Date.now(),
      dataSent: data,
    });
    this.callback(this.requests);
  };

  private responseCallback = (
    status: number,
    timeout: number,
    response: string,
    responseURL: string,
    responseType: string,
    xhr: XHR
  ) => {
    this.updateRequest(xhr._index, {
      endTime: Date.now(),
      status,
      timeout,
      response,
      responseURL,
      responseType,
    });
    this.callback(this.requests);
  };

  enableXHRInterception = (options?: StartNetworkLoggingOptions) => {
    if (XHRInterceptor.isInterceptorEnabled()) {
      return;
    }

    if (options?.maxRequests !== undefined) {
      if (typeof options.maxRequests !== 'number' || options.maxRequests < 1) {
        console.warn(
          'react-native-network-logger: maxRequests must be a number greater than 0. The logger has not been started.'
        );
        return;
      }
      this.maxRequests = options.maxRequests;
    }

    XHRInterceptor.setOpenCallback(this.openCallback);
    XHRInterceptor.setRequestHeaderCallback(this.requestHeadersCallback);
    XHRInterceptor.setHeaderReceivedCallback(this.headerReceivedCallback);
    XHRInterceptor.setSendCallback(this.sendCallback);
    XHRInterceptor.setResponseCallback(this.responseCallback);

    XHRInterceptor.enableInterception();
  };

  getRequests = () => {
    return this.requests;
  };

  clearRequests = () => {
    this.requests = [];
    this.callback(this.requests);
  };
}
