import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from './theme';
import type NetworkRequestInfo from './NetworkRequestInfo';

interface Props {
  request: NetworkRequestInfo;
  onPress?(): void;
  style?: any;
}

const ResultItem: React.FC<Props> = ({ style, request, onPress }) => {
  const getStatusTextColor = (status: number) => {
    if (status !== 200) {
      return {
        color: colors.red,
      };
    }
    return {};
  };
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => {
        onPress?.();
      }}
    >
      <Text style={[styles.text, styles.method, styles[request.method]]}>
        {request.method}
      </Text>
      <View style={styles.divider} />
      <Text
        style={[
          styles.text,
          styles.content,
          getStatusTextColor(request.status),
        ]}
      >
        {request.url}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.grey,
    flexDirection: 'row',
    margin: 5,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    textAlign: 'left',
  },
  content: {
    paddingLeft: 5,
    paddingRight: 5,
    flexShrink: 1,
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: colors.white,
    height: '100%',
  },
  GET: {
    color: colors.green,
  },
  POST: {
    color: colors.yellow,
  },
  UPDATE: {
    color: colors.orange,
  },
  DELETE: {
    color: colors.red,
  },
  method: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 0,
    width: 80,
  },
});

export default ResultItem;
