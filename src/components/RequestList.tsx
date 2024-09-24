import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import NetworkRequestInfo from '../NetworkRequestInfo';
import { useThemedStyles, Theme } from '../theme';
import ResultItem from './ResultItem';
import SearchBar from './SearchBar';
import { NetworkRequestInfoRow } from '../types';
import { useAppContext } from './AppContext';

interface Props {
  requestsInfo: NetworkRequestInfoRow[];
  onPressItem: (item: NetworkRequestInfo['id']) => void;
  options: { text: string; onPress: () => Promise<void> }[];
  showDetails: boolean;
  compact: boolean;
  maxRows: number;
}

const RequestList: React.FC<Props> = ({
  requestsInfo,
  onPressItem,
  options,
  showDetails,
  compact,
  maxRows,
}) => {
  const styles = useThemedStyles(themedStyles);
  const [searchValue, onChangeSearchText] = useState('');
  const { search, filter } = useAppContext();
  const lcSearch = search.toLowerCase().trim();

  const filteredRequests = useMemo(() => {
    return requestsInfo
      .filter((request) => {
        const searchMatches =
          !lcSearch ||
          request.url.toLowerCase().includes(lcSearch) ||
          request.gqlOperation?.toLowerCase().includes(lcSearch);

        const filterMethodMatches =
          (filter.methods?.size ?? 0) === 0 ||
          filter.methods?.has(request.method);

        const filterStatusMatches = filter.status
          ? request.status === filter.status
          : filter.statusErrors
            ? request.status >= 400
            : true;

        const filterMatches = filterMethodMatches && filterStatusMatches;

        return searchMatches && filterMatches;
      })
      .slice(0, maxRows);
  }, [requestsInfo, lcSearch, filter]);

  return (
    <View style={styles.container}>
      {!showDetails && (
        <SearchBar
          value={searchValue}
          onChangeText={onChangeSearchText}
          options={options}
        />
      )}
      <FlatList
        keyExtractor={(item) => item.id}
        data={filteredRequests}
        renderItem={({ item }) => (
          <ResultItem
            request={item}
            onPress={() => onPressItem(item.id)}
            compact={compact}
            list
          />
        )}
      />
    </View>
  );
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
  });

export default RequestList;
