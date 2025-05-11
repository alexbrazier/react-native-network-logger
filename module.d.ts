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
