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
      <NLModal visible={open} onClose={onClose}>
        <Text style={styles.title}>Filters</Text>
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

        <Button
          textStyle={styles.clearButton}
          onPress={() => {
            onClose();
          }}
        >
          Close
        </Button>
      </NLModal>
    </View>
  );
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    title: {
      fontSize: 25,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    subTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
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
  });

export default Filters;
