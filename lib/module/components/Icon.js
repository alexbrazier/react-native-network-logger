"use strict";

import React, { Fragment } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemedStyles } from "../theme.js";
import { jsx as _jsx } from "react/jsx-runtime";
const icons = {
  close: require('./images/close.png'),
  filter: require('./images/filter.png'),
  more: require('./images/more.png'),
  search: require('./images/search.png'),
  share: require('./images/share.png')
};
const Icon = ({
  name,
  onPress,
  accessibilityLabel,
  iconStyle,
  ...rest
}) => {
  const styles = useThemedStyles(themedStyles);
  const Wrapper = onPress ? TouchableOpacity : Fragment;
  return /*#__PURE__*/_jsx(Wrapper, {
    ...(onPress && {
      onPress,
      accessibilityLabel,
      accessibilityRole: 'button',
      style: styles.iconWrapper,
      ...rest
    }),
    children: /*#__PURE__*/_jsx(Image, {
      source: icons[name],
      resizeMode: "contain",
      style: [styles.icon, onPress && styles.iconButton, iconStyle]
    })
  });
};
const themedStyles = theme => StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
    alignSelf: 'center',
    tintColor: theme.colors.muted
  },
  iconButton: {
    tintColor: theme.colors.text
  },
  iconWrapper: {
    alignSelf: 'center'
  }
});
export default Icon;
//# sourceMappingURL=Icon.js.map