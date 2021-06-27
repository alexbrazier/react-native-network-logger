import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import Header from './Header';
import { Share } from 'react-native';

jest.mock('react-native/Libraries/Share/Share', () => ({ share: jest.fn() }));
jest.mock('./share.png', () => ({ uri: '' }));

test('it renders header correctly', () => {
  const { getByTestId, queryByTestId } = render(<Header>My Title</Header>);

  expect(getByTestId('header-text').props.children).toEqual('My Title');
  expect(queryByTestId('header-share')).toBeNull();
});

test('share button renders when provided with value', async () => {
  const { getByTestId } = render(
    <Header shareContent="share me">My Title</Header>
  );

  expect(getByTestId('header-text').props.children).toEqual('My Title');
  expect(getByTestId('header-share')).toBeDefined();

  act(() => {
    fireEvent.press(getByTestId('header-share'));
  });

  expect(Share.share).toHaveBeenCalledWith({ message: 'share me' });
});

test("share button doesn't render if content is empty string", async () => {
  const { getByTestId, queryByTestId } = render(
    <Header shareContent="">My Title</Header>
  );

  expect(getByTestId('header-text').props.children).toEqual('My Title');
  expect(queryByTestId('header-share')).toBeNull();
});
