type XHRInterceptorModule = {
  isInterceptorEnabled: () => boolean;
  setOpenCallback: (...props: any[]) => void;
  setRequestHeaderCallback: (...props: any[]) => void;
  setSendCallback: (...props: any[]) => void;
  setHeaderReceivedCallback: (...props: any[]) => void;
  setResponseCallback: (...props: any[]) => void;
  enableInterception: () => void;
  disableInterception: () => void;
};

let XHRInterceptor: XHRInterceptorModule;
try {
  // new location for React Native 0.79+
  XHRInterceptor = require('react-native/src/private/inspector/XHRInterceptor');
} catch {
  try {
    XHRInterceptor = require('react-native/Libraries/Network/XHRInterceptor');
  } catch {
    throw new Error('XHRInterceptor could not be found in either location');
  }
}

export default XHRInterceptor;
