export type Headers = { [header: string]: string };

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type StartNetworkLoggingOptions = {
  /**
   * Max number of requests to keep before overwriting
   * @default 500
   */
  maxRequests?: number;
  /** List of hosts to ignore, e.g. `services.test.com` */
  ignoredHosts?: string[];
  /** List of urls to ignore, e.g. `https://services.test.com/test` */
  ignoredUrls?: string[];
  /**
   * List of url patterns to ignore, e.g. `/^GET https://test.com\/pages\/.*$/`
   *
   * Url to match with is in the format: `${method} ${url}`, e.g. `GET https://test.com/pages/123`
   */
  ignoredPatterns?: RegExp[];
  /**
   * Force the network logger to start even if another program is using the network interceptor
   * e.g. a dev/debuging program
   */
  forceEnable?: boolean;
};

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
