"use strict";

// Type declarations for globals provided by React Native runtime

// Callback types use 'any' to match React Native's XHRInterceptor API
// This allows Logger.ts to use its own types (RequestMethod, XHR, etc.)

// Store original XMLHttpRequest methods
let originalXHROpen = null;
let originalXHRSend = null;
let originalXHRSetRequestHeader = null;

// Callbacks
let openCallback = () => {};
let requestHeaderCallback = () => {};
let sendCallback = () => {};
let headerReceivedCallback = () => {};
let responseCallback = () => {};
let isInterceptorEnabled = false;
function parseResponseHeaders(headersString) {
  const headers = {};
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
function enableInterception() {
  if (isInterceptorEnabled) return;

  // Store original methods
  originalXHROpen = XMLHttpRequest.prototype.open;
  originalXHRSend = XMLHttpRequest.prototype.send;
  originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

  // Override open
  XMLHttpRequest.prototype.open = function (method, url, async = true, username, password) {
    const xhr = this;
    xhr._interception = {
      method,
      url: url.toString()
    };
    try {
      openCallback(method, url.toString(), this);
    } catch {
      // Interceptor callbacks must not break network requests.
    }
    return originalXHROpen.call(this, method, url, async, username ?? null, password ?? null);
  };

  // Override setRequestHeader
  XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
    try {
      requestHeaderCallback(header, value, this);
    } catch {
      // Interceptor callbacks must not break network requests.
    }
    return originalXHRSetRequestHeader.call(this, header, value);
  };

  // Override send
  XMLHttpRequest.prototype.send = function (body) {
    const xhr = this;
    const dataString = body === null || body === undefined ? '' : String(body);
    try {
      sendCallback(dataString, xhr);
    } catch {
      // Interceptor callbacks must not break network requests.
    }

    // Use addEventListener which is more reliable than overriding onreadystatechange
    // This works even when handlers are set after send() is called
    if (typeof this.addEventListener === 'function') {
      this.addEventListener('readystatechange', function () {
        if (this.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
          if (!xhr._interception?.hasCalledHeaderReceived) {
            if (xhr._interception) {
              xhr._interception.hasCalledHeaderReceived = true;
            }
            const contentType = this.getResponseHeader('content-type') || '';
            const contentLength = this.getResponseHeader('content-length');
            const responseSize = contentLength ? parseInt(contentLength, 10) : 0;
            const responseHeaders = parseResponseHeaders(this.getAllResponseHeaders());

            // Set responseHeaders on xhr for compatibility with Logger.ts
            xhr.responseHeaders = responseHeaders;
            try {
              headerReceivedCallback(contentType, responseSize, responseHeaders, xhr);
            } catch {
              // Interceptor callbacks must not break network requests.
            }
          }
        }
        if (this.readyState === XMLHttpRequest.DONE) {
          if (!xhr._interception?.hasCalledResponse) {
            if (xhr._interception) {
              xhr._interception.hasCalledResponse = true;
            }
            let responseData = this.response;
            if (this.responseType === '' || this.responseType === 'text') {
              responseData = this.responseText || '';
            } else if (this.responseType === 'json' && this.response) {
              try {
                responseData = JSON.stringify(this.response);
              } catch {
                responseData = '[Unable to stringify response]';
              }
            }
            try {
              responseCallback(this.status, this.timeout, responseData, this.responseURL, this.responseType, xhr);
            } catch {
              // Interceptor callbacks must not break network requests.
            }
          }
        }
      });
    }
    return originalXHRSend.call(this, body);
  };
  isInterceptorEnabled = true;
}
function disableInterception() {
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
  setOpenCallback: callback => {
    openCallback = callback;
  },
  setRequestHeaderCallback: callback => {
    requestHeaderCallback = callback;
  },
  setSendCallback: callback => {
    sendCallback = callback;
  },
  setHeaderReceivedCallback: callback => {
    headerReceivedCallback = callback;
  },
  setResponseCallback: callback => {
    responseCallback = callback;
  },
  enableInterception,
  disableInterception
};
export default XHRInterceptor;
//# sourceMappingURL=XHRInterceptor.js.map