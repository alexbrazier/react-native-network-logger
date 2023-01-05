import XHRInterceptor from 'react-native/Libraries/Network/XHRInterceptor';
import NetworkRequestInfo from './NetworkRequestInfo';
import { Headers, RequestMethod, StartNetworkLoggingOptions } from './types';
import extractHost from './utils/extractHost';
import { warn } from './utils/logger';

let nextXHRId = 0;

type XHR = {
  _index: number;
  responseHeaders?: Headers;
};

export default class Logger {
  private requests: NetworkRequestInfo[] = [];
  private xhrIdMap: { [key: number]: number } = {};
  private maxRequests: number = 500;
  private ignoredHosts: Set<string> | undefined;
  private ignoredUrls: Set<string> | undefined;
  private ignoredPatterns: RegExp[] | undefined;
  public enabled = false;

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
    networkInfo.update(update);
  };

  private openCallback = (method: RequestMethod, url: string, xhr: XHR) => {
    xhr._index = nextXHRId++;
    const xhrIndex = this.requests.length;
    this.xhrIdMap[xhr._index] = xhrIndex;

    if (this.ignoredHosts) {
      const host = extractHost(url);
      if (host && this.ignoredHosts.has(host)) {
        return;
      }
    }

    if (this.ignoredUrls && this.ignoredUrls.has(url)) {
      return;
    }

    if (this.ignoredPatterns) {
      if (
        this.ignoredPatterns.some((pattern) => pattern.test(`${method} ${url}`))
      ) {
        return;
      }
    }

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
    if (
      this.enabled ||
      (XHRInterceptor.isInterceptorEnabled() && !options?.forceEnable)
    ) {
      if (!this.enabled) {
        warn(
          'network interceptor has not been enabled as another interceptor is already running (e.g. another debugging program). Use option `forceEnable: true` to override this behaviour.'
        );
      }
      return;
    }

    if (options?.maxRequests !== undefined) {
      if (typeof options.maxRequests !== 'number' || options.maxRequests < 1) {
        warn(
          'maxRequests must be a number greater than 0. The logger has not been started.'
        );
        return;
      }
      this.maxRequests = options.maxRequests;
    }

    if (options?.ignoredHosts) {
      if (
        !Array.isArray(options.ignoredHosts) ||
        typeof options.ignoredHosts[0] !== 'string'
      ) {
        warn(
          'ignoredHosts must be an array of strings. The logger has not been started.'
        );
        return;
      }
      this.ignoredHosts = new Set(options.ignoredHosts);
    }

    if (options?.ignoredPatterns) {
      this.ignoredPatterns = options.ignoredPatterns;
    }

    if (options?.ignoredUrls) {
      if (
        !Array.isArray(options.ignoredUrls) ||
        typeof options.ignoredUrls[0] !== 'string'
      ) {
        warn(
          'ignoredUrls must be an array of strings. The logger has not been started.'
        );
        return;
      }
      this.ignoredUrls = new Set(options.ignoredUrls);
    }

    XHRInterceptor.setOpenCallback(this.openCallback);
    XHRInterceptor.setRequestHeaderCallback(this.requestHeadersCallback);
    XHRInterceptor.setHeaderReceivedCallback(this.headerReceivedCallback);
    XHRInterceptor.setSendCallback(this.sendCallback);
    XHRInterceptor.setResponseCallback(this.responseCallback);

    XHRInterceptor.enableInterception();
    this.enabled = true;
  };

  getRequests = () => {
    return this.requests;
  };

  clearRequests = () => {
    this.requests = [];
    this.callback(this.requests);
  };
}
