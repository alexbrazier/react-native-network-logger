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
  // new location for React Native 0.80+
  const module = require("react-native/src/private/devsupport/devmenu/elementinspector/XHRInterceptor");
  XHRInterceptor = module.default ?? module;
} catch {
  try {
    // new location for React Native 0.79+
    const module = require('react-native/src/private/inspector/XHRInterceptor');
    XHRInterceptor = module.default ?? module;
  } catch {
    try {
      const module = require('react-native/Libraries/Network/XHRInterceptor');
      XHRInterceptor = module.default ?? module;
    } catch {
      throw new Error('XHRInterceptor could not be found in either location');
    }
  }
}

export default XHRInterceptor;
