import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Theme, useThemedStyles, useTheme } from '../theme';
import Options from './Options';
import Filters from './Filters';
import { useAppContext } from './AppContext';
import Icon from './Icon';

interface Props {
  options: { text: string; onPress: () => Promise<void> | void }[];
}

const SearchBar: React.FC<Props> = ({ options }) => {
  const styles = useThemedStyles(themedStyles);
  const theme = useTheme();
  const { search, filterActive, dispatch } = useAppContext();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" />
          <TextInput
            onChangeText={(text) =>
              dispatch({ type: 'SET_SEARCH', payload: text })
            }
            value={search}
            placeholder="Filter URLs"
            underlineColorAndroid="transparent"
            style={styles.textInputSearch}
            placeholderTextColor={theme.colors.muted}
          />
          <Icon
            name="filter"
            onPress={() => setShowFilters(!showFilters)}
            accessibilityLabel="Filter"
            iconStyle={[styles.filterIcon, filterActive && styles.filterActive]}
          />
        </View>
        <Options options={options} />
      </View>
      <Filters open={showFilters} onClose={() => setShowFilters(false)} />
    </>
  );
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      margin: 5,
      borderWidth: 1,
      borderColor: theme.colors.muted,
      borderRadius: 10,
      flex: 1,
      paddingVertical: 5,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    filterIcon: {
      marginRight: 0,
    },
    filterActive: {
      tintColor: theme.colors.link,
    },
    textInputSearch: {
      height: 30,
      padding: 0,
      flexGrow: 1,
      color: theme.colors.text,
    },
    searchContainer: {
      flexDirection: 'row',
    },
    menu: { alignSelf: 'center' },
    title: {
      fontSize: 20,
      paddingBottom: 10,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

export default SearchBar;
