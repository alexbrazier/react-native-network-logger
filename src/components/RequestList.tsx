import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import NetworkRequestInfo from '../NetworkRequestInfo';
import { useThemedStyles, Theme } from '../theme';
import ResultItem from './ResultItem';
import Button from './Button';
import SearchBar from './SearchBar';

interface Props {
  requests: NetworkRequestInfo[];
  onPressItem: (item: NetworkRequestInfo) => void;
  onShowMore: () => void;
  showDetails: boolean;
}

const RequestList: React.FC<Props> = ({
  requests,
  onPressItem,
  onShowMore,
  showDetails,
}) => {
  const styles = useThemedStyles(themedStyles);

  const [searchValue, onChangeSearchText] = useState('');
  const [filteredRequests, setFilteredRequests] = useState(requests);

  useEffect(() => {
    const filtered = requests.filter((request) => {
      const value = searchValue.toLowerCase().trim();
      return (
        request.url.toLowerCase().includes(value) ||
        request.gqlOperation?.toLowerCase().includes(value)
      );
    });

    setFilteredRequests(filtered);
  }, [requests, searchValue]);

  return (
    <View style={styles.container}>
      {!showDetails && (
        <SearchBar value={searchValue} onChangeText={onChangeSearchText} />
      )}
      <FlatList
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <Button onPress={onShowMore} style={styles.more}>
            More
          </Button>
        )}
        data={filteredRequests}
        renderItem={({ item }) => (
          <ResultItem request={item} onPress={() => onPressItem(item)} />
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
    more: {
      marginLeft: 10,
    },
  });

export default RequestList;
