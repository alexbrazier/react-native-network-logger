import XHRInterceptor from 'react-native/Libraries/Network/XHRInterceptor';
import { warn } from '../utils/logger';
import Logger from '../Logger';

jest.mock('react-native/Libraries/Blob/FileReader', () => ({}));
jest.mock('react-native/Libraries/Network/XHRInterceptor', () => ({
  isInterceptorEnabled: jest.fn(),
  setOpenCallback: jest.fn(),
  setRequestHeaderCallback: jest.fn(),
  setSendCallback: jest.fn(),
  setHeaderReceivedCallback: jest.fn(),
  setResponseCallback: jest.fn(),
  enableInterception: jest.fn(),
}));

jest.mock('../utils/logger', () => ({
  warn: jest.fn(() => {
    throw new Error('Unexpected warning');
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('enableXHRInterception', () => {
  it('should do nothing if interceptor has already been enabled', () => {
    (warn as jest.Mock).mockImplementationOnce(() => {});
    const logger = new Logger();

    (XHRInterceptor.isInterceptorEnabled as jest.Mock).mockReturnValueOnce(
      true
    );

    expect(logger.enableXHRInterception()).toBeUndefined();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(XHRInterceptor.isInterceptorEnabled).toHaveBeenCalledTimes(1);
    expect(XHRInterceptor.setOpenCallback).toHaveBeenCalledTimes(0);
  });

  it('should continue if interceptor has already been enabled but forceEnable is true', () => {
    const logger = new Logger();

    (XHRInterceptor.isInterceptorEnabled as jest.Mock).mockReturnValueOnce(
      true
    );

    expect(logger.enableXHRInterception({ forceEnable: true })).toBeUndefined();
    expect(XHRInterceptor.isInterceptorEnabled).toHaveBeenCalledTimes(1);
    expect(XHRInterceptor.setOpenCallback).toHaveBeenCalledTimes(1);
  });

  it('should update the maxRequests if provided', () => {
    const logger = new Logger();

    logger.enableXHRInterception({ maxRequests: 23 });
    // @ts-ignore
    const maxRequests = logger.maxRequests;

    expect(maxRequests).toBe(23);
  });

  it('should update the ignoredHosts if provided', () => {
    const logger = new Logger();

    logger.enableXHRInterception({ ignoredHosts: ['test.example.com'] });
    // @ts-ignore
    const ignoredHosts = logger.ignoredHosts;

    expect(ignoredHosts).toBeInstanceOf(Set);
    expect(ignoredHosts?.has('test.example.com')).toBeTruthy();
  });

  it('should update the ignoredUrls if provided', () => {
    const logger = new Logger();

    logger.enableXHRInterception({
      ignoredUrls: ['http://test.example.com/test'],
    });
    // @ts-ignore
    const ignoredUrls = logger.ignoredUrls;

    expect(ignoredUrls).toBeInstanceOf(Set);
    expect(ignoredUrls?.has('http://test.example.com/test')).toBeTruthy();
  });

  it('should update the ignoredPatterns if provided', () => {
    const logger = new Logger();

    logger.enableXHRInterception({
      ignoredPatterns: [/^HEAD /],
    });
    // @ts-ignore
    const ignoredPatterns = logger.ignoredPatterns;

    expect(ignoredPatterns).toEqual([/^HEAD /]);
  });

  it('should call setOpenCallback', () => {
    const logger = new Logger();
    logger.enableXHRInterception();

    expect(XHRInterceptor.setOpenCallback).toHaveBeenCalledTimes(1);
    expect(XHRInterceptor.setOpenCallback).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });

  it('should call setRequestHeaderCallback', () => {
    const logger = new Logger();
    logger.enableXHRInterception();

    expect(XHRInterceptor.setRequestHeaderCallback).toHaveBeenCalledTimes(1);
    expect(XHRInterceptor.setRequestHeaderCallback).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });

  it('should call setSendCallback', () => {
    const logger = new Logger();
    logger.enableXHRInterception();

    expect(XHRInterceptor.setSendCallback).toHaveBeenCalledTimes(1);
    expect(XHRInterceptor.setSendCallback).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });

  it('should call setHeaderReceivedCallback', () => {
    const logger = new Logger();
    logger.enableXHRInterception();

    expect(XHRInterceptor.setHeaderReceivedCallback).toHaveBeenCalledTimes(1);
    expect(XHRInterceptor.setHeaderReceivedCallback).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });

  it('should call setResponseCallback', () => {
    const logger = new Logger();
    logger.enableXHRInterception();

    expect(XHRInterceptor.setResponseCallback).toHaveBeenCalledTimes(1);
    expect(XHRInterceptor.setResponseCallback).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });

  it('should call enableInterception', () => {
    const logger = new Logger();
    logger.enableXHRInterception();

    expect(XHRInterceptor.enableInterception).toHaveBeenCalledTimes(1);
    expect(XHRInterceptor.enableInterception).toHaveBeenCalledWith();
  });
});

describe('getRequests', () => {
  it('should return the requests', () => {
    const logger = new Logger();

    // @ts-ignore
    logger.requests = ['test-request'];

    expect(logger.getRequests()).toEqual(['test-request']);
  });
});

describe('clearRequests', () => {
  it('should clear the requests', () => {
    const logger = new Logger();

    logger.callback = jest.fn();

    // @ts-ignore
    logger.requests = ['test-request'];

    logger.clearRequests();

    expect(logger.getRequests()).toEqual([]);
    expect(logger.callback).toHaveBeenCalledTimes(1);
    expect(logger.callback).toHaveBeenCalledWith([]);
  });
});

// Private methods

describe('getRequest', () => {
  it('should return undefined if missing index', () => {
    const logger = new Logger();
    // @ts-expect-error
    const result = logger.getRequest();
    expect(result).toBeUndefined();
  });

  it('should return request that matches index', () => {
    const logger = new Logger();
    const requests = [{ id: 1 }, { id: 2 }, { id: 3 }];
    // @ts-expect-error
    logger.requests = requests;
    // @ts-expect-error
    logger.xhrIdMap = { 0: 0, 1: 1, 2: 2 };
    // @ts-expect-error
    const result = logger.getRequest(0);
    expect(result).toBe(requests[2]);
  });

  it('should return request that matches index if at start', () => {
    const logger = new Logger();
    const requests = [{ id: 1 }, { id: 2 }, { id: 3 }];
    // @ts-expect-error
    logger.requests = requests;
    // @ts-expect-error
    logger.xhrIdMap = { 0: 0, 1: 1, 2: 2 };
    // @ts-expect-error
    const result = logger.getRequest(2);
    expect(result).toBe(requests[0]);
  });
});

describe('openCallback', () => {
  it('should add new request to start of requests list', () => {
    const logger = new Logger();
    logger.enableXHRInterception();

    const xhr = {};
    const url1 = 'http://example.com/1';
    const url2 = 'http://example.com/2';

    // @ts-expect-error
    logger.openCallback('POST', url1, xhr);
    // @ts-expect-error
    logger.openCallback('POST', url2, xhr);
    expect(logger.getRequests()[0].url).toEqual(url2);
    expect(logger.getRequests()[1].url).toEqual(url1);
  });

  it('should ignore requests that have ignored hosts', () => {
    const logger = new Logger();
    logger.enableXHRInterception({ ignoredHosts: ['ignored.com'] });

    const xhr = {};
    const url1 = 'http://example.com/2';
    const url2 = 'http://ignored.com/1';

    // @ts-expect-error
    logger.openCallback('POST', url1, xhr);
    // @ts-expect-error
    logger.openCallback('POST', url2, xhr);
    expect(logger.getRequests()[0].url).toEqual(url1);
    expect(logger.getRequests()).toHaveLength(1);
  });

  it('should ignore requests that have ignored urls', () => {
    const logger = new Logger();
    logger.enableXHRInterception({ ignoredUrls: ['http://ignored.com/test'] });

    const xhr = {};
    const url1 = 'http://ignored.com/1';
    const url2 = 'http://ignored.com/test';

    // @ts-expect-error
    logger.openCallback('POST', url1, xhr);
    // @ts-expect-error
    logger.openCallback('POST', url2, xhr);
    expect(logger.getRequests()[0].url).toEqual(url1);
    expect(logger.getRequests()).toHaveLength(1);
  });

  it('should ignore requests that match pattern', () => {
    const logger = new Logger();
    logger.enableXHRInterception({
      ignoredPatterns: [/^HEAD /, /^POST http:\/\/ignored/],
    });

    const xhr = {};
    const url1 = 'http://allowed.com/1';
    const url2 = 'http://ignored.com/test';

    // @ts-expect-error
    logger.openCallback('POST', url1, xhr);
    // @ts-expect-error
    logger.openCallback('POST', url2, xhr);
    // @ts-expect-error
    logger.openCallback('HEAD', url2, xhr);
    // @ts-expect-error
    logger.openCallback('PUT', url2, xhr);
    // Requests should be in reverse order
    expect(logger.getRequests()[1].url).toEqual(url1);
    expect(logger.getRequests()[1].method).toEqual('POST');
    expect(logger.getRequests()[0].url).toEqual(url2);
    expect(logger.getRequests()[0].method).toEqual('PUT');
    expect(logger.getRequests()).toHaveLength(2);
  });
});
