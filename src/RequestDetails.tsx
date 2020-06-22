import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
} from 'react-native';
import ResultItem from './ResultItem';
import type NetworkRequestInfo from './NetworkRequestInfo';
import { useThemedStyles, Theme } from './theme';
import Header from './Header';

interface Props {
  request: NetworkRequestInfo;
  onClose(): void;
}

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
      <Header shareContent={headers && JSON.stringify(headers, null, 2)}>
        {title}
      </Header>
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

  const requestBody = request.getRequestBody();

  const getFullRequest = () => {
    const processedRequest = {
      ...request,
      response: JSON.parse(responseBody),
      duration: request.duration,
    };
    return JSON.stringify(processedRequest, null, 2);
  };

  const getCurlRequest = () => {
    // TODO - currently wont work for every request
    let parsedHeaders =
      request.requestHeaders &&
      Object.entries(request.requestHeaders)
        .map(([key, value]) => `"${key}: ${value}"`)
        .join('-H ');
    if (parsedHeaders) {
      parsedHeaders = `-H ${parsedHeaders}`;
    }

    return `curl -X${request.method.toUpperCase()} ${parsedHeaders} '${
      request.url
    }'`;
  };

  return (
    <View style={styles.container}>
      <ResultItem request={request} style={styles.info} />
      <ScrollView style={styles.scrollView}>
        <Headers title="Request Headers" headers={request.requestHeaders} />
        <Headers title="Response Headers" headers={request.responseHeaders} />
        <Header shareContent={requestBody}>Request Body</Header>
        <Text style={styles.content}>{requestBody}</Text>
        <Header shareContent={responseBody}>Response Body</Header>
        <Text style={styles.content}>{responseBody}</Text>
        <Header>More</Header>
        <Button
          title="Share full request"
          onPress={() => Share.share({ message: getFullRequest() })}
        />
        <Button
          title="Share as cURL"
          onPress={() => Share.share({ message: getCurlRequest() })}
        />
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
    headerContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    headerKey: { fontWeight: 'bold', color: theme.colors.text },
    headerValue: { color: theme.colors.text },
    text: {
      fontSize: 16,
      color: theme.colors.text,
    },
    content: {
      backgroundColor: theme.colors.card,
      padding: 10,
      color: theme.colors.text,
    },
  });

export default RequestDetails;
