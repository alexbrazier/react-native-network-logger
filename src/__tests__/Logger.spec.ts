import XHRInterceptor from 'react-native/Libraries/Network/XHRInterceptor';
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

beforeEach(() => {
  jest.clearAllMocks();
});

describe('enableXHRInterception', () => {
  it('should do nothing if interceptor has already been enabled', () => {
    const logger = new Logger();

    (XHRInterceptor.isInterceptorEnabled as jest.Mock).mockReturnValueOnce(
      true
    );

    expect(logger.enableXHRInterception()).toBeUndefined();
    expect(XHRInterceptor.isInterceptorEnabled).toHaveBeenCalledTimes(1);
    expect(XHRInterceptor.setOpenCallback).toHaveBeenCalledTimes(0);
  });

  it('should update the maxRequests if provided', () => {
    const logger = new Logger();

    logger.enableXHRInterception({ maxRequests: 23 });
    // @ts-ignore
    const maxRequests = logger.maxRequests;

    expect(maxRequests).toBe(23);
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
