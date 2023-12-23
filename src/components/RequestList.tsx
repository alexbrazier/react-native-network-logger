import React, { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import NetworkRequestInfo from '../NetworkRequestInfo';
import { useThemedStyles, Theme } from '../theme';
import ResultItem from './ResultItem';
import SearchBar from './SearchBar';
import { NetworkRequestInfoRow } from '../types';

interface Props {
  requestsInfo: NetworkRequestInfoRow[];
  onPressItem: (item: NetworkRequestInfo['id']) => void;
  options: { text: string; onPress: () => Promise<void> }[];
  showDetails: boolean;
  maxRows: number;
}

const RequestList: React.FC<Props> = ({
  requestsInfo,
  onPressItem,
  options,
  showDetails,
  maxRows,
}) => {
  const styles = useThemedStyles(themedStyles);

  const [searchValue, onChangeSearchText] = useState('');

  const filteredRequests = useMemo(() => {
    return requestsInfo
      .filter((request) => {
        const value = searchValue.toLowerCase().trim();
        return (
          request.url.toLowerCase().includes(value) ||
          request.gqlOperation?.toLowerCase().includes(value)
        );
      })
      .slice(0, maxRows);
  }, [requestsInfo, maxRows, searchValue]);

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
          <ResultItem request={item} onPress={() => onPressItem(item.id)} />
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
