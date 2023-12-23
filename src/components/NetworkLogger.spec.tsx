import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import NetworkLogger, { NetworkLoggerProps } from './NetworkLogger';
import logger from '../loggerSingleton';
import NetworkRequestInfo from '../NetworkRequestInfo';

jest.mock('../loggerSingleton', () => ({
  isPaused: false,
  enabled: true,
  setCallback: jest.fn(),
  clearRequests: jest.fn(),
  onPausedChange: jest.fn(),
  getRequests: jest.fn().mockReturnValue([]),
  enableXHRInterception: jest.fn(),
  disableXHRInterception: jest.fn(),
}));
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

const MyNetworkLogger = (props: NetworkLoggerProps) => {
  return <NetworkLogger {...props} />;
};

describe('max rows', () => {
  it('should stop adding new rows once maxRows is reached', () => {
    const requests = [] as NetworkRequestInfo[];
    const spyOnLoggerSetCallback = jest.spyOn(logger, 'setCallback');
    const emitCallback = jest.fn();
    spyOnLoggerSetCallback.mockImplementation((callback) => {
      return emitCallback.mockImplementation((id: number) => {
        requests.unshift(
          new NetworkRequestInfo(
            `${id}`,
            'XMLHttpRequest',
            'POST',
            `http://example.com/${id}`
          )
        );
        return callback(requests);
      });
    });

    const { queryAllByText, queryByText } = render(
      <MyNetworkLogger maxRows={2} />
    );

    act(() => {
      emitCallback(1);
    });

    expect(queryAllByText(/example\.com/i)).toHaveLength(1);

    act(() => {
      emitCallback(2);
    });

    expect(queryAllByText(/example\.com/i)).toHaveLength(2);

    act(() => {
      emitCallback(3);
    });

    expect(queryAllByText(/example\.com/i)).not.toHaveLength(3);
    expect(queryByText(/example\.com\/3$/i)).toBeTruthy();
    expect(queryByText(/example\.com\/2$/i)).toBeTruthy();
    expect(queryByText(/example\.com\/1$/i)).toBeFalsy();

    spyOnLoggerSetCallback.mockRestore();
  });
});

describe('options', () => {
  it('should toggle the display of the paused banner when paused', async () => {
    const spyOnLoggerPauseRequests = jest.spyOn(logger, 'onPausedChange');
    const { getByText, queryByText, getByTestId, unmount } = render(
      <MyNetworkLogger />
    );

    fireEvent.press(getByTestId('options-menu'));
    fireEvent.press(getByText(/^pause$/i));

    expect(queryByText(/^paused$/i)).toBeTruthy();

    expect(spyOnLoggerPauseRequests).toHaveBeenCalledTimes(1);

    fireEvent.press(getByTestId('options-menu'));
    fireEvent.press(getByText(/^resume$/i));

    expect(queryByText(/^paused$/i)).toBeFalsy();

    spyOnLoggerPauseRequests.mockRestore();

    unmount();
  });

  it('should clear the logs on demand', async () => {
    const spyOnLoggerClearRequests = jest
      .spyOn(logger, 'clearRequests')
      .mockImplementationOnce(() => null);

    const { getByText, queryByText, getByTestId, unmount } = render(
      <MyNetworkLogger />
    );
    expect(spyOnLoggerClearRequests).toHaveBeenCalledTimes(0);

    fireEvent.press(getByTestId('options-menu'));
    expect(queryByText(/^options$/i)).toBeDefined();
    fireEvent.press(getByText(/^clear/i));

    expect(spyOnLoggerClearRequests).toHaveBeenCalledTimes(1);

    spyOnLoggerClearRequests.mockRestore();

    unmount();
  });
});
