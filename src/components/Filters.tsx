import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import NLModal from './Modal';
import Button from './Button';
import { useAppContext } from './AppContext';
import { Theme, useTheme, useThemedStyles } from '../theme';

const FilterButton = ({
  onPress,
  active,
  children,
}: {
  onPress: () => void;
  active?: boolean;
  children: string;
}) => {
  const styles = useThemedStyles(themedStyles);

  return (
    <Button
      style={[styles.methodButton, active && styles.buttonActive]}
      textStyle={[styles.buttonText, active && styles.buttonActiveText]}
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: active }}
    >
      {children}
    </Button>
  );
};

const Filters = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { filter, dispatch } = useAppContext();
  const styles = useThemedStyles(themedStyles);
  const theme = useTheme();

  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'] as const;

  return (
    <View>
      <NLModal visible={open} onClose={onClose} title="Filters">
        <Text style={styles.subTitle} accessibilityRole="header">
          Method
        </Text>
        <View style={styles.methods}>
          {methods.map((method) => (
            <FilterButton
              key={method}
              active={filter.methods?.has(method)}
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
            </FilterButton>
          ))}
        </View>
        <Text style={styles.subTitle} accessibilityRole="header">
          Status
        </Text>
        <View style={styles.methods}>
          <FilterButton
            active={filter.statusErrors}
            onPress={() => {
              dispatch({
                type: 'SET_FILTER',
                payload: {
                  ...filter,
                  statusErrors: !filter.statusErrors,
                  status: undefined,
                },
              });
            }}
          >
            Errors
          </FilterButton>
          <TextInput
            style={styles.statusInput}
            placeholder="Status Code"
            placeholderTextColor={theme.colors.muted}
            keyboardType="number-pad"
            value={filter.status?.toString() || ''}
            maxLength={3}
            accessibilityLabel="Status Code"
            onChangeText={(text) => {
              const status = parseInt(text, 10);
              dispatch({
                type: 'SET_FILTER',
                payload: {
                  ...filter,
                  statusErrors: false,
                  status: isNaN(status) ? undefined : status,
                },
              });
            }}
          />
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
      marginBottom: 10,
    },
    methodButton: {
      margin: 2,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: theme.colors.secondary,
    },
    statusInput: {
      color: theme.colors.text,
      marginLeft: 10,
      borderColor: theme.colors.secondary,
      padding: 5,
      borderBottomWidth: 1,
      minWidth: 100,
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
