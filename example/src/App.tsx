import React, { useCallback, useLayoutEffect, useState } from 'react';
import {
  StyleSheet,
  Button,
  SafeAreaView,
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
import { getHero, getRates, getUser } from './apolloClient';

const formData = new FormData();
formData.append('test', 'hello');

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
  async () => fetch('https://httpstat.us/200', { method: 'HEAD' }),
  async () =>
    fetch('https://postman-echo.com/put', {
      method: 'PUT',
      body: JSON.stringify({ test: 'hello' }),
    }),
  async () => fetch('https://httpstat.us/200?sleep=300'),
  async () => fetch('https://httpstat.us/204?sleep=200'),
  async () => fetch('https://httpstat.us/302?sleep=200'),
  async () => fetch('https://httpstat.us/400?sleep=200'),
  async () => fetch('https://httpstat.us/401?sleep=200'),
  async () => fetch('https://httpstat.us/403?sleep=200'),
  async () => fetch('https://httpstat.us/404?sleep=400'),
  async () => fetch('https://httpstat.us/500?sleep=5000'),
  async () => fetch('https://httpstat.us/503?sleep=200'),
  async () => fetch('https://httpstat.us/504?sleep=10000'),

  // Non JSON response
  async () => fetch('https://postman-echo.com/stream/2'),

  async () => getRates(), // 405
  async () => getHero(), // 400
  async () => getUser(), // 200
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
      ignoredUrls: ['https://httpstat.us/other'],
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
  );
}

const themedStyles = (dark = false) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: dark ? '#2d2a28' : 'white',
      paddingTop: 0,
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
