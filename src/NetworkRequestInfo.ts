import BlobFileReader from 'react-native/Libraries/Blob/FileReader';
import type { Headers, RequestMethod } from './types';

export default class NetworkRequestInfo {
  type = '';
  url = '';
  method: RequestMethod;
  status: number = -1;
  dataSent = '';
  responseContentType = '';
  responseSize = 0;
  requestHeaders?: Headers;
  responseHeaders?: Headers;
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

  constructor(type: string, method: RequestMethod, url: string) {
    this.type = type;
    this.method = method;
    this.url = url;
  }

  get duration() {
    return this.endTime - this.startTime;
  }

  private stringifyFormat(data: string) {
    try {
      return JSON.stringify(JSON.parse(data), null, '\t');
    } catch (e) {
      return data;
    }
  }

  getRequestBody() {
    return this.stringifyFormat(this.dataSent);
  }

  private async parseReponseBlob() {
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
      : this.parseReponseBlob());

    return this.stringifyFormat(body);
  }
}
