import React, { useState } from 'react';
import { StyleSheet, Button, SafeAreaView, Platform } from 'react-native';
import NetworkLogger, { ThemeName } from 'react-native-network-logger';

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
  const [theme, setTheme] = useState<ThemeName>('light');

  return (
    <SafeAreaView style={styles.container}>
      <Button title="Make request" onPress={makeRequest} />
      <NetworkLogger theme={theme} />
      <Button
        title="Toggle Theme"
        onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
});
