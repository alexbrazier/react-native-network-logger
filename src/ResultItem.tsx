import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import type NetworkRequestInfo from './NetworkRequestInfo';

interface Props {
  request: NetworkRequestInfo;
  onPress?(): void;
  style?: any;
}

const ResultItem: React.FC<Props> = ({ style, request, onPress }) => {
  const getUrlTextColor = (status: number) => {
    if (status !== 200) {
      return {
        color: '#8e2800',
      };
    }
    return {};
  };
  const getStatusTextColor = (status: number) => {
    if (status < 400) {
      return 'green';
    }
    if (status < 500) {
      return '#dd825d';
    }
    return 'red';
  };

  const getStatusStyles = (status: number) => ({
    color: getStatusTextColor(status),
    borderColor: getStatusTextColor(status),
  });
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => {
        onPress?.();
      }}
    >
      <View style={styles.leftContainer}>
        <Text style={[styles.text, styles.method]}>{request.method}</Text>
        <Text style={[styles.status, getStatusStyles(request.status)]}>
          {request.status}
        </Text>
        <Text>{request.duration}ms</Text>
      </View>
      <Text
        style={[styles.text, styles.content, getUrlTextColor(request.status)]}
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
    backgroundColor: 'white',
    flexDirection: 'row',
    margin: 5,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
  },
  leftContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  status: {
    fontWeight: 'bold',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 1,
    paddingHorizontal: 4,
    textAlign: 'center',
    marginVertical: 3,
  },
  text: {
    color: 'black',
    fontSize: 16,
    textAlign: 'left',
  },
  content: {
    paddingLeft: 5,
    paddingRight: 5,
    flexShrink: 1,
    flex: 1,
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
