import React, { Fragment } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { Theme, useThemedStyles } from '../theme';

const icons = {
  close: require('./images/close.png'),
  filter: require('./images/filter.png'),
  more: require('./images/more.png'),
  search: require('./images/search.png'),
  share: require('./images/share.png'),
};

type ButtonProps =
  | {
      onPress?: never;
      accessibilityLabel?: string;
    }
  | ({
      onPress: () => void;
      accessibilityLabel: string;
    } & TouchableOpacityProps);

type IconName = keyof typeof icons;

const Icon = ({
  name,
  onPress,
  accessibilityLabel,
  iconStyle,
  ...rest
}: {
  name: IconName;
  iconStyle?: Image['props']['style'];
} & ButtonProps) => {
  const styles = useThemedStyles(themedStyles);
  const Wrapper = onPress ? TouchableOpacity : Fragment;

  return (
    <Wrapper
      {...(onPress && {
        onPress,
        accessibilityLabel,
        accessibilityRole: 'button',
        style: styles.iconWrapper,
        ...rest,
      })}
    >
      <Image
        source={icons[name]}
        resizeMode="contain"
        style={[styles.icon, onPress && styles.iconButton, iconStyle]}
      />
    </Wrapper>
  );
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    icon: {
      width: 20,
      height: 20,
      marginRight: 10,
      alignSelf: 'center',
      tintColor: theme.colors.muted,
    },
    iconButton: {
      tintColor: theme.colors.text,
    },
    iconWrapper: {
      alignSelf: 'center',
    },
  });

export default Icon;
