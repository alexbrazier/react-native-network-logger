"use strict";

import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import Header from "./Header.js";
import { Share } from 'react-native';
import { jsx as _jsx } from "react/jsx-runtime";
jest.mock('react-native/Libraries/Share/Share');
jest.mock('./images/share.png', () => ({
  uri: ''
}));
test('it renders header correctly', () => {
  const {
    getByTestId,
    queryByTestId
  } = render(/*#__PURE__*/_jsx(Header, {
    children: "My Title"
  }));
  expect(getByTestId('header-text').props.children).toEqual('My Title');
  expect(queryByTestId('header-share')).toBeNull();
});
test('share button renders when provided with value', async () => {
  const {
    getByTestId
  } = render(/*#__PURE__*/_jsx(Header, {
    shareContent: "share me",
    children: "My Title"
  }));
  expect(getByTestId('header-text').props.children).toEqual('My Title');
  expect(getByTestId('header-share')).toBeDefined();
  act(() => {
    fireEvent.press(getByTestId('header-share'));
  });
  expect(Share.share).toHaveBeenCalledWith({
    message: 'share me'
  });
});
test("share button doesn't render if content is empty string", async () => {
  const {
    getByTestId,
    queryByTestId
  } = render(/*#__PURE__*/_jsx(Header, {
    shareContent: "",
    children: "My Title"
  }));
  expect(getByTestId('header-text').props.children).toEqual('My Title');
  expect(queryByTestId('header-share')).toBeNull();
});
//# sourceMappingURL=Header.spec.js.map