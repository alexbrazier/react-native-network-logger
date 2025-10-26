import React from 'react';
import { View, Text, StyleSheet, Share, TouchableOpacity } from 'react-native';
import { useThemedStyles, Theme } from '../theme';
import Icon from './Icon';

interface Props {
  children: string;
  shareContent?: string;
  collapsible?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}

const Header: React.FC<Props> = ({
  children,
  shareContent,
  collapsible,
  expanded = false,
  onToggle,
}) => {
  const styles = useThemedStyles(themedStyles);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        testID="header-toggle"
        accessibilityRole="button"
        activeOpacity={collapsible ? 0.6 : 1}
        onPress={collapsible && onToggle ? onToggle : undefined}
      >
        <Text
          style={styles.header}
          accessibilityRole="header"
          testID="header-text"
        >
          {collapsible ? (expanded ? '▼ ' : '▶ ') : ''}
          {children}
        </Text>
      </TouchableOpacity>

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
      fontSize: 16,
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
