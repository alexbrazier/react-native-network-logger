"use strict";

import XHRInterceptor from "./XHRInterceptor.js";
import NetworkRequestInfo from "./NetworkRequestInfo.js";
import extractHost from "./utils/extractHost.js";
import { warn } from "./utils/logger.js";
import debounce from "./utils/debounce.js";
import { LOGGER_REFRESH_RATE, LOGGER_MAX_REQUESTS } from "./constant.js";
let nextXHRId = 0;
export default class Logger {
  requests = [];
  pausedRequests = [];
  xhrIdMap = new Map();
  maxRequests = LOGGER_MAX_REQUESTS;
  refreshRate = LOGGER_REFRESH_RATE;
  latestRequestUpdatedAt = 0;
  paused = false;
  enabled = false;
  callback = _ => null;
  isPaused = this.paused;
  setCallback = callback => {
    this.callback = callback;
  };
  debouncedCallback = debounce(() => {
    if (!this.latestRequestUpdatedAt || this.requests.some(r => r.updatedAt > this.latestRequestUpdatedAt)) {
      this.latestRequestUpdatedAt = Date.now();
      // prevent mutation of requests for all subscribers
      this.callback([...this.requests]);
    }
  }, this.refreshRate);
  getRequest = xhrIndex => {
    if (xhrIndex === undefined) return undefined;
    if (!this.xhrIdMap.has(xhrIndex)) return undefined;
    const index = this.xhrIdMap.get(xhrIndex)();
    return (this.paused ? this.pausedRequests : this.requests)[index];
  };
  updateRequest = (index, update) => {
    const networkInfo = this.getRequest(index);
    if (!networkInfo) return;
    networkInfo.update(update);
  };
  openCallback = (method, url, xhr) => {
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
      if (this.ignoredPatterns.some(pattern => pattern.test(`${method} ${url}`))) {
        return;
      }
    }
    xhr._index = nextXHRId++;
    this.xhrIdMap.set(xhr._index, () => {
      return (this.paused ? this.pausedRequests : this.requests).findIndex(r => r.id === `${xhr._index}`);
    });
    const newRequest = new NetworkRequestInfo(`${xhr._index}`, 'XMLHttpRequest', method, url);
    if (this.paused) {
      const logsLength = this.pausedRequests.length + this.requests.length;
      if (logsLength > this.maxRequests) {
        if (this.requests.length > 0) this.requests.pop();else this.pausedRequests.pop();
      }
      this.pausedRequests.push(newRequest);
    } else {
      this.requests.unshift(newRequest);
      if (this.requests.length > this.maxRequests) {
        this.requests.pop();
      }
    }
  };
  requestHeadersCallback = (header, value, xhr) => {
    const networkInfo = this.getRequest(xhr._index);
    if (!networkInfo) return;
    networkInfo.requestHeaders[header] = value;
  };
  headerReceivedCallback = (responseContentType, responseSize, responseHeaders, xhr) => {
    this.updateRequest(xhr._index, {
      responseContentType,
      responseSize,
      responseHeaders: xhr.responseHeaders
    });
  };
  sendCallback = (data, xhr) => {
    this.updateRequest(xhr._index, {
      startTime: Date.now(),
      dataSent: data
    });
    this.debouncedCallback();
  };
  responseCallback = (status, timeout, response, responseURL, responseType, xhr) => {
    this.updateRequest(xhr._index, {
      endTime: Date.now(),
      status,
      timeout,
      response,
      responseURL,
      responseType
    });
    this.debouncedCallback();
  };
  enableXHRInterception = options => {
    if (this.enabled || XHRInterceptor.isInterceptorEnabled() && !options?.forceEnable) {
      if (!this.enabled) {
        warn('network interceptor has not been enabled as another interceptor is already running (e.g. another debugging program). Use option `forceEnable: true` to override this behaviour.');
      }
      return;
    }
    if (options?.maxRequests !== undefined) {
      if (typeof options.maxRequests !== 'number' || options.maxRequests < 1) {
        warn('maxRequests must be a number greater than 0. The logger has not been started.');
        return;
      }
      this.maxRequests = options.maxRequests;
    }
    if (options?.ignoredHosts) {
      if (!Array.isArray(options.ignoredHosts) || typeof options.ignoredHosts[0] !== 'string') {
        warn('ignoredHosts must be an array of strings. The logger has not been started.');
        return;
      }
      this.ignoredHosts = new Set(options.ignoredHosts);
    }
    if (options?.refreshRate) {
      if (typeof options.refreshRate !== 'number' || options.refreshRate < 1) {
        warn('refreshRate must be a number greater than 0. The logger has not been started.');
        return;
      }
      this.refreshRate = options.refreshRate;
    }
    if (options?.ignoredPatterns) {
      this.ignoredPatterns = options.ignoredPatterns;
    }
    if (options?.ignoredUrls) {
      if (!Array.isArray(options.ignoredUrls) || typeof options.ignoredUrls[0] !== 'string') {
        warn('ignoredUrls must be an array of strings. The logger has not been started.');
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
    this.pausedRequests = [];
    this.latestRequestUpdatedAt = 0;
    this.debouncedCallback();
  };
  onPausedChange = paused => {
    if (!paused) {
      this.pausedRequests.forEach(request => {
        this.requests.unshift(request);
        if (this.requests.length > this.maxRequests) {
          this.requests.pop();
        }
      });
      this.pausedRequests = [];
      this.debouncedCallback();
    }
    this.paused = paused;
  };
  disableXHRInterception = () => {
    if (!this.enabled) return;
    this.clearRequests();
    nextXHRId = 0;
    this.enabled = false;
    this.paused = false;
    this.xhrIdMap.clear();
    this.maxRequests = LOGGER_MAX_REQUESTS;
    this.refreshRate = LOGGER_REFRESH_RATE;
    this.ignoredHosts = undefined;
    this.ignoredUrls = undefined;
    this.ignoredPatterns = undefined;
    const noop = () => null;
    // manually reset callbacks even if the XHRInterceptor lib does it for us with 'disableInterception'
    XHRInterceptor.setOpenCallback(noop);
    XHRInterceptor.setRequestHeaderCallback(noop);
    XHRInterceptor.setHeaderReceivedCallback(noop);
    XHRInterceptor.setSendCallback(noop);
    XHRInterceptor.setResponseCallback(noop);
    XHRInterceptor.disableInterception();
  };
}
//# sourceMappingURL=Logger.js.map