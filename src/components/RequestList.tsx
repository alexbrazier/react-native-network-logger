import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import type NetworkRequestInfo from '../NetworkRequestInfo';
import { useThemedStyles, Theme } from '../theme';
import ResultItem from './ResultItem';
import Button from './Button';

interface Props {
  requests: NetworkRequestInfo[];
  onPressItem: (item: NetworkRequestInfo) => void;
  onShowMore: () => void;
}

const RequestList: React.FC<Props> = ({
  requests,
  onPressItem,
  onShowMore,
}) => {
  const styles = useThemedStyles(themedStyles);
  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={() => (
          <Button onPress={onShowMore} style={styles.more}>
            More
          </Button>
        )}
        data={requests}
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
