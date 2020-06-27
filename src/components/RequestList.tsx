import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import type NetworkRequestInfo from '../NetworkRequestInfo';
import { useThemedStyles, Theme } from '../theme';
import ResultItem from './ResultItem';

interface Props {
  requests: NetworkRequestInfo[];
  onPressItem: (item: NetworkRequestInfo) => void;
}

const RequestList: React.FC<Props> = ({ requests, onPressItem }) => {
  const styles = useThemedStyles(themedStyles);
  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
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
  });

export default RequestList;
