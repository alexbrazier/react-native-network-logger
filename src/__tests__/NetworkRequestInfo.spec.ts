import NetworkRequestInfo from '../NetworkRequestInfo';

jest.mock('react-native/Libraries/Blob/FileReader', () => ({}));

describe('getCurlRequest', () => {
  it('should return valid curl request for simple GET request', () => {
    const info = new NetworkRequestInfo(
      'application/json',
      'GET',
      'https://test.com'
    );

    expect(info.curlRequest).toEqual("curl 'https://test.com'");
  });

  it('should return valid curl request for simple GET request with headers', () => {
    const info = new NetworkRequestInfo(
      'application/json',
      'GET',
      'https://test.com'
    );

    info.requestHeaders = {
      'content-type': 'application/json',
      'x-test-id': 'testing',
      'x-another': 'testing',
    };

    expect(info.curlRequest).toEqual(
      "curl -H 'content-type: application/json' -H 'x-test-id: testing' -H 'x-another: testing' 'https://test.com'"
    );
  });

  it('should return valid curl request for a POST request with headers', () => {
    const info = new NetworkRequestInfo(
      'application/json',
      'POST',
      'https://test.com/post'
    );

    info.requestHeaders = {
      'content-type': 'application/json',
    };

    expect(info.curlRequest).toEqual(
      "curl -XPOST -H 'content-type: application/json' 'https://test.com/post'"
    );
  });

  it('should return valid curl request for a POST request with data', () => {
    const info = new NetworkRequestInfo(
      'application/json',
      'POST',
      'https://test.com/post'
    );

    info.requestHeaders = {
      'content-type': 'application/json',
    };

    info.dataSent = JSON.stringify({ test: true, another: 'yes' });

    expect(info.curlRequest).toEqual(
      `curl -XPOST -H 'content-type: application/json' -d '{"test":true,"another":"yes"}' 'https://test.com/post'`
    );
  });

  it('should escape quotes in data', () => {
    const info = new NetworkRequestInfo(
      'application/json',
      'POST',
      'https://test.com/post'
    );

    info.requestHeaders = {
      'content-type': 'application/json',
    };

    info.dataSent = JSON.stringify({
      test: true,
      another: {
        subKeyWithQuotes: "value='quoted'",
      },
    });

    expect(info.curlRequest).toEqual(
      `curl -XPOST -H 'content-type: application/json' -d '{"test":true,"another":{"subKeyWithQuotes":"value=\\'quoted\\'"}}' 'https://test.com/post'`
    );
  });

  it('should return valid curl request for a DELETE request', () => {
    const info = new NetworkRequestInfo(
      'application/json',
      'DELETE',
      'https://test.com'
    );

    expect(info.curlRequest).toEqual("curl -XDELETE 'https://test.com'");
  });
});