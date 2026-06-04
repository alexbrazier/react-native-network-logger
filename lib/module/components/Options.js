"use strict";

import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Button from "./Button.js";
import { useThemedStyles } from "../theme.js";
import NLModal from "./Modal.js";
import Icon from "./Icon.js";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
const Options = ({
  options
}) => {
  const styles = useThemedStyles(themedStyles);
  const [openOptions, setOpenOptions] = useState(false);
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(Icon, {
      name: "more",
      onPress: () => setOpenOptions(true),
      testID: "options-menu",
      accessibilityLabel: "More",
      iconStyle: styles.iconButton
    }), /*#__PURE__*/_jsx(NLModal, {
      visible: openOptions,
      onClose: () => setOpenOptions(false),
      title: "Options",
      children: options.map(({
        text,
        onPress
      }) => /*#__PURE__*/_jsx(Button, {
        onPress: async () => {
          // Need to await in order for the getHar option to work
          await onPress();
          setOpenOptions(false);
        },
        children: text
      }, text))
    })]
  });
};
const themedStyles = () => StyleSheet.create({
  iconButton: {
    width: 30
  }
});
export default Options;
//# sourceMappingURL=Options.js.map