import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import NetworkRequestInfo from '../NetworkRequestInfo';
import { Theme, useThemedStyles, useTheme } from '../theme';
import { backHandlerSet } from '../backHandler';

interface Props {
  request: NetworkRequestInfo;
  onPress?(): void;
  style?: any;
}

const ResultItem: React.FC<Props> = ({ style, request, onPress }) => {
  const styles = useThemedStyles(themedStyles);
  const theme = useTheme();
  const onDetailsPage = !onPress;
  const getUrlTextColor = (status: number) => {
    if (status >= 400) {
      return {
        color: getStatusTextColor(status),
      };
    }
    return {};
  };
  const getStatusTextColor = (status: number) => {
    if (status < 0) {
      return theme.colors.text;
    }
    if (status < 400) {
      return theme.colors.statusGood;
    }
    if (status < 500) {
      return theme.colors.statusWarning;
    }
    return theme.colors.statusBad;
  };

  const getStatusStyles = (status: number) => ({
    color: getStatusTextColor(status),
    borderColor: getStatusTextColor(status),
  });

  const MaybeTouchable: any = onPress ? TouchableOpacity : View;

  const status = request.status > 0 ? request.status : '-';

  const pad = (num: number) => `0${num}`.slice(-2);

  const getTime = (time: number) => {
    const date = new Date(time);
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${hours}:${minutes}:${seconds}`;
  };

  const gqlOperation = request.gqlOperation;

  return (
    <MaybeTouchable
      style={[styles.container, style]}
      {...(onPress && { accessibilityRole: 'button', onPress })}
    >
      <View style={styles.leftContainer}>
        <Text
          style={[styles.text, styles.method]}
          accessibilityLabel={`Method: ${request.method}`}
        >
          {request.method}
        </Text>
        <Text
          style={[styles.status, getStatusStyles(request.status)]}
          accessibilityLabel={`Response status ${status}`}
        >
          {status}
        </Text>
        <Text style={styles.text}>
          {request.duration > 0 ? `${request.duration}ms` : 'pending'}
        </Text>
        <Text style={styles.time}>{getTime(request.startTime)}</Text>
      </View>
      <View style={[styles.content]}>
        <Text
          style={[
            styles.text,
            getUrlTextColor(request.status),
            onDetailsPage && !backHandlerSet() && styles.paddedUrl,
          ]}
        >
          {request.url}
        </Text>
        {gqlOperation && (
          <View style={styles.gqlOperation}>
            <Text style={[styles.text, styles.gqlText]}>
              gql: {gqlOperation}
            </Text>
          </View>
        )}
      </View>
    </MaybeTouchable>
  );
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
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
      color: theme.colors.text,
      fontSize: 16,
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
    time: {
      color: theme.colors.muted,
      marginTop: 5,
      marginHorizontal: 2,
    },
    paddedUrl: {
      paddingVertical: 20,
    },
    gqlOperation: {
      backgroundColor: theme.colors.secondary,
      borderRadius: 10,
      alignSelf: 'flex-start',
      padding: 5,
      marginTop: 5,
    },
    gqlText: {
      color: theme.colors.onSecondary,
      fontSize: 14,
    },
  });

export default ResultItem;
