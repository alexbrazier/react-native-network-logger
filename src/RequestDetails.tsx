import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import ResultItem from './ResultItem';
import { colors } from './theme';
import NetworkRequestInfo from './NetworkRequestInfo';

interface Props {
  request: NetworkRequestInfo;
  onClose(): void;
}

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
      return JSON.stringify(this.props.request.dataSent, null, '\t');
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
      <View style={styles.shadow}>
        <View style={styles.container}>
          <ResultItem request={this.props.request} />
          <View style={styles.horizontal}>
            <View style={styles.tabArea}>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => this.setState({ content: this.getAll() })}
              >
                <Text style={styles.text}>ALL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tab}
                onPress={() =>
                  this.setState({
                    content: this.getRequestHeader(),
                  })
                }
              >
                <Text style={styles.text}>Request Header</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tab}
                onPress={() =>
                  this.setState({
                    content: this.getRequestBody(),
                  })
                }
              >
                <Text style={styles.text}>Request Body</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tab}
                onPress={() =>
                  this.setState({
                    content: this.getResponseHeader(),
                  })
                }
              >
                <Text style={styles.text}>Response Header</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tab}
                onPress={() =>
                  this.setState({
                    content: this.getResponseBody(),
                  })
                }
              >
                <Text style={styles.text}>Response Body</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.content}>
              <ScrollView>
                <Text style={styles.text}>{this.state.content}</Text>
              </ScrollView>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => this.props.onClose()}
          style={styles.close}
        >
          <Text style={styles.closeTitle}>X</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  shadow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: colors.shadow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    height: '90%',
    backgroundColor: colors.dark,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 5,
  },
  close: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: colors.white,
    right: 20,
    top: 20,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeTitle: {
    fontSize: 20,
  },
  text: {
    fontSize: 16,
    color: colors.white,
  },
  horizontal: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    flex: 1,
  },
  tabArea: {
    padding: 5,
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grey,
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8,
    padding: 5,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
  },
  content: {
    margin: 5,
    flex: 1,
  },
});
