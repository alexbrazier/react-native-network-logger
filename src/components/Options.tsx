import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

import Button from './Button';
import { Theme, useThemedStyles } from '../theme';
import NLModal from './Modal';

interface Props {
  options: { text: string; onPress: () => Promise<void> | void }[];
}

const Options: React.FC<Props> = ({ options }) => {
  const styles = useThemedStyles(themedStyles);
  const [openOptions, setOpenOptions] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.menu}
        onPress={() => setOpenOptions(true)}
      >
        <Image
          source={require('./images/more.png')}
          resizeMode="contain"
          style={[styles.icon, styles.iconButton]}
        />
      </TouchableOpacity>
      <NLModal
        visible={openOptions}
        onClose={() => setOpenOptions(false)}
        title="Options"
      >
        {options.map(({ text, onPress }) => (
          <Button
            key={text}
            onPress={async () => {
              await onPress();
              setOpenOptions(false);
            }}
          >
            {text}
          </Button>
        ))}
      </NLModal>
    </>
  );
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    iconButton: {
      tintColor: theme.colors.text,
      width: 30,
    },
    icon: {
      width: 20,
      height: 20,
      marginRight: 10,
      alignSelf: 'center',
      tintColor: theme.colors.muted,
    },
    menu: { alignSelf: 'center' },
  });

export default Options;
