import React from 'react';
import { View, Image, TextInput, StyleSheet } from 'react-native';
import { Theme, useThemedStyles, useTheme } from '../theme';

interface Props {
  value: string;
  onChangeText(text: string): void;
}

const SearchBar: React.FC<Props> = ({ value, onChangeText }) => {
  const styles = useThemedStyles(themedStyles);
  const theme = useTheme();

  return (
    <View style={styles.searchContainer}>
      <Image
        source={require('./search.png')}
        resizeMode="contain"
        style={styles.searchIcon}
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
  );
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
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
    },
  });

export default SearchBar;
