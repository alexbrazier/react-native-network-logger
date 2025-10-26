import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Share,
  TextInput,
  Platform,
} from 'react-native';
import NetworkRequestInfo from '../NetworkRequestInfo';
import { useThemedStyles, Theme } from '../theme';
import { backHandlerSet } from '../backHandler';
import ResultItem from './ResultItem';
import Header from './Header';
import Button from './Button';

interface Props {
  request: NetworkRequestInfo;
  onClose(): void;
  compact?: boolean;
}

const Headers = ({
  title = 'Headers',
  headers = {},
}: {
  title: string;
  headers?: object;
}) => {
  const styles = useThemedStyles(themedStyles);
  const [expanded, setExpanded] = useState(true);
  return (
    <View>
      <Header
        collapsible
        expanded={expanded}
        onToggle={() => setExpanded((e) => !e)}
        shareContent={headers && JSON.stringify(headers, null, 2)}
      >
        {title}
      </Header>
      {expanded && (
        <View style={styles.content}>
          {Object.entries(headers).map(([name, value], index) => (
            <View
              key={name}
              style={[
                styles.headerContainer,
                index % 2 !== 0 && styles.headerOddEntries,
              ]}
            >
              <Text style={[styles.baseText, styles.headerKey]}>{name}: </Text>
              <Text style={[styles.baseText, styles.headerValue]}>{value}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const LargeText: React.FC<{ children: string }> = ({ children }) => {
  const styles = useThemedStyles(themedStyles);

  if (Platform.OS === 'ios') {
    /**
     * A readonly TextInput is used because large Text blocks sometimes don't render on iOS
     * See this issue https://github.com/facebook/react-native/issues/19453
     * Note: Even with the fix mentioned in the comments, text with ~10,000 lines still fails to render
     */
    return (
      <TextInput
        style={[styles.baseText, styles.content, styles.largeContent]}
        multiline
        editable={false}
        value={children}
      />
    );
  }

  return (
    <View style={styles.largeContent}>
      <ScrollView nestedScrollEnabled>
        <Text style={[styles.baseText, styles.content]} selectable>
          {children}
        </Text>
      </ScrollView>
    </View>
  );
};

const RequestDetails: React.FC<Props> = ({
  request,
  onClose,
  compact = false,
}) => {
  const [responseBody, setResponseBody] = useState('Loading...');
  const styles = useThemedStyles(themedStyles);
  const [requestBodyExpanded, setRequestBodyExpanded] = useState(true);
  const [responseBodyExpanded, setResponseBodyExpanded] = useState(true);

  useEffect(() => {
    (async () => {
      const body = await request.getResponseBody();
      setResponseBody(body);
    })();
  }, [request]);

  const requestBody = request.getRequestBody(!!request.gqlOperation);

  const getFullRequest = () => {
    let response;
    if (responseBody) {
      try {
        response = JSON.parse(responseBody);
      } catch {
        response = `${responseBody}`;
      }
    }
    const processedRequest = {
      ...request,
      response,
      duration: request.duration,
    };
    return JSON.stringify(processedRequest, null, 2);
  };

  return (
    <View style={styles.container}>
      <ResultItem request={request} style={styles.info} compact={compact} />
      <ScrollView style={styles.scrollView} nestedScrollEnabled>
        <Headers title="Request Headers" headers={request.requestHeaders} />
        <Header
          collapsible
          shareContent={requestBody}
          expanded={requestBodyExpanded}
          onToggle={() => setRequestBodyExpanded((e) => !e)}
        >
          Request Body
        </Header>
        {requestBodyExpanded && <LargeText>{requestBody}</LargeText>}
        <Headers title="Response Headers" headers={request.responseHeaders} />
        <Header
          collapsible
          shareContent={responseBody}
          expanded={responseBodyExpanded}
          onToggle={() => setResponseBodyExpanded((e) => !e)}
        >
          Response Body
        </Header>
        {responseBodyExpanded && <LargeText>{responseBody}</LargeText>}
        <View style={styles.moreButtons}>
          <Button
            onPress={() => Share.share({ message: getFullRequest() })}
            textStyle={styles.buttonText}
          >
            Share full request
          </Button>
          <Button
            onPress={() => Share.share({ message: request.curlRequest })}
            textStyle={styles.buttonText}
          >
            Share as cURL
          </Button>
        </View>
      </ScrollView>
      {!backHandlerSet() && (
        <Button onPress={onClose} style={styles.close}>
          Close
        </Button>
      )}
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
      paddingBottom: 10,
    },
    info: {
      margin: 0,
    },
    close: {
      position: 'absolute',
      right: 10,
      top: 0,
    },
    scrollView: {
      width: '100%',
    },
    baseText: {
      fontFamily: Platform.select({
        ios: 'Menlo',
        android: 'monospace',
      }),
      color: theme.colors.text,
    },
    headerContainer: {
      padding: 4,
      borderRadius: 4,
      flexWrap: 'wrap',
      flexDirection: 'row',
    },
    headerOddEntries: {
      backgroundColor: `${theme.colors.background}33`,
    },
    headerKey: {
      fontSize: 13,
      fontWeight: 'bold',
    },
    headerValue: {
      fontSize: 12,
    },
    content: {
      backgroundColor: theme.colors.card,
      padding: 10,
    },
    largeContent: {
      maxHeight: 350,
    },
    moreButtons: {
      gap: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      fontSize: 16,
    },
  });

export default RequestDetails;
