"use strict";

import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useThemedStyles, useTheme } from "../theme.js";
import Options from "./Options.js";
import Filters from "./Filters.js";
import { useAppContext } from "./AppContext.js";
import Icon from "./Icon.js";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const SearchBar = ({
  options
}) => {
  const styles = useThemedStyles(themedStyles);
  const theme = useTheme();
  const {
    search,
    filterActive,
    dispatch
  } = useAppContext();
  const [showFilters, setShowFilters] = useState(false);
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsxs(View, {
      style: styles.searchContainer,
      children: [/*#__PURE__*/_jsxs(View, {
        style: styles.searchBar,
        children: [/*#__PURE__*/_jsx(Icon, {
          name: "search"
        }), /*#__PURE__*/_jsx(TextInput, {
          onChangeText: text => dispatch({
            type: 'SET_SEARCH',
            payload: text
          }),
          value: search,
          placeholder: "Filter URLs",
          underlineColorAndroid: "transparent",
          style: styles.textInputSearch,
          placeholderTextColor: theme.colors.muted
        }), /*#__PURE__*/_jsx(Icon, {
          name: "filter",
          onPress: () => setShowFilters(!showFilters),
          accessibilityLabel: "Filter",
          iconStyle: [styles.filterIcon, filterActive && styles.filterActive]
        })]
      }), /*#__PURE__*/_jsx(Options, {
        options: options
      })]
    }), /*#__PURE__*/_jsx(Filters, {
      open: showFilters,
      onClose: () => setShowFilters(false)
    })]
  });
};
const themedStyles = theme => StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: theme.colors.muted,
    borderRadius: 10,
    flex: 1,
    paddingVertical: 5
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  filterIcon: {
    marginRight: 0
  },
  filterActive: {
    tintColor: theme.colors.link
  },
  textInputSearch: {
    height: 30,
    padding: 0,
    flexGrow: 1,
    color: theme.colors.text
  },
  searchContainer: {
    flexDirection: 'row'
  },
  menu: {
    alignSelf: 'center'
  },
  title: {
    fontSize: 20,
    paddingBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
export default SearchBar;
//# sourceMappingURL=SearchBar.js.map