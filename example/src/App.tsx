import React, { useState } from 'react';
import {
  StyleSheet,
  Button,
  SafeAreaView,
  Platform,
  View,
  Text,
} from 'react-native';
import NetworkLogger, { ThemeName } from 'react-native-network-logger';

export default function App() {
  const formData = new FormData();
  formData.append('test', 'hello');
  const makeRequest = () => {
    fetch(
      'https://postman-echo.com/post?query=some really long query that goes onto multiple lines so we can test what happens',
      {
        method: 'POST',
        body: JSON.stringify({ test: 'hello' }),
      }
    );
    fetch('https://postman-echo.com/post?formData', {
      method: 'POST',
      body: formData,
    });
    fetch('https://httpstat.us/302');
    fetch('https://httpstat.us/400');
    fetch('https://httpstat.us/500');
    // Non JSON response
    fetch('https://postman-echo.com/stream/2');
    // Test requests that fail
    // fetch('https://failingrequest');
  };
  const [theme, setTheme] = useState<ThemeName>('dark');

  const styles = themedStyles(theme === 'dark');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        react-native-network-logger
      </Text>
      <NetworkLogger theme={theme} />
      <View style={styles.bottomView}>
        <Button
          title="Toggle Theme"
          onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        />
        <Button title="Make request" onPress={makeRequest} />
      </View>
    </SafeAreaView>
  );
}

const themedStyles = (dark = false) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: dark ? '#2d2a28' : 'white',
      paddingTop: Platform.OS === 'android' ? 25 : 0,
    },
    title: {
      color: dark ? 'white' : 'black',
      textAlign: 'center',
      padding: 10,
      fontSize: 18,
      fontWeight: 'bold',
    },
    bottomView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 30,
    },
  });
