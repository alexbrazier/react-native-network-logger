"use strict";

import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useThemedStyles } from "../theme.js";
import ResultItem from "./ResultItem.js";
import SearchBar from "./SearchBar.js";
import { useAppContext } from "./AppContext.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const RequestList = ({
  requestsInfo,
  onPressItem,
  options,
  showDetails,
  compact,
  maxRows
}) => {
  const styles = useThemedStyles(themedStyles);
  const [searchValue, onChangeSearchText] = useState('');
  const {
    search,
    filter
  } = useAppContext();
  const lcSearch = search.toLowerCase().trim();
  const filteredRequests = useMemo(() => {
    return requestsInfo.filter(request => {
      const searchMatches = !lcSearch || request.url.toLowerCase().includes(lcSearch) || request.gqlOperation?.toLowerCase().includes(lcSearch);
      const filterMethodMatches = (filter.methods?.size ?? 0) === 0 || filter.methods?.has(request.method);
      const filterStatusMatches = filter.status ? request.status === filter.status : filter.statusErrors ? request.status >= 400 : true;
      const filterMatches = filterMethodMatches && filterStatusMatches;
      return searchMatches && filterMatches;
    }).slice(0, maxRows);
  }, [requestsInfo, lcSearch, filter, maxRows]);
  return /*#__PURE__*/_jsxs(View, {
    style: styles.container,
    children: [!showDetails && /*#__PURE__*/_jsx(SearchBar, {
      value: searchValue,
      onChangeText: onChangeSearchText,
      options: options
    }), /*#__PURE__*/_jsx(FlatList, {
      keyExtractor: item => item.id,
      data: filteredRequests,
      renderItem: ({
        item
      }) => /*#__PURE__*/_jsx(ResultItem, {
        request: item,
        onPress: () => onPressItem(item.id),
        compact: compact,
        list: true
      })
    })]
  });
};
const themedStyles = theme => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1
  }
});
export default RequestList;
//# sourceMappingURL=RequestList.js.map