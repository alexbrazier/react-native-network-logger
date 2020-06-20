import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import ResultItem from './ResultItem';
import type NetworkRequestInfo from './NetworkRequestInfo';
import { useThemedStyles, Theme } from './theme';

interface Props {
  request: NetworkRequestInfo;
  onClose(): void;
}

const Header = ({ children }: { children: string }) => {
  const styles = useThemedStyles(themedStyles);
  return <Text style={styles.header}>{children}</Text>;
};

const Headers = ({
  title = 'Headers',
  headers,
}: {
  title: string;
  headers?: Object;
}) => {
  const styles = useThemedStyles(themedStyles);
  return (
    <View>
      <Header>{title}</Header>
      <View style={styles.content}>
        {Object.entries(headers || {}).map(([name, value]) => (
          <View style={styles.headerContainer} key={name}>
            <Text style={styles.headerKey}>{name}: </Text>
            <Text style={styles.headerValue}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const RequestDetails: React.FC<Props> = ({ request, onClose }) => {
  const [responseBody, setResponseBody] = useState('Loading...');
  const styles = useThemedStyles(themedStyles);

  useEffect(() => {
    (async () => {
      const body = await request.getResponseBody();
      setResponseBody(body);
    })();
  }, [request]);

  return (
    <View style={styles.container}>
      <ResultItem request={request} style={styles.info} />
      <ScrollView style={styles.scrollView}>
        <Headers title="Request Headers" headers={request.requestHeaders} />
        <Headers title="Response Headers" headers={request.responseHeaders} />
        <Header>Request Body</Header>
        <Text style={styles.content}>{request.getRequestBody()}</Text>
        <Header>Response Body</Header>
        <Text style={styles.content}>{responseBody}</Text>
      </ScrollView>
      <TouchableOpacity onPress={() => onClose()} style={styles.close}>
        <Text style={styles.closeTitle}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const themedStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    info: {
      margin: 0,
    },
    close: {
      position: 'absolute',
      right: 10,
      top: 10,
    },
    closeTitle: {
      fontSize: 18,
      color: theme.colors.link,
    },
    scrollView: {
      width: '100%',
    },
    header: {
      fontWeight: 'bold',
      fontSize: 20,
      marginTop: 10,
      marginBottom: 5,
      marginHorizontal: 10,
      color: theme.colors.text,
    },
    headerContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    headerKey: { fontWeight: 'bold', color: theme.colors.text },
    headerValue: { color: theme.colors.text },
    text: {
      fontSize: 16,
      color: theme.colors.text,
    },
    horizontal: {
      flexDirection: 'row',
      alignSelf: 'flex-start',
      flex: 1,
    },
    content: {
      backgroundColor: theme.colors.card,
      padding: 10,
      color: theme.colors.text,
    },
  });

export default RequestDetails;
