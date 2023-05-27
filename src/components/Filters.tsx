import React from 'react';
import { View, Text } from 'react-native';
import NLModal from './Modal';
import Button from './Button';
import { useAppContext } from './AppContext';
import { StyleSheet } from 'react-native';
import { Theme, useThemedStyles } from '../theme';

const Filters = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { filter, dispatch } = useAppContext();
  const styles = useThemedStyles(themedStyles);

  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;

  return (
    <View>
      <NLModal visible={open} onClose={onClose} title="Filters">
        <Text style={styles.subTitle}>Method</Text>
        <View style={styles.methods}>
          {methods.map((method) => (
            <Button
              key={method}
              style={[
                styles.methodButton,
                filter.methods?.has(method) && styles.buttonActive,
              ]}
              textStyle={[
                styles.buttonText,
                filter.methods?.has(method) && styles.buttonActiveText,
              ]}
              onPress={() => {
                const newMethods = new Set(filter.methods);
                if (newMethods.has(method)) {
                  newMethods.delete(method);
                } else {
                  newMethods.add(method);
                }

                dispatch({
                  type: 'SET_FILTER',
                  payload: {
                    ...filter,
                    methods: newMethods,
                  },
                });
              }}
            >
              {method}
            </Button>
          ))}
        </View>

        <View style={styles.divider} />
        <Button
          textStyle={styles.clearButton}
          onPress={() => {
            dispatch({
              type: 'CLEAR_FILTER',
            });
            onClose();
          }}
        >
          Reset All Filters
        </Button>
      </NLModal>
    </View>
  );
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    subTitle: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    filterValue: {
      fontWeight: 'bold',
    },
    methods: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    methodButton: {
      margin: 2,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: theme.colors.secondary,
    },
    buttonText: {
      fontSize: 12,
    },
    buttonActive: {
      backgroundColor: theme.colors.secondary,
    },
    buttonActiveText: {
      color: theme.colors.onSecondary,
    },
    clearButton: {
      color: theme.colors.statusBad,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.muted,
      marginTop: 20,
    },
  });

export default Filters;
