"use strict";

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useThemedStyles } from "../theme.js";
import { jsx as _jsx } from "react/jsx-runtime";
const Button = ({
  children,
  fullWidth,
  style,
  textStyle,
  onPress,
  ...rest
}) => {
  const styles = useThemedStyles(themedStyles);
  return /*#__PURE__*/_jsx(TouchableOpacity, {
    accessibilityRole: "button",
    onPress: onPress,
    style: style,
    ...rest,
    children: /*#__PURE__*/_jsx(Text, {
      style: [styles.button, fullWidth && styles.fullWidth, textStyle],
      children: children
    })
  });
};
const themedStyles = theme => StyleSheet.create({
  button: {
    color: theme.colors.link,
    fontSize: 18,
    padding: 10,
    alignSelf: 'flex-start'
  },
  fullWidth: {
    alignSelf: 'center'
  }
});
export default Button;
//# sourceMappingURL=Button.js.map