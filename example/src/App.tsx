import * as React from 'react';
import { StyleSheet, Button, SafeAreaView } from 'react-native';
import NetworkLogger from 'react-native-network-logger';

export default function App() {
  const makeRequest = () => {
    fetch('https://postman-echo.com/post', {
      method: 'POST',
      body: JSON.stringify({ test: 'hello' }),
    });
    fetch('https://httpstat.us/302');
    fetch('https://httpstat.us/400');
    fetch('https://httpstat.us/500');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Make request" onPress={makeRequest} />
      <NetworkLogger />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
