type OpenCallback = (...args: any[]) => void;
type RequestHeaderCallback = (...args: any[]) => void;
type SendCallback = (...args: any[]) => void;
type HeaderReceivedCallback = (...args: any[]) => void;
type ResponseCallback = (...args: any[]) => void;
declare function enableInterception(): void;
declare function disableInterception(): void;
declare const XHRInterceptor: {
    isInterceptorEnabled: () => boolean;
    setOpenCallback: (callback: OpenCallback) => void;
    setRequestHeaderCallback: (callback: RequestHeaderCallback) => void;
    setSendCallback: (callback: SendCallback) => void;
    setHeaderReceivedCallback: (callback: HeaderReceivedCallback) => void;
    setResponseCallback: (callback: ResponseCallback) => void;
    enableInterception: typeof enableInterception;
    disableInterception: typeof disableInterception;
};
export default XHRInterceptor;
//# sourceMappingURL=XHRInterceptor.d.ts.map