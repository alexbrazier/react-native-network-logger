import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useThemedStyles, Theme } from '../theme';

interface Props {
  children: string;
  fullWidth?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const Button: React.FC<Props> = ({ children, fullWidth, style, onPress }) => {
  const styles = useThemedStyles(themedStyles);

  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      style={style}
    >
      <Text style={[styles.button, fullWidth && styles.fullWidth]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      color: theme.colors.link,
      fontSize: 18,
      padding: 10,
      alignSelf: 'flex-start',
    },
    fullWidth: {
      alignSelf: 'center',
    },
  });

export default Button;
