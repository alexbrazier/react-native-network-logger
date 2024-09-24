import React from 'react';
import { View, Text, StyleSheet, Share } from 'react-native';
import { useThemedStyles, Theme } from '../theme';
import Icon from './Icon';

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
        <Icon
          name="share"
          testID="header-share"
          accessibilityLabel="Share"
          onPress={() => {
            Share.share({ message: shareContent });
          }}
          iconStyle={styles.shareIcon}
        />
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
    },
    container: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export default Header;
