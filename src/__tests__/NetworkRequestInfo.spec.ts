import NetworkRequestInfo from '../NetworkRequestInfo';

jest.mock('react-native/Libraries/Blob/FileReader', () => ({}));

describe('getCurlRequest', () => {
  it('should return valid curl request for simple GET request', () => {
    const info = new NetworkRequestInfo(
      '1',
      'application/json',
      'GET',
      'https://test.com'
    );

    expect(info.curlRequest).toEqual("curl 'https://test.com'");
  });

  it('should return valid curl request for simple GET request with headers', () => {
    const info = new NetworkRequestInfo(
      '1',
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
      '1',
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
      '1',
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
      '1',
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
      '1',
      'application/json',
      'DELETE',
      'https://test.com'
    );

    expect(info.curlRequest).toEqual("curl -XDELETE 'https://test.com'");
  });
});

describe('getRequestBody', () => {
  const info = new NetworkRequestInfo(
    '1',
    'application/json',
    'GET',
    'https://test.com'
  );

  it('should return stringified data in consistent format', () => {
    info.dataSent = '{"data":    {"a":   1   }}';
    const result = info.getRequestBody();
    expect(typeof result).toBe('string');
    expect(result).toMatchInlineSnapshot(`
      "{
        "data": {
          "a": 1
        }
      }"
    `);
  });

  it('should return object wrapped in data if parsing fails', () => {
    // @ts-ignore
    info.dataSent = { test: 1 };
    const result = info.getRequestBody();
    expect(typeof result).toBe('string');
    expect(result).toMatchInlineSnapshot(`
      "{
        "data": {
          "test": 1
        }
      }"
    `);
  });

  it('should process formData', () => {
    const mockFormData = {
      _parts: [
        ['test', 'hello'],
        ['another', 'goodbye'],
      ],
    };
    // @ts-ignore
    info.dataSent = mockFormData;
    const result = info.getRequestBody();
    expect(typeof result).toBe('string');
    expect(result).toMatchInlineSnapshot(`
      "{
        "test": "hello",
        "another": "goodbye"
      }"
    `);
  });

  it('should escape new lines and quotes if escape set to true', () => {
    info.dataSent =
      '{"operationName": "Test", "query": "query posts(type=\\"test\\") {\\n  id\\n  name\\n}"}';
    const result = info.getRequestBody(true);
    expect(typeof result).toBe('string');
    expect(result).toEqual(`{
  "operationName": "Test",
  "query": "query posts(type="test") {
  id
  name
}"
}`);
  });
});

describe('getResponseBody', () => {
  const info = new NetworkRequestInfo(
    '1',
    'application/json',
    'GET',
    'https://test.com'
  );

  it('should return stringified data in consistent format', () => {
    info.dataSent = '{"data":    {"a":   1   }}';
    const result = info.getRequestBody();
    expect(typeof result).toBe('string');
    expect(result).toMatchInlineSnapshot(`
      "{
        "data": {
          "a": 1
        }
      }"
    `);
  });

  it('should return object wrapped in data if parsing fails', () => {
    // @ts-ignore
    info.dataSent = { test: 1 };
    const result = info.getRequestBody();
    expect(typeof result).toBe('string');
    expect(result).toMatchInlineSnapshot(`
      "{
        "data": {
          "test": 1
        }
      }"
    `);
  });
});
