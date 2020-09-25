import NetworkRequestInfo from '../NetworkRequestInfo';

const createHarEntry = async (request: NetworkRequestInfo) => {
  return {
    request: {
      method: request.method,
      url: request.url,
      headers: Object.entries(request.requestHeaders).map(([name, value]) => ({
        name,
        value,
      })),
      cookies: [],
      headersSize: -1,
      bodySize: -1,
      // TODO add postData object
    },
    response: {
      status: request.status,
      headers: Object.entries(request.responseHeaders).map(([name, value]) => ({
        name,
        value,
      })),
      cookies: [],
      content: {
        size: request.responseSize || -1,
        // TODO correct type and text/json key
        mimeType: request.responseType,
        text: await request.getResponseBody(),
      },
      redirectURL: '',

      headersSize: -1,
      bodySize: -1,
    },

    startedDateTime: new Date(request.startTime).toISOString(),
    time: request.duration,
    timings: {
      blocked: -1,
      dns: -1,
      ssl: -1,
      connect: -1,
      send: -1,
      wait: -1,
      receive: -1,
      _blocked_queueing: -1,
    },
  };
};

/**
 * Minimal HAR config to work in chrome
 */
const createHar = async (requests: NetworkRequestInfo[]) => {
  const har = {
    log: {
      version: '1.2',
      creator: {
        name: 'react-native-network-logger',
        version: '1.0.0',
      },
      pages: [],
      entries: await Promise.all(requests.map(createHarEntry)),
    },
  };

  return har;
};

export default createHar;
