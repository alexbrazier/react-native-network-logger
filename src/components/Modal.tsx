import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';

import { useThemedStyles } from '../theme';

interface Props {
  children: React.ReactNode;
  visible: boolean;
  onClose: () => void;
}

const NLModal = ({ visible, onClose, children }: Props) => {
  const styles = useThemedStyles(themedStyles);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onDismiss={onClose}
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>{children}</View>
      </View>
    </Modal>
  );
};

const themedStyles = () =>
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
  });

export default NLModal;
