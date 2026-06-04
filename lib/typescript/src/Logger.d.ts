import NetworkRequestInfo from './NetworkRequestInfo';
import { StartNetworkLoggingOptions } from './types';
export default class Logger {
    private requests;
    private pausedRequests;
    private xhrIdMap;
    private maxRequests;
    private refreshRate;
    private latestRequestUpdatedAt;
    private ignoredHosts;
    private ignoredUrls;
    private ignoredPatterns;
    private paused;
    enabled: boolean;
    callback: (_: NetworkRequestInfo[]) => null;
    isPaused: boolean;
    setCallback: (callback: any) => void;
    debouncedCallback: () => void;
    private getRequest;
    private updateRequest;
    private openCallback;
    private requestHeadersCallback;
    private headerReceivedCallback;
    private sendCallback;
    private responseCallback;
    enableXHRInterception: (options?: StartNetworkLoggingOptions) => void;
    getRequests: () => NetworkRequestInfo[];
    clearRequests: () => void;
    onPausedChange: (paused: boolean) => void;
    disableXHRInterception: () => void;
}
//# sourceMappingURL=Logger.d.ts.map