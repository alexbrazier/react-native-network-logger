import NetworkRequestInfo from '../NetworkRequestInfo';

jest.mock('react-native/Libraries/Blob/FileReader', () => ({}));

describe('getCurlRequest', () => {
  it('should return valid curl request for simple GET request', () => {
    const info = new NetworkRequestInfo(
      'application/json',
      'GET',
      'https://test.com'
    );

    expect(info.curlRequest).toEqual('curl https://test.com');
  });
});
