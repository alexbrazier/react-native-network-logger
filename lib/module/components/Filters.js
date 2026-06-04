"use strict";

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import NLModal from "./Modal.js";
import Button from "./Button.js";
import { useAppContext } from "./AppContext.js";
import { useTheme, useThemedStyles } from "../theme.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const FilterButton = ({
  onPress,
  active,
  children
}) => {
  const styles = useThemedStyles(themedStyles);
  return /*#__PURE__*/_jsx(Button, {
    style: [styles.methodButton, active && styles.buttonActive],
    textStyle: [styles.buttonText, active && styles.buttonActiveText],
    onPress: onPress,
    accessibilityRole: "checkbox",
    accessibilityState: {
      checked: active
    },
    children: children
  });
};
const Filters = ({
  open,
  onClose
}) => {
  const {
    filter,
    dispatch
  } = useAppContext();
  const styles = useThemedStyles(themedStyles);
  const theme = useTheme();
  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'];
  return /*#__PURE__*/_jsx(View, {
    children: /*#__PURE__*/_jsxs(NLModal, {
      visible: open,
      onClose: onClose,
      title: "Filters",
      children: [/*#__PURE__*/_jsx(Text, {
        style: styles.subTitle,
        accessibilityRole: "header",
        children: "Method"
      }), /*#__PURE__*/_jsx(View, {
        style: styles.methods,
        children: methods.map(method => /*#__PURE__*/_jsx(FilterButton, {
          active: filter.methods?.has(method),
          onPress: () => {
            const newMethods = new Set(filter.methods);
            if (newMethods.has(method)) {
              newMethods.delete(method);
            } else {
              newMethods.add(method);
            }
            dispatch({
              type: 'SET_FILTER',
              payload: {
                ...filter,
                methods: newMethods
              }
            });
          },
          children: method
        }, method))
      }), /*#__PURE__*/_jsx(Text, {
        style: styles.subTitle,
        accessibilityRole: "header",
        children: "Status"
      }), /*#__PURE__*/_jsxs(View, {
        style: styles.methods,
        children: [/*#__PURE__*/_jsx(FilterButton, {
          active: filter.statusErrors,
          onPress: () => {
            dispatch({
              type: 'SET_FILTER',
              payload: {
                ...filter,
                statusErrors: !filter.statusErrors,
                status: undefined
              }
            });
          },
          children: "Errors"
        }), /*#__PURE__*/_jsx(TextInput, {
          style: styles.statusInput,
          placeholder: "Status Code",
          placeholderTextColor: theme.colors.muted,
          keyboardType: "number-pad",
          value: filter.status?.toString() || '',
          maxLength: 3,
          accessibilityLabel: "Status Code",
          onChangeText: text => {
            const status = parseInt(text, 10);
            dispatch({
              type: 'SET_FILTER',
              payload: {
                ...filter,
                statusErrors: false,
                status: isNaN(status) ? undefined : status
              }
            });
          }
        })]
      }), /*#__PURE__*/_jsx(View, {
        style: styles.divider
      }), /*#__PURE__*/_jsx(Button, {
        textStyle: styles.clearButton,
        onPress: () => {
          dispatch({
            type: 'CLEAR_FILTER'
          });
          onClose();
        },
        children: "Reset All Filters"
      })]
    })
  });
};
const themedStyles = theme => StyleSheet.create({
  subTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  filterValue: {
    fontWeight: 'bold'
  },
  methods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10
  },
  methodButton: {
    margin: 2,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: theme.colors.secondary
  },
  statusInput: {
    color: theme.colors.text,
    marginLeft: 10,
    borderColor: theme.colors.secondary,
    padding: 5,
    borderBottomWidth: 1,
    minWidth: 100
  },
  buttonText: {
    fontSize: 12
  },
  buttonActive: {
    backgroundColor: theme.colors.secondary
  },
  buttonActiveText: {
    color: theme.colors.onSecondary
  },
  clearButton: {
    color: theme.colors.statusBad
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.muted,
    marginTop: 20
  }
});
export default Filters;
//# sourceMappingURL=Filters.js.map