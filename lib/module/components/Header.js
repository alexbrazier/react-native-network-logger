"use strict";

import React from 'react';
import { View, Text, StyleSheet, Share } from 'react-native';
import { useThemedStyles } from "../theme.js";
import Icon from "./Icon.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Header = ({
  children,
  shareContent
}) => {
  const styles = useThemedStyles(themedStyles);
  return /*#__PURE__*/_jsxs(View, {
    style: styles.container,
    children: [/*#__PURE__*/_jsx(Text, {
      style: styles.header,
      accessibilityRole: "header",
      testID: "header-text",
      children: children
    }), !!shareContent && /*#__PURE__*/_jsx(Icon, {
      name: "share",
      testID: "header-share",
      accessibilityLabel: "Share",
      onPress: () => {
        Share.share({
          message: shareContent
        });
      },
      iconStyle: styles.shareIcon
    })]
  });
};
const themedStyles = theme => StyleSheet.create({
  header: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 5,
    marginHorizontal: 10,
    color: theme.colors.text
  },
  shareIcon: {
    width: 24,
    height: 24
  },
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  }
});
export default Header;
//# sourceMappingURL=Header.js.map