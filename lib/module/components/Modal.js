"use strict";

import React from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback, Text } from 'react-native';
import { useThemedStyles } from "../theme.js";
import Icon from "./Icon.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const NLModal = ({
  visible,
  onClose,
  children,
  title
}) => {
  const styles = useThemedStyles(themedStyles);
  return /*#__PURE__*/_jsx(Modal, {
    visible: visible,
    animationType: "fade",
    transparent: true,
    onDismiss: onClose,
    onRequestClose: onClose,
    children: /*#__PURE__*/_jsxs(View, {
      style: styles.modalRoot,
      children: [/*#__PURE__*/_jsx(TouchableWithoutFeedback, {
        onPress: onClose,
        children: /*#__PURE__*/_jsx(View, {
          style: styles.backdrop
        })
      }), /*#__PURE__*/_jsxs(View, {
        style: styles.modalContent,
        children: [title && /*#__PURE__*/_jsxs(View, {
          style: styles.titleContainer,
          children: [/*#__PURE__*/_jsx(Text, {
            style: styles.title,
            accessibilityRole: "header",
            children: title
          }), /*#__PURE__*/_jsx(Icon, {
            name: "close",
            onPress: onClose,
            accessibilityLabel: "Close"
          })]
        }), children]
      })]
    })
  });
};
const themedStyles = theme => StyleSheet.create({
  modalRoot: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  modalContent: {
    borderRadius: 8,
    padding: 16,
    maxWidth: '100%',
    minWidth: '60%',
    backgroundColor: theme.colors.background
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: -8,
    marginRight: -8
  },
  title: {
    color: theme.colors.text,
    fontSize: 25,
    fontWeight: 'bold'
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)'
  }
});
export default NLModal;
//# sourceMappingURL=Modal.js.map