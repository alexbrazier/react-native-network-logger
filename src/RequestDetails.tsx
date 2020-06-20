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

interface Props {
  request: NetworkRequestInfo;
  onClose(): void;
}

const Header = ({ children }: { children: string }) => (
  <Text style={styles.header}>{children}</Text>
);

const Headers = ({
  title = 'Headers',
  headers,
}: {
  title: string;
  headers?: Object;
}) => (
  <View>
    <Header>{title}</Header>
    <View style={styles.content}>
      {Object.entries(headers || {}).map(([name, value]) => (
        <View style={styles.headerContainer} key={name}>
          <Text style={styles.headerKey}>{name}: </Text>
          <Text>{value}</Text>
        </View>
      ))}
    </View>
  </View>
);

const RequestDetails: React.FC<Props> = ({ request, onClose }) => {
  const [responseBody, setResponseBody] = useState('Loading...');

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
        <View style={styles.request}>
          <Headers title="Request Headers" headers={request.requestHeaders} />
          <Headers title="Response Headers" headers={request.responseHeaders} />
          <Header>Request Body</Header>
          <Text style={styles.content}>{request.getRequestBody()}</Text>
          <Header>Response Body</Header>
          <Text style={styles.content}>{responseBody}</Text>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={() => onClose()} style={styles.close}>
        <Text style={styles.closeTitle}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#ededed',
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
    color: '#0077ff',
  },
  scrollView: {
    width: '100%',
  },
  header: { fontWeight: 'bold', fontSize: 20, marginTop: 10, marginBottom: 5 },
  headerContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  headerKey: { fontWeight: 'bold' },
  request: { marginHorizontal: 10 },
  text: {
    fontSize: 16,
    color: 'black',
  },
  horizontal: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    flex: 1,
  },
  content: {
    backgroundColor: 'white',
    marginHorizontal: -10,
    padding: 10,
  },
});

export default RequestDetails;
