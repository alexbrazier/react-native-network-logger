declare module 'react-native/Libraries/Network/XHRInterceptor' {
  export function isInterceptorEnabled(): boolean;
  export function setOpenCallback(...props: any): void;
  export function setRequestHeaderCallback(...props: any): void;
  export function setSendCallback(...props: any): void;
  export function setHeaderReceivedCallback(...props: any): void;
  export function setResponseCallback(...props: any): void;
  export function enableInterception(): void;
}
