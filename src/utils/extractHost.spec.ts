import extractHost from './extractHost';

describe('extractHost', () => {
  it('should extract host from basic url', () => {
    const host = extractHost('http://something.test.com/hello');

    expect(host).toEqual('something.test.com');
  });

  it('should extract host from url with port', () => {
    const host = extractHost('http://something.test.com:123/hello');

    expect(host).toEqual('something.test.com');
  });

  it('should extract host from ip', () => {
    const host = extractHost('http://192.168.1.1/hello');

    expect(host).toEqual('192.168.1.1');
  });

  it('should extract host from ip with port', () => {
    const host = extractHost('http://192.168.1.1:123/hello');

    expect(host).toEqual('192.168.1.1');
  });

  it('should return undefined for an invalid url', () => {
    const host = extractHost('invalid-url');

    expect(host).toBeUndefined();
  });
});
