import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Theme, useThemedStyles } from '../theme';

const Unmounted = () => {
  const styles = useThemedStyles(themedStyles);
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Unmounted Error</Text>
      <Text style={styles.body}>
        It looks like the network logger hasn’t been enabled yet.
      </Text>
      <Text style={styles.body}>
        This is likely due to you running another debugging tool that is also
        intercepting network requests. Either disable that or start the network
        logger with the option:{' '}
        <Text style={styles.code}>"forceEnable: true"</Text>.
      </Text>
    </View>
  );
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      padding: 15,
    },
    heading: {
      color: theme.colors.text,
      fontWeight: '600',
      fontSize: 25,
      marginBottom: 10,
    },
    body: {
      color: theme.colors.text,
      marginTop: 5,
    },
    code: {
      color: theme.colors.muted,
    },
  });

export default Unmounted;
