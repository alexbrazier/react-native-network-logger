import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Modal,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';

import Button from './Button';
import { Theme, useThemedStyles } from '../theme';

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
          </View>
        </View>
      </Modal>
    </>
  );
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
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
    title: {
      fontSize: 20,
      paddingBottom: 10,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

export default Options;
