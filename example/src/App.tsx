import React, { useCallback, useLayoutEffect, useState } from 'react';
import {
  StyleSheet,
  Button,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import NetworkLogger, {
  ThemeName,
  getBackHandler,
  startNetworkLogging,
  stopNetworkLogging,
} from 'react-native-network-logger';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { getTodos } from './apolloClient';

const formData = new FormData();
formData.append('test', 'hello');

const fetchStatus = async (status: number, sleepSeconds?: number) => {
  return fetch(`https://httpbin.org/status/${status}`, {
    headers: { 'X-HttpBin-Sleep': `${sleepSeconds || 0}` },
  });
};

const requests = [
  async () =>
    fetch(
      `https://postman-echo.com/post?query=${'some really long query that goes onto multiple lines so we can test what happens'.repeat(
        5
      )}`,
      {
        method: 'POST',
        body: JSON.stringify({ test: 'hello' }),
      }
    ),
  async () =>
    fetch('https://postman-echo.com/post?formData', {
      method: 'POST',
      body: formData,
    }),
  async () => fetch('https://httpbin.org/status/200', { method: 'HEAD' }),
  async () =>
    fetch('https://postman-echo.com/put', {
      method: 'PUT',
      body: JSON.stringify({ test: 'hello' }),
    }),
  async () => fetchStatus(200, 0.3),
  async () => fetchStatus(204, 0.2),
  async () => fetchStatus(302, 0.2),
  async () => fetchStatus(400, 0.2),
  async () => fetchStatus(401, 0.2),
  async () => fetchStatus(403, 0.2),
  async () => fetchStatus(404, 0.4),
  async () => fetchStatus(500, 5),
  async () => fetchStatus(503, 0.2),
  async () => fetchStatus(504, 10),

  // Non JSON response
  async () => fetch('https://postman-echo.com/stream/2'),

  async () => getTodos(),
  // Test requests that fail
  // async () => fetch('https://failingrequest'),
];

export default function App() {
  const maxRequests = 500;

  // randomly make requests
  const makeRequest = async () => {
    Promise.all(
      Array.from({ length: Math.min(maxRequests, 10) }).map((_) =>
        requests[Math.floor(Math.random() * requests.length)]()
      )
    );
  };

  const start = useCallback(() => {
    startNetworkLogging({
      ignoredHosts: ['127.0.0.1'],
      maxRequests,
      ignoredUrls: ['https://httpbin.org/status/other'],
      ignoredPatterns: [/^POST http:\/\/(192|10)/, /\/logs$/, /\/symbolicate$/],
    });
  }, []);

  const [unmountNetworkLogger, setUnmountNetworkLogger] = useState(false);

  // note: Logger is a singleton so it starts on the first render
  // useLayoutEffect is used to ensure the setup runs before the component mounts (useEffect is async)
  useLayoutEffect(() => {
    start();
    return () => {
      stopNetworkLogging();
    };
  }, [start, unmountNetworkLogger]);

  const [theme, setTheme] = useState<ThemeName>('dark');
  const isDark = theme === 'dark';

  const styles = themedStyles(isDark);

  const goBack = () => {
    stopNetworkLogging();
    setUnmountNetworkLogger(true);
  };

  const backHandler = getBackHandler(goBack);

  const remountButton = (
    <View>
      <Button
        title={'Re-open the network logger'}
        onPress={() => {
          setUnmountNetworkLogger(false);
        }}
      />
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={isDark ? '#2d2a28' : 'white'}
        />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.navButton}
            testID="backButton"
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
          <NetworkLogger theme={theme} maxRows={10} />
        )}
        <View style={styles.bottomView}>
          <Button
            title="Toggle Theme"
            onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          />
          <Button title="Make request" onPress={makeRequest} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const themedStyles = (dark = false) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: dark ? '#2d2a28' : 'white',
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
