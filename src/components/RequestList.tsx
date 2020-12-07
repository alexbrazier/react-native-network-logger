import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import NetworkRequestInfo from '../NetworkRequestInfo';
import { useThemedStyles, Theme } from '../theme';
import ResultItem from './ResultItem';
import Button from './Button';
import SearchBar from './SearchBar';
import Filter from './Filter';

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
  const [httpMethod, onChangeHttpMethods] = useState('');
  const [httpCode, onChangeHttpCode] = useState(0);
  const filteredRequests = requests.filter((request) => {
    return (
      request.url.toLowerCase().includes(searchValue.toLowerCase()) &&
      request.method.includes(httpMethod) &&
      request.status.toString().includes(httpCode.toString())
    );
  });

  return (
    <View style={styles.container}>
      {!showDetails && (
        <SearchBar value={searchValue} onChangeText={onChangeSearchText} />
      )}
      {!showDetails && (
        <Filter
          httpMethodValue={httpMethod}
          httpStatusCodeValue={httpCode}
          onChangeHttpMethods={onChangeHttpMethods}
          onChangeHttpCode={onChangeHttpCode}
        />
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
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    more: {
      marginLeft: 10,
    },
  });

export default RequestList;
