import React from 'react';
import {
  View,
  Image,
  TextInput,
  StyleSheet,
  Modal,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';

import Button from './Button';
import { Theme, useThemedStyles, useTheme } from '../theme';

interface Props {
  value: string;
  onChangeText(text: string): void;
  options: { text: string; onPress: () => void }[];
}

const SearchBar: React.FC<Props> = ({ options, value, onChangeText }) => {
  const styles = useThemedStyles(themedStyles);
  const theme = useTheme();
  const [openOptions, setOpenOptions] = React.useState(false);

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Image
          source={require('./search.png')}
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
      <TouchableOpacity
        style={styles.menu}
        onPress={() => setOpenOptions((prev) => !prev)}
      >
        <Image
          source={require('./more.png')}
          resizeMode="contain"
          style={styles.icon}
        />
      </TouchableOpacity>
      <Modal
        visible={openOptions}
        animationType="fade"
        transparent={true}
        onDismiss={() => setOpenOptions(false)}
        onRequestClose={() => setOpenOptions(false)}
      >
        <View style={styles.modalRoot}>
          <TouchableWithoutFeedback onPress={() => setOpenOptions(false)}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Options</Text>
            {options.map(({ text, onPress }) => (
              <Button key={text} onPress={onPress}>
                {text}
              </Button>
            ))}
          </View>
        </View>
      </Modal>
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
      borderRadius: 20,
      flex: 1,
    },
    modalRoot: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    modalContent: {
      borderRadius: 8,
      padding: 16,
      maxWidth: '100%',
      backgroundColor: 'white',
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
