import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Share,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';
import JSONTree from 'react-native-json-tree';
import NetworkRequestInfo from '../NetworkRequestInfo';
import { useThemedStyles, useTheme, Theme } from '../theme';
import { backHandlerSet } from '../backHandler';
import ResultItem from './ResultItem';
import Header from './Header';
import Button from './Button';

interface Props {
  request: NetworkRequestInfo;
  onClose(): void;
}

type TabKey =
  | 'responseBody'
  | 'requestHeaders'
  | 'requestBody'
  | 'responseHeaders'
  | 'more';

interface Tab {
  key: TabKey;
  label: string;
}

const TABS: Tab[] = [
  { key: 'responseBody', label: 'Response Body' },
  { key: 'requestHeaders', label: 'Request Headers' },
  { key: 'requestBody', label: 'Request Body' },
  { key: 'responseHeaders', label: 'Response Headers' },
  { key: 'more', label: 'More' },
];

const TabBar: React.FC<{
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
}> = ({ activeTab, onTabPress }) => {
  const styles = useThemedStyles(themedStyles);
  const scrollRef = useRef<ScrollView>(null);

  return (
    <View style={styles.tabBarContainer}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBarContent}
      >
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.activeTab,
            ]}
            onPress={() => onTabPress(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab.key }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const JsonContent: React.FC<{ data: any; raw: string }> = ({
  data,
  raw,
}) => {
  const theme = useTheme();
  const styles = useThemedStyles(themedStyles);

  if (data && typeof data === 'object') {
    const jsonTheme = {
      scheme: 'custom',
      base00: theme.colors.card,
      base01: theme.colors.background,
      base02: theme.colors.muted,
      base03: theme.colors.muted,
      base04: theme.colors.text,
      base05: theme.colors.text,
      base06: theme.colors.text,
      base07: theme.colors.text,
      base08: theme.colors.statusBad,
      base09: theme.colors.statusWarning,
      base0A: theme.colors.statusWarning,
      base0B: theme.colors.statusGood,
      base0C: theme.colors.secondary,
      base0D: theme.colors.link,
      base0E: theme.colors.secondary,
      base0F: theme.colors.statusBad,
    };

    return (
      <View style={styles.jsonTreeContainer}>
        <JSONTree
          data={data}
          theme={jsonTheme}
          invertTheme={false}
          hideRoot
        />
      </View>
    );
  }

  return <PlainText>{raw}</PlainText>;
};

const PlainText: React.FC<{ children: string }> = ({ children }) => {
  const styles = useThemedStyles(themedStyles);

  if (Platform.OS === 'ios') {
    return (
      <TextInput
        style={[styles.content, styles.plainTextContent]}
        multiline
        editable={false}
        value={children}
      />
    );
  }

  return (
    <View style={styles.plainTextContent}>
      <ScrollView nestedScrollEnabled>
        <View>
          <Text style={styles.content} selectable>
            {children}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const HeadersTab: React.FC<{ headers?: object; title: string }> = ({
  headers,
  title,
}) => {
  const styles = useThemedStyles(themedStyles);
  return (
    <ScrollView style={styles.tabContent}>
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
        {Object.keys(headers || {}).length === 0 && (
          <Text style={styles.emptyText}>No headers</Text>
        )}
      </View>
    </ScrollView>
  );
};

const BodyTab: React.FC<{ body: string; title: string }> = ({
  body,
  title,
}) => {
  const styles = useThemedStyles(themedStyles);

  let parsed: unknown = null;
  try {
    parsed = JSON.parse(body);
  } catch {
    // not JSON
  }

  return (
    <ScrollView style={styles.tabContent}>
      <Header shareContent={body}>{title}</Header>
      <JsonContent data={parsed} raw={body} />
    </ScrollView>
  );
};

const MoreTab: React.FC<{
  request: NetworkRequestInfo;
  responseBody: string;
}> = ({ request, responseBody }) => {
  const styles = useThemedStyles(themedStyles);

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
    <ScrollView style={styles.tabContent}>
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
  );
};

const RequestDetails: React.FC<Props> = ({ request, onClose }) => {
  const [responseBody, setResponseBody] = useState('Loading...');
  const [activeTab, setActiveTab] = useState<TabKey>('responseBody');
  const styles = useThemedStyles(themedStyles);

  useEffect(() => {
    (async () => {
      const body = await request.getResponseBody();
      setResponseBody(body);
    })();
  }, [request]);

  const requestBody = request.getRequestBody(!!request.gqlOperation);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'responseBody':
        return <BodyTab body={responseBody} title="Response Body" />;
      case 'requestHeaders':
        return (
          <HeadersTab
            headers={request.requestHeaders}
            title="Request Headers"
          />
        );
      case 'requestBody':
        return <BodyTab body={requestBody} title="Request Body" />;
      case 'responseHeaders':
        return (
          <HeadersTab
            headers={request.responseHeaders}
            title="Response Headers"
          />
        );
      case 'more':
        return <MoreTab request={request} responseBody={responseBody} />;
    }
  };

  return (
    <View style={styles.container}>
      <ResultItem request={request} style={styles.info} />
      <TabBar activeTab={activeTab} onTabPress={setActiveTab} />
      <View style={styles.tabContentWrapper}>{renderTabContent()}</View>
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
      paddingBottom: 10,
    },
    info: {
      margin: 0,
      maxHeight: 150,
    },
    close: {
      position: 'absolute',
      right: 10,
      top: 0,
    },
    tabBarContainer: {
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.muted + '40',
    },
    tabBarContent: {
      paddingHorizontal: 4,
    },
    tab: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      marginHorizontal: 2,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: theme.colors.link,
    },
    tabText: {
      fontSize: 14,
      color: theme.colors.muted,
      fontWeight: '500',
    },
    activeTabText: {
      color: theme.colors.link,
      fontWeight: '600',
    },
    tabContentWrapper: {
      flex: 1,
    },
    tabContent: {
      flex: 1,
    },
    headerContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    headerKey: { fontWeight: 'bold', color: theme.colors.text },
    headerValue: { color: theme.colors.text },
    content: {
      backgroundColor: theme.colors.card,
      padding: 10,
      color: theme.colors.text,
    },
    plainTextContent: {
      flex: 1,
    },
    jsonTreeContainer: {
      backgroundColor: theme.colors.card,
      padding: 10,
    },
    emptyText: {
      color: theme.colors.muted,
      fontStyle: 'italic',
    },
  });

export default RequestDetails;
