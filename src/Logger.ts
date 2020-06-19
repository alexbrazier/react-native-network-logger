import XHRInterceptor from 'react-native/Libraries/Network/XHRInterceptor';
import NetworkRequestInfo from './NetworkRequestInfo';
import type { Headers, RequestMethod } from './types';
let nextXHRId = 0;

type XHR = {
  _index: number;
  responseHeaders?: Headers;
};

export default class Logger {
  private requests: NetworkRequestInfo[] = [];
  private xhrIdMap: { [key: number]: number } = {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  callback = (requests: any[]) => {};

  setCallback(callback: any) {
    this.callback = callback;
  }

  private getRequest(xhrIndex?: number) {
    if (xhrIndex === undefined) return undefined;
    const requestIndex = this.xhrIdMap[xhrIndex];
    return this.requests[requestIndex];
  }

  enableXHRInterception() {
    if (XHRInterceptor.isInterceptorEnabled()) {
      return;
    }
    XHRInterceptor.setOpenCallback(
      (method: RequestMethod, url: string, xhr: XHR) => {
        xhr._index = nextXHRId++;
        const xhrIndex = this.requests.length;
        this.xhrIdMap[xhr._index] = xhrIndex;

        const newRequest = new NetworkRequestInfo(
          'XMLHttpRequest',
          method,
          url
        );

        this.requests.push(newRequest);
      }
    );

    XHRInterceptor.setRequestHeaderCallback(
      (header: string, value: string, xhr: XHR) => {
        const networkInfo = this.getRequest(xhr._index);
        if (!networkInfo) return;
        if (!networkInfo.requestHeaders) {
          networkInfo.requestHeaders = {};
        }
        networkInfo.requestHeaders[header] = value;
      }
    );

    XHRInterceptor.setSendCallback((data: string, xhr: XHR) => {
      const request = this.getRequest(xhr._index);
      if (!request) return;
      request.startTime = Date.now();
      request.dataSent = data;
    });

    XHRInterceptor.setHeaderReceivedCallback(
      (type: string, size: number, responseHeaders: Headers, xhr: XHR) => {
        const networkInfo = this.getRequest(xhr._index);
        if (!networkInfo) return;
        networkInfo.responseContentType = type;
        networkInfo.responseSize = size;
        networkInfo.responseHeaders = xhr.responseHeaders;
      }
    );

    XHRInterceptor.setResponseCallback(
      (
        status: number,
        timeout: number,
        response: string,
        responseURL: string,
        responseType: string,
        xhr: XHR
      ) => {
        const networkInfo = this.getRequest(xhr._index);
        if (!networkInfo) return;
        networkInfo.endTime = Date.now();
        networkInfo.status = status;
        networkInfo.timeout = timeout;
        networkInfo.response = response;
        networkInfo.responseURL = responseURL;
        networkInfo.responseType = responseType;
        this.callback(this.requests);
      }
    );
    XHRInterceptor.enableInterception();
  }

  getRequests() {
    return this.requests;
  }
}
