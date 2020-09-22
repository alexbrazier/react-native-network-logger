import BlobFileReader from 'react-native/Libraries/Blob/FileReader';
import { Headers, RequestMethod } from './types';
import fromEntries from './utils/fromEntries';

export default class NetworkRequestInfo {
  id = '';
  type = '';
  url = '';
  method: RequestMethod;
  status: number = -1;
  dataSent = '';
  responseContentType = '';
  responseSize = 0;
  requestHeaders: Headers = {};
  responseHeaders: Headers = {};
  response = '';
  responseURL = '';
  responseType = '';
  timeout = 0;
  closeReason = '';
  messages = '';
  serverClose = undefined;
  serverError = undefined;
  startTime: number = 0;
  endTime: number = 0;

  constructor(id: string, type: string, method: RequestMethod, url: string) {
    this.id = id;
    this.type = type;
    this.method = method;
    this.url = url;
  }

  get duration() {
    return this.endTime - this.startTime;
  }

  get curlRequest() {
    let headersPart =
      this.requestHeaders &&
      Object.entries(this.requestHeaders)
        .map(([key, value]) => `'${key}: ${this.escapeQuotes(value)}'`)
        .join(' -H ');
    headersPart = headersPart ? `-H ${headersPart}` : '';

    const body = this.dataSent && this.escapeQuotes(this.dataSent);

    const methodPart =
      this.method !== 'GET' ? `-X${this.method.toUpperCase()}` : '';
    const bodyPart = body ? `-d '${body}'` : '';

    const parts = ['curl', methodPart, headersPart, bodyPart, `'${this.url}'`];

    return parts.filter(Boolean).join(' ');
  }

  private escapeQuotes(value: string) {
    return value.replace?.(/'/g, `\\'`);
  }

  private stringifyFormat(data: any) {
    try {
      if (data?._parts?.length) {
        return JSON.stringify(fromEntries(data?._parts), null, 2);
      }
      return JSON.stringify(JSON.parse(data), null, 2);
    } catch (e) {
      return `${data}`;
    }
  }

  getRequestBody() {
    return this.stringifyFormat(this.dataSent);
  }

  private async parseResponseBlob() {
    const blobReader = new BlobFileReader();
    blobReader.readAsText(this.response);

    return await new Promise<string>((resolve, reject) => {
      const handleError = () => reject(blobReader.error);

      blobReader.addEventListener('load', () => {
        resolve(blobReader.result);
      });
      blobReader.addEventListener('error', handleError);
      blobReader.addEventListener('abort', handleError);
    });
  }

  async getResponseBody() {
    const body = await (this.responseType !== 'blob'
      ? this.response
      : this.parseResponseBlob());

    return this.stringifyFormat(body);
  }
}
