import React from 'react';
import {
  render,
  fireEvent,
  within,
  screen,
} from '@testing-library/react-native';
import NetworkLogger, { NetworkLoggerProps } from './NetworkLogger';
import logger from '../loggerSingleton';
import NetworkRequestInfo from '../NetworkRequestInfo';

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

describe('options', () => {
  it('should toggle the display of the paused banner when paused', () => {
    const { getByText, queryByText, getByTestId } = render(<MyNetworkLogger />);

    fireEvent.press(getByTestId('options-menu'));
    fireEvent.press(getByText(/^pause$/i));

    expect(queryByText(/^paused$/i)).toBeTruthy();

    fireEvent.press(getByTestId('options-menu'));
    fireEvent.press(getByText(/^resume$/i));

    expect(queryByText(/^paused$/i)).toBeFalsy();
  });

  it('should clear the logs on demand', () => {
    const spyOnLoggerGetRequests = jest
      .spyOn(logger, 'getRequests')
      .mockImplementation(() => [
        new NetworkRequestInfo(
          '123',
          'XMLHttpRequest',
          'POST',
          'http://example.com/1'
        ),
      ]);

    const { getByText, queryByText, getByTestId } = render(<MyNetworkLogger />);

    expect(queryByText(/^post$/i)).toBeTruthy();

    fireEvent.press(getByTestId('options-menu'));
    fireEvent.press(getByText(/^clear/i));

    expect(spyOnLoggerGetRequests).toHaveBeenCalled();
    expect(queryByText(/^post$/i)).toBeFalsy();

    spyOnLoggerGetRequests.mockRestore();
  });
});

describe('regular vs compact row', () => {
  it.each([true, false])('should render the row compact: %p', (compact) => {
    const spyOnLoggerGetRequests = jest
      .spyOn(logger, 'getRequests')
      .mockImplementation(() => {
        const request = new NetworkRequestInfo(
          '123',
          'XMLHttpRequest',
          'POST',
          'http://example.com/1'
        );
        request.startTime = new Date('2000-01-01T12:34:00.000Z').getTime();
        request.endTime = new Date('2000-01-01T12:34:56.789Z').getTime();
        request.status = 200;
        return [request];
      });

    const { getByText } = render(<MyNetworkLogger compact={compact} />);
    screen.debug();
    const method = getByText(/^post$/i);
    expect(method).toBeTruthy();
    expect(!!within(method.parent!.parent!).queryByText(/^12:34:00$/i)).toBe(
      compact
    );

    const status = getByText(/^200$/i);
    expect(status).toBeTruthy();
    expect(
      within(status.parent!.parent!).queryByText(/^56789ms$/i)
    ).toBeTruthy();
    expect(within(status.parent!.parent!).queryByText(/^12:34:00$/i)).not.toBe(
      compact
    );

    spyOnLoggerGetRequests.mockRestore();
  });
});
