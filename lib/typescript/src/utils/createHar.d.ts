import NetworkRequestInfo from '../NetworkRequestInfo';
/**
 * Minimal HAR config to work in chrome
 */
declare const createHar: (requests: NetworkRequestInfo[]) => Promise<{
    log: {
        version: string;
        creator: {
            name: string;
            version: string;
        };
        pages: never[];
        entries: {
            request: {
                postData?: {
                    text: string;
                } | undefined;
                method: import("../types").RequestMethod;
                url: string;
                headers: {
                    name: string;
                    value: string;
                }[];
                cookies: never[];
                headersSize: number;
                bodySize: number;
            };
            response: {
                status: number;
                statusText: string;
                headers: {
                    name: string;
                    value: string;
                }[];
                cookies: never[];
                content: {
                    size: number;
                    mimeType: string;
                    text: string;
                };
                redirectURL: string;
                headersSize: number;
                bodySize: number;
            };
            startedDateTime: string;
            time: number;
            timings: {
                blocked: number;
                dns: number;
                ssl: number;
                connect: number;
                send: number;
                wait: number;
                receive: number;
                _blocked_queueing: number;
            };
        }[];
    };
}>;
export default createHar;
//# sourceMappingURL=createHar.d.ts.map