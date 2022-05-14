import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Share } from 'react-native';
import NetworkRequestInfo from '../NetworkRequestInfo';
import { useThemedStyles, Theme, ThemeName } from '../theme';
import { backHandlerSet } from '../backHandler';
import ResultItem from './ResultItem';
import Header from './Header';
import Button from './Button';
import JSONTree from 'react-native-json-tree';
import { DeepPartial } from 'src/types';

interface Props {
  request: NetworkRequestInfo;
  onClose(): void;
  theme?: ThemeName | DeepPartial<Theme>;
}

const isJson = (item: string) => {
  try {
    JSON.parse(item);
  } catch (error) {
    return false;
  }

  return true;
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

const LargeText: React.FC<{
  children: string;
  theme?: ThemeName | DeepPartial<Theme>;
}> = ({ children, theme }) => {
  const styles = useThemedStyles(themedStyles);

  // if (Platform.OS === 'ios') {
  //   /**
  //    * A readonly TextInput is used because large Text blocks sometimes don't render on iOS
  //    * See this issue https://github.com/facebook/react-native/issues/19453
  //    * Note: Even with the fix mentioned in the comments, text with ~10,000 lines still fails to render
  //    */
  //   return (
  //     <TextInput
  //       style={[styles.content, styles.largeContent]}
  //       multiline
  //       editable={false}
  //     >
  //       {children}
  //     </TextInput>
  //   );
  // }

  const jsonObject = isJson(children) ? JSON.parse(children) : String(children);

  return (
    <View style={styles.largeContent}>
      <ScrollView nestedScrollEnabled>
        <View>
          {/* <Text style={styles.content}>{children}</Text> */}
          <JSONTree
            data={jsonObject}
            theme={'isotope'}
            invertTheme={theme === 'light' ? true : false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const RequestDetails: React.FC<Props> = ({
  request,
  onClose,
  theme = 'light',
}) => {
  const [responseBody, setResponseBody] = useState('Loading...');
  const styles = useThemedStyles(themedStyles);

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
      <ResultItem request={request} style={styles.info} />
      <ScrollView style={styles.scrollView} nestedScrollEnabled>
        <Headers title="Request Headers" headers={request.requestHeaders} />
        <Header shareContent={requestBody}>Request Body</Header>
        <LargeText>{requestBody}</LargeText>
        <Headers title="Response Headers" headers={request.responseHeaders} />
        <Header shareContent={responseBody}>Response Body</Header>
        <LargeText theme={theme}>{responseBody}</LargeText>
        <Header>More</Header>
        <Button
          onPress={() => Share.share({ message: getFullRequest() })}
          fullWidth
        >
          Share full request
        </Button>
        <Button
          onPress={() => Share.share({ message: request.curlRequest })}
          fullWidth
        >
          Share as cURL
        </Button>
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
    largeContent: {
      maxHeight: 300,
    },
  });

export default RequestDetails;
