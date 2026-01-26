// Type declarations for globals provided by React Native runtime
declare class URL {
  constructor(url: string, base?: string);
  toString(): string;
}

declare class XMLHttpRequest {
  static readonly UNSENT: number;
  static readonly OPENED: number;
  static readonly HEADERS_RECEIVED: number;
  static readonly LOADING: number;
  static readonly DONE: number;

  readonly readyState: number;
  readonly response: any;
  readonly responseText: string;
  responseType: string;
  readonly responseURL: string;
  readonly status: number;
  timeout: number;

  onreadystatechange: ((this: XMLHttpRequest, ev: any) => any) | null;

  open(method: string, url: string | URL, async?: boolean, username?: string | null, password?: string | null): void;
  send(body?: any): void;
  setRequestHeader(header: string, value: string): void;
  getResponseHeader(name: string): string | null;
  getAllResponseHeaders(): string;
  addEventListener(type: string, listener: (this: XMLHttpRequest, ev: any) => any): void;
}

// Callback types use 'any' to match React Native's XHRInterceptor API
// This allows Logger.ts to use its own types (RequestMethod, XHR, etc.)
type OpenCallback = (...args: any[]) => void;
type RequestHeaderCallback = (...args: any[]) => void;
type SendCallback = (...args: any[]) => void;
type HeaderReceivedCallback = (...args: any[]) => void;
type ResponseCallback = (...args: any[]) => void;

// Store original XMLHttpRequest methods
let originalXHROpen: typeof XMLHttpRequest.prototype.open | null = null;
let originalXHRSend: typeof XMLHttpRequest.prototype.send | null = null;
let originalXHRSetRequestHeader: typeof XMLHttpRequest.prototype.setRequestHeader | null =
  null;

// Callbacks
let openCallback: OpenCallback = () => {};
let requestHeaderCallback: RequestHeaderCallback = () => {};
let sendCallback: SendCallback = () => {};
let headerReceivedCallback: HeaderReceivedCallback = () => {};
let responseCallback: ResponseCallback = () => {};

let isInterceptorEnabled = false;

function parseResponseHeaders(headersString: string): Record<string, string> {
  const headers: Record<string, string> = {};
  if (!headersString) return headers;

  const headerLines = headersString.trim().split('\r\n');
  for (const line of headerLines) {
    const index = line.indexOf(':');
    if (index > 0) {
      const key = line.substring(0, index).trim();
      const value = line.substring(index + 1).trim();
      headers[key] = value;
    }
  }
  return headers;
}

function enableInterception(): void {
  if (isInterceptorEnabled) return;

  // Store original methods
  originalXHROpen = XMLHttpRequest.prototype.open;
  originalXHRSend = XMLHttpRequest.prototype.send;
  originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

  // Override open
  XMLHttpRequest.prototype.open = function (
    method: string,
    url: string | URL,
    async: boolean = true,
    username?: string | null,
    password?: string | null
  ): void {
    const xhr = this as any;
    xhr._interception = {
      method,
      url: url.toString(),
    };

    openCallback(method, url.toString(), this);

    return originalXHROpen!.call(
      this,
      method,
      url,
      async,
      username ?? null,
      password ?? null
    );
  };

  // Override setRequestHeader
  XMLHttpRequest.prototype.setRequestHeader = function (
    header: string,
    value: string
  ): void {
    requestHeaderCallback(header, value, this);
    return originalXHRSetRequestHeader!.call(this, header, value);
  };

  // Override send
  XMLHttpRequest.prototype.send = function (body?: any): void {
    const xhr = this as any;

    const dataString = body === null || body === undefined ? '' : String(body);
    sendCallback(dataString, xhr);

    // Use addEventListener which is more reliable than overriding onreadystatechange
    // This works even when handlers are set after send() is called
    this.addEventListener('readystatechange', function () {
      if (this.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
        if (!xhr._interception?.hasCalledHeaderReceived) {
          if (xhr._interception) {
            xhr._interception.hasCalledHeaderReceived = true;
          }
          const contentType = this.getResponseHeader('content-type') || '';
          const contentLength = this.getResponseHeader('content-length');
          const responseSize = contentLength ? parseInt(contentLength, 10) : 0;
          const responseHeaders = parseResponseHeaders(
            this.getAllResponseHeaders()
          );

          // Set responseHeaders on xhr for compatibility with Logger.ts
          xhr.responseHeaders = responseHeaders;

          headerReceivedCallback(contentType, responseSize, responseHeaders, xhr);
        }
      }

      if (this.readyState === XMLHttpRequest.DONE) {
        if (!xhr._interception?.hasCalledResponse) {
          if (xhr._interception) {
            xhr._interception.hasCalledResponse = true;
          }
          let responseData = '';
          if (this.responseType === '' || this.responseType === 'text') {
            responseData = this.responseText || '';
          } else if (this.responseType === 'json' && this.response) {
            try {
              responseData = JSON.stringify(this.response);
            } catch {
              responseData = '[Unable to stringify response]';
            }
          } else if (this.response) {
            responseData = '[Non-text response]';
          }

          responseCallback(
            this.status,
            this.timeout,
            responseData,
            this.responseURL,
            this.responseType,
            xhr
          );
        }
      }
    });

    return originalXHRSend!.call(this, body);
  };

  isInterceptorEnabled = true;
}

function disableInterception(): void {
  if (!isInterceptorEnabled) return;

  // Restore original methods
  if (originalXHROpen) {
    XMLHttpRequest.prototype.open = originalXHROpen;
    originalXHROpen = null;
  }
  if (originalXHRSend) {
    XMLHttpRequest.prototype.send = originalXHRSend;
    originalXHRSend = null;
  }
  if (originalXHRSetRequestHeader) {
    XMLHttpRequest.prototype.setRequestHeader = originalXHRSetRequestHeader;
    originalXHRSetRequestHeader = null;
  }

  // Reset callbacks
  openCallback = () => {};
  requestHeaderCallback = () => {};
  sendCallback = () => {};
  headerReceivedCallback = () => {};
  responseCallback = () => {};

  isInterceptorEnabled = false;
}

const XHRInterceptor = {
  isInterceptorEnabled: () => isInterceptorEnabled,
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
  enableInterception,
  disableInterception,
};

export default XHRInterceptor;
