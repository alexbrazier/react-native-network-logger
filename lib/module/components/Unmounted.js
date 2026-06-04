"use strict";

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useThemedStyles } from "../theme.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Unmounted = () => {
  const styles = useThemedStyles(themedStyles);
  return /*#__PURE__*/_jsxs(View, {
    style: styles.container,
    children: [/*#__PURE__*/_jsx(Text, {
      style: styles.heading,
      children: "Unmounted Error"
    }), /*#__PURE__*/_jsx(Text, {
      style: styles.body,
      children: "It looks like the network logger hasn\u2019t been enabled yet."
    }), /*#__PURE__*/_jsxs(Text, {
      style: styles.body,
      children: ["This is likely due to you running another debugging tool that is also intercepting network requests. Either disable that or start the network logger with the option:", ' ', /*#__PURE__*/_jsx(Text, {
        style: styles.code,
        children: "\"forceEnable: true\""
      }), "."]
    })]
  });
};
const themedStyles = theme => StyleSheet.create({
  container: {
    padding: 15
  },
  heading: {
    color: theme.colors.text,
    fontWeight: '600',
    fontSize: 25,
    marginBottom: 10
  },
  body: {
    color: theme.colors.text,
    marginTop: 5
  },
  code: {
    color: theme.colors.muted
  }
});
export default Unmounted;
//# sourceMappingURL=Unmounted.js.map