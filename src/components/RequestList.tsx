import React, { useMemo } from 'react';
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
  options: { text: string; onPress: () => void }[];
  showDetails: boolean;
}

const RequestList: React.FC<Props> = ({
  requestsInfo,
  onPressItem,
  options,
  showDetails,
}) => {
  const styles = useThemedStyles(themedStyles);
  const { search, filter } = useAppContext();

  const filteredRequests = useMemo(() => {
    return requestsInfo.filter((request) => {
      const value = search.toLowerCase().trim();

      const searchMatches =
        request.url.toLowerCase().includes(value) ||
        request.gqlOperation?.toLowerCase().includes(value);

      const filterMatches =
        (filter.methods?.size ?? 0) === 0 ||
        filter.methods?.has(request.method);

      return searchMatches && filterMatches;
    });
  }, [requestsInfo, search, filter]);

  return (
    <View style={styles.container}>
      {!showDetails && <SearchBar options={options} />}
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
