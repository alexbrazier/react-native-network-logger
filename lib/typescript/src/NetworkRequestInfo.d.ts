import { Headers, NetworkRequestInfoRow, RequestMethod } from './types';
export default class NetworkRequestInfo {
    id: string;
    type: string;
    url: string;
    method: RequestMethod;
    status: number;
    dataSent: string;
    responseContentType: string;
    responseSize: number;
    requestHeaders: Headers;
    responseHeaders: Headers;
    response: string;
    responseURL: string;
    responseType: string;
    timeout: number;
    closeReason: string;
    messages: string;
    serverClose: undefined;
    serverError: undefined;
    startTime: number;
    endTime: number;
    gqlOperation?: string;
    updatedAt: number;
    constructor(id: string, type: string, method: RequestMethod, url: string);
    get duration(): number;
    get curlRequest(): string;
    update(values: Partial<NetworkRequestInfo>): void;
    private escapeQuotes;
    private parseData;
    private stringifyFormat;
    toRow(): NetworkRequestInfoRow;
    getRequestBody(replaceEscaped?: boolean): string;
    private parseResponseBlob;
    getResponseBody(): Promise<string>;
}
//# sourceMappingURL=NetworkRequestInfo.d.ts.map