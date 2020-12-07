import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Theme, useThemedStyles, useTheme } from '../theme';
import ModalSelector from 'react-native-modal-selector';

interface Props {
  httpMethodValue: string;
  httpStatusCodeValue: number;
  onChangeHttpMethods(text: string): void;
  onChangeHttpCode(text: number): void;
}

const httpMethods = [
  { key: 'GET', label: 'GET' },
  { key: 'POST', label: 'POST' },
  { key: 'PUT', label: 'PUT' },
  { key: 'DELETE', label: 'DELETE' },
  { key: 'PATCH', label: 'PATCH' },
];
const httpStatusCode = [
  { key: 100, label: '100' },
  { key: 200, label: '200' },
  { key: 201, label: '201' },
  { key: 203, label: '203' },
  { key: 206, label: '206' },
  { key: 400, label: '400' },
  { key: 401, label: '401' },
  { key: 403, label: '403' },
  { key: 500, label: '500' },
  { key: 504, label: '504' },
];

const Filter: React.FC<Props> = ({
  httpMethodValue,
  httpStatusCodeValue,
  onChangeHttpMethods,
  onChangeHttpCode,
}) => {
  const styles = useThemedStyles(themedStyles);
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ModalSelector
        style={styles.dropDownContainer}
        selectTextStyle={{ color: theme.colors.text }}
        initValueTextStyle={{ color: theme.colors.text }}
        data={httpMethods}
        initValue="Select HTTP Method"
        onChange={(option) => onChangeHttpMethods(option.key)}
        selectedKey={httpMethodValue}
        cancelText="Cancel"
      />
      <ModalSelector
        selectTextStyle={{ color: theme.colors.text }}
        style={styles.dropDownContainer}
        initValueTextStyle={{ color: theme.colors.text }}
        data={httpStatusCode}
        initValue="Select HTTP Status"
        selectedKey={httpStatusCodeValue}
        onChange={(option) => onChangeHttpCode(option.key)}
        cancelText="Cancel"
      />
    </View>
  );
};

const themedStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      margin: 5,
      justifyContent: 'space-evenly',
    },
    dropDownContainer: {
      width: '48%',
    },
  });

export default Filter;
