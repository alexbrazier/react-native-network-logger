// https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Network/XHRInterceptor.js
declare module 'react-native/Libraries/Network/XHRInterceptor' {
  export function isInterceptorEnabled(): boolean;
  export function setOpenCallback(...props: any): void;
  export function setRequestHeaderCallback(...props: any): void;
  export function setSendCallback(...props: any): void;
  export function setHeaderReceivedCallback(...props: any): void;
  export function setResponseCallback(...props: any): void;
  export function enableInterception(): void;
  export function disableInterception(): void;
}

declare module 'react-native/Libraries/Blob/FileReader' {
  type Events =
    | 'abort'
    | 'error'
    | 'load'
    | 'loadstart'
    | 'loadend'
    | 'progress';
  export default class {
    constructor();

    result: string;
    error: any;

    readAsText(blob: any, encoding: string = 'UTF-8'): boolean;
    addEventListener(name: Events, callback: () => void): boolean;
  }
}
