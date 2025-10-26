import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Share,
  Platform,
} from 'react-native';
import NetworkRequestInfo from '../NetworkRequestInfo';
import { useThemedStyles, Theme } from '../theme';
import { backHandlerSet } from '../backHandler';
import ResultItem from './ResultItem';
import Header from './Header';
import Button from './Button';
import BodyViewer from './BodyViewer';

interface Props {
  request: NetworkRequestInfo;
  onClose(): void;
  compact?: boolean;
  initialRequestHeadersExpanded?: boolean;
  initialResponseHeadersExpanded?: boolean;
  initialRequestBodyExpanded?: boolean;
  initialResponseBodyExpanded?: boolean;
}

const Headers = ({
  title = 'Headers',
  headers = {},
  initiallyExpanded = true,
}: {
  title: string;
  headers?: object;
  initiallyExpanded?: boolean;
}) => {
  const styles = useThemedStyles(themedStyles);
  const [expanded, setExpanded] = useState(initiallyExpanded);
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

const RequestDetails: React.FC<Props> = ({
  request,
  onClose,
  compact = false,
  initialRequestHeadersExpanded = true,
  initialResponseHeadersExpanded = true,
  initialRequestBodyExpanded = true,
  initialResponseBodyExpanded = true,
}) => {
  const [responseBody, setResponseBody] = useState('Loading...');
  const styles = useThemedStyles(themedStyles);
  const [requestBodyExpanded, setRequestBodyExpanded] = useState(
    initialRequestBodyExpanded
  );
  const [responseBodyExpanded, setResponseBodyExpanded] = useState(
    initialResponseBodyExpanded
  );

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
        <Headers
          title="Request Headers"
          headers={request.requestHeaders}
          initiallyExpanded={initialRequestHeadersExpanded}
        />
        <Header
          collapsible
          shareContent={requestBody}
          expanded={requestBodyExpanded}
          onToggle={() => setRequestBodyExpanded((e) => !e)}
        >
          Request Body
        </Header>
        {requestBodyExpanded && (
          <BodyViewer
            content={requestBody}
            initiallyExpanded={initialRequestBodyExpanded}
          />
        )}
        <Headers
          title="Response Headers"
          headers={request.responseHeaders}
          initiallyExpanded={initialResponseHeadersExpanded}
        />
        <Header
          collapsible
          shareContent={responseBody}
          expanded={responseBodyExpanded}
          onToggle={() => setResponseBodyExpanded((e) => !e)}
        >
          Response Body
        </Header>
        {responseBodyExpanded && (
          <BodyViewer
            content={responseBody}
            initiallyExpanded={initialResponseBodyExpanded}
          />
        )}
        <View style={styles.moreActionsContainer}>
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
    moreActionsContainer: {
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
