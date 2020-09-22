import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TextInput, Image } from 'react-native';
import NetworkRequestInfo from '../NetworkRequestInfo';
import { useThemedStyles, Theme, useTheme } from '../theme';
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
  onShowMore
}) => {
  const styles = useThemedStyles(themedStyles);
  const themedColors = useTheme();

  const [searchValue, onChangeSearchText] = useState('');
  const filterdRequests = requests.filter(request =>
    request.url.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Image
          source={require('./search.png')}
          resizeMode="contain"
          style={styles.searchIcon}
        />
        <TextInput
          onChangeText={input => onChangeSearchText(input)}
          value={searchValue}
          placeholder="Filter URLs"
          underlineColorAndroid={'transparent'}
          style={styles.textInputSearch}
          placeholderTextColor={themedColors.colors.muted}
        />
      </View>
      <FlatList
        keyExtractor={(item, index) =>
          item.startTime.toString() + index.toString()
        }
        ListHeaderComponent={() => (
          <Button onPress={onShowMore} style={styles.more}>
            More
          </Button>
        )}
        data={filterdRequests}
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
      marginLeft: 10
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      margin: 5,
      borderWidth: 1,
      borderColor: theme.colors.muted,
      borderRadius: 20,
    },
    searchIcon: {
      width: 20,
      height: 20,
      marginRight: 10,
    },
    textInputSearch: {
      height: 30,
      padding: 0,
      flexGrow: 1,
      color: theme.colors.text,
    }
  });

export default RequestList;
