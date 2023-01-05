import React, { useState } from 'react';
import {
  StyleSheet,
  Button,
  SafeAreaView,
  Platform,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import NetworkLogger, {
  ThemeName,
  getBackHandler,
  startNetworkLogging,
} from 'react-native-network-logger';
import { getRates } from './apolloClient';

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
    fetch('https://httpstat.us/200', { method: 'HEAD' });
    fetch('https://postman-echo.com/put', {
      method: 'PUT',
      body: JSON.stringify({ test: 'hello' }),
    });
    fetch('https://httpstat.us/302');
    fetch('https://httpstat.us/400');
    fetch('https://httpstat.us/500');
    // Non JSON response
    fetch('https://postman-echo.com/stream/2');

    getRates();
    // Test requests that fail
    // fetch('https://failingrequest');
  };

  startNetworkLogging({
    ignoredHosts: ['192.168.1.28', '127.0.0.1'],
    maxRequests: 500,
    ignoredUrls: ['https://httpstat.us/other'],
    ignoredPatterns: [/^POST http:\/\/(192|10)/],
  });

  const [theme, setTheme] = useState<ThemeName>('dark');
  const isDark = theme === 'dark';

  const styles = themedStyles(isDark);

  const goBack = () => setUnmountNetworkLogger(true);

  const [unmountNetworkLogger, setUnmountNetworkLogger] = useState(false);

  const backHandler = getBackHandler(goBack);

  const remountButton = (
    <View>
      <Button
        title={'Re-open the network logger'}
        onPress={() => setUnmountNetworkLogger(false)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={backHandler}
          hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
        >
          <Text style={styles.backButtonText}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.title} accessibilityRole="header">
          react-native-network-logger
        </Text>
        <View style={styles.navButton} />
      </View>
      {(unmountNetworkLogger && remountButton) || (
        <NetworkLogger theme={theme} />
      )}
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
    header: {
      flexDirection: 'row',
    },
    navButton: {
      flex: 1,
    },
    backButtonText: {
      color: dark ? 'white' : 'black',
      paddingHorizontal: 20,
      fontSize: 30,
      fontWeight: 'bold',
    },
    title: {
      flex: 5,
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
