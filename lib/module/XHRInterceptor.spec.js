"use strict";

export {};
class FakeXMLHttpRequest {
  static UNSENT = 0;
  static OPENED = 1;
  static HEADERS_RECEIVED = 2;
  static LOADING = 3;
  static DONE = 4;
  readyState = FakeXMLHttpRequest.UNSENT;
  response = '';
  responseText = '';
  responseType = '';
  responseURL = '';
  status = 0;
  timeout = 0;
  onreadystatechange = null;
  openCalled = false;
  sendCalled = false;
  setRequestHeaderCalled = false;
  listeners = {};
  responseHeaders = {};
  open(_method, _url, _async, _username, _password) {
    this.openCalled = true;
  }
  send(_data) {
    this.sendCalled = true;
  }
  setRequestHeader(_header, _value) {
    this.setRequestHeaderCalled = true;
  }
  getResponseHeader(name) {
    return this.responseHeaders[name.toLowerCase()] || null;
  }
  getAllResponseHeaders() {
    return Object.entries(this.responseHeaders).map(([name, value]) => `${name}: ${value}`).join('\r\n');
  }
  addEventListener(type, listener) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(listener.bind(this));
  }
  setResponseHeaders(headers) {
    this.responseHeaders = headers;
  }
  emitReadyState(state) {
    this.readyState = state;
    (this.listeners.readystatechange || []).forEach(listener => listener());
  }
}
const loadInterceptor = () => {
  jest.resetModules();
  return require('./XHRInterceptor').default;
};
describe('XHRInterceptor', () => {
  beforeEach(() => {
    global.XMLHttpRequest = FakeXMLHttpRequest;
  });
  it('does not block XHR methods when interceptor callbacks throw', () => {
    const interceptor = loadInterceptor();
    interceptor.setOpenCallback(() => {
      throw new Error('open failed');
    });
    interceptor.setRequestHeaderCallback(() => {
      throw new Error('header failed');
    });
    interceptor.setSendCallback(() => {
      throw new Error('send failed');
    });
    interceptor.enableInterception();
    const xhr = new FakeXMLHttpRequest();
    expect(() => xhr.open('GET', 'https://example.com')).not.toThrow();
    expect(() => xhr.setRequestHeader('x-test', '1')).not.toThrow();
    expect(() => xhr.send('data')).not.toThrow();
    expect(xhr.openCalled).toBe(true);
    expect(xhr.setRequestHeaderCalled).toBe(true);
    expect(xhr.sendCalled).toBe(true);
    interceptor.disableInterception();
  });
  it('does not require addEventListener to exist', () => {
    const interceptor = loadInterceptor();
    interceptor.enableInterception();
    const xhr = new FakeXMLHttpRequest();
    xhr.addEventListener = undefined;
    expect(() => xhr.open('GET', 'https://example.com')).not.toThrow();
    expect(() => xhr.send()).not.toThrow();
    expect(xhr.sendCalled).toBe(true);
    interceptor.disableInterception();
  });
  it('passes non-text response objects through callback for blob responses', () => {
    const interceptor = loadInterceptor();
    const responseCallback = jest.fn();
    interceptor.setResponseCallback(responseCallback);
    interceptor.enableInterception();
    const xhr = new FakeXMLHttpRequest();
    const responseBlob = {
      _data: 'blob'
    };
    xhr.responseType = 'blob';
    xhr.response = responseBlob;
    xhr.status = 200;
    xhr.timeout = 123;
    xhr.responseURL = 'https://example.com';
    xhr.open('GET', 'https://example.com');
    xhr.send();
    xhr.emitReadyState(FakeXMLHttpRequest.DONE);
    expect(responseCallback).toHaveBeenCalledTimes(1);
    expect(responseCallback.mock.calls[0][2]).toBe(responseBlob);
    interceptor.disableInterception();
  });
  it('invokes header and response callbacks once each', () => {
    const interceptor = loadInterceptor();
    const headerReceivedCallback = jest.fn();
    const responseCallback = jest.fn();
    interceptor.setHeaderReceivedCallback(headerReceivedCallback);
    interceptor.setResponseCallback(responseCallback);
    interceptor.enableInterception();
    const xhr = new FakeXMLHttpRequest();
    xhr.setResponseHeaders({
      'content-type': 'application/json; charset=utf-8',
      'content-length': '42'
    });
    xhr.responseType = 'text';
    xhr.responseText = '{"ok":true}';
    xhr.open('GET', 'https://example.com');
    xhr.send();
    xhr.emitReadyState(FakeXMLHttpRequest.HEADERS_RECEIVED);
    xhr.emitReadyState(FakeXMLHttpRequest.HEADERS_RECEIVED);
    xhr.emitReadyState(FakeXMLHttpRequest.DONE);
    xhr.emitReadyState(FakeXMLHttpRequest.DONE);
    expect(headerReceivedCallback).toHaveBeenCalledTimes(1);
    expect(responseCallback).toHaveBeenCalledTimes(1);
    interceptor.disableInterception();
  });
});
//# sourceMappingURL=XHRInterceptor.spec.js.map