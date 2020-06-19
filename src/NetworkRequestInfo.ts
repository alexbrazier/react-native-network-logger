import type { Headers, RequestMethod } from './types';

export default class NetworkRequestInfo {
  type = '';
  url = '';
  method: RequestMethod;
  status: number = -1;
  dataSent = '';
  responseContentType = '';
  responseSize = 0;
  requestHeaders?: Headers;
  responseHeaders?: Headers;
  response = '';
  responseURL = '';
  responseType = '';
  timeout = 0;
  closeReason = '';
  messages = '';
  serverClose = undefined;
  serverError = undefined;
  startTime: number = 0;
  endTime: number = 0;

  constructor(type: string, method: RequestMethod, url: string) {
    this.type = type;
    this.method = method;
    this.url = url;
  }

  get duration() {
    return this.endTime - this.startTime;
  }
}
