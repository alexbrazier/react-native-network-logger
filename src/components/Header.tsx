import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Image,
} from 'react-native';
import { useThemedStyles, Theme } from '../theme';

interface Props {
  children: string;
  shareContent?: string;
}

const Header: React.FC<Props> = ({ children, shareContent }) => {
  const styles = useThemedStyles(themedStyles);
  return (
    <View style={styles.container}>
      <Text
        style={styles.header}
        accessibilityRole="header"
        testID="header-text"
      >
        {children}
      </Text>

      {!!shareContent && (
        <TouchableOpacity
          testID="header-share"
          accessibilityLabel="Share"
          accessibilityRole="button"
          onPress={() => {
            Share.share({ message: shareContent });
          }}
        >
          <Image
            source={require('./images/share.png')}
            resizeMode="contain"
            style={styles.shareIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      fontWeight: 'bold',
      fontSize: 20,
      marginTop: 10,
      marginBottom: 5,
      marginHorizontal: 10,
      color: theme.colors.text,
    },
    shareIcon: {
      width: 24,
      height: 24,
      marginRight: 10,
      tintColor: theme.colors.text,
    },
    container: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export default Header;
