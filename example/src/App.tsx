import * as React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import NetworkLogger from 'react-native-network-logger';

export default function App() {
  const makeRequest = () => {
    fetch('https://postman-echo.com/post', {
      method: 'POST',
      body: JSON.stringify({ test: 'hello' }),
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Make request" onPress={makeRequest} />
      <NetworkLogger />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
