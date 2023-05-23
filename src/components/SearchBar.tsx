import React from 'react';
import { View, Image, TextInput, StyleSheet } from 'react-native';
import { Theme, useThemedStyles, useTheme } from '../theme';
import Options from './Options';

interface Props {
  value: string;
  onChangeText(text: string): void;
  options: { text: string; onPress: () => Promise<void> | void }[];
}

const SearchBar: React.FC<Props> = ({ options, value, onChangeText }) => {
  const styles = useThemedStyles(themedStyles);
  const theme = useTheme();

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Image
          source={require('./images/search.png')}
          resizeMode="contain"
          style={styles.icon}
        />
        <TextInput
          onChangeText={onChangeText}
          value={value}
          placeholder="Filter URLs"
          underlineColorAndroid="transparent"
          style={styles.textInputSearch}
          placeholderTextColor={theme.colors.muted}
        />
      </View>
      <Options options={options} />
    </View>
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
    icon: {
      width: 20,
      height: 20,
      marginRight: 10,
      alignSelf: 'center',
      tintColor: theme.colors.muted,
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
