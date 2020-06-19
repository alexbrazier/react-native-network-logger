import React, { Component } from 'react';
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

export default class RequestDetails extends Component<Props> {
  state = { content: '' };

  constructor(props: Props) {
    super(props);
    this.state = { content: this.getAll() };
  }

  getRequestHeader() {
    const request = this.props.request;
    let header = {
      ...request.requestHeaders,
      method: request.method,
      url: request.url,
    };
    if (request.requestHeaders !== undefined) {
      header = { ...header, ...request.requestHeaders };
    }
    return JSON.stringify(header, null, '\t');
  }

  getRequestBody() {
    try {
      return JSON.stringify(
        JSON.parse(this.props.request.dataSent),
        null,
        '\t'
      );
    } catch (e) {
      return this.props.request.dataSent;
    }
  }

  getAll() {
    return JSON.stringify(this.props.request, null, '\t');
  }

  getResponseBody() {
    try {
      return JSON.stringify(this.props.request.response, null, '\t');
    } catch (e) {
      return this.props.request.response;
    }
  }

  getResponseHeader() {
    const { request } = this.props;
    const header = {
      responseHeaders: request.responseHeaders,
      responseContentType: request.responseContentType,
      responseSize: request.responseSize,
      responseURL: request.responseURL,
      responseType: request.responseType,
    };
    return JSON.stringify(header, null, '\t');
  }

  render() {
    return (
      <View style={styles.container}>
        <ResultItem request={this.props.request} style={styles.info} />
        <ScrollView style={styles.scrollView}>
          <View style={styles.request}>
            <Headers
              title="Request Headers"
              headers={this.props.request.requestHeaders}
            />
            <Headers
              title="Response Headers"
              headers={this.props.request.responseHeaders}
            />
            <Header>Request Body</Header>
            <Text style={styles.content}>{this.getRequestBody()}</Text>
            <Header>Response Body</Header>
            <Text style={styles.content}>{this.getResponseBody()}</Text>
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={() => this.props.onClose()}
          style={styles.close}
        >
          <Text style={styles.closeTitle}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

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
