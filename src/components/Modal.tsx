import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';

import { Theme, useThemedStyles } from '../theme';
import Icon from './Icon';

interface Props {
  children: React.ReactNode;
  visible: boolean;
  onClose: () => void;
  title?: string;
}

const NLModal = ({ visible, onClose, children, title }: Props) => {
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
        <View style={styles.modalContent}>
          {title && (
            <View style={styles.titleContainer}>
              <Text style={styles.title} accessibilityRole="header">
                {title}
              </Text>
              <Icon name="close" onPress={onClose} accessibilityLabel="Close" />
            </View>
          )}
          {children}
        </View>
      </View>
    </Modal>
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
      minWidth: '60%',
      backgroundColor: theme.colors.background,
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
      marginTop: -8,
      marginRight: -8,
    },
    title: {
      color: theme.colors.text,
      fontSize: 25,
      fontWeight: 'bold',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
  });

export default NLModal;
