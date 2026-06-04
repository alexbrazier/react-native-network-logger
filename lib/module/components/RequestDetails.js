"use strict";

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Share, TouchableOpacity, Platform, TextInput } from 'react-native';
import JSONTree from 'react-native-json-tree';
import { useThemedStyles, useTheme } from "../theme.js";
import { backHandlerSet } from "../backHandler.js";
import ResultItem from "./ResultItem.js";
import Header from "./Header.js";
import Button from "./Button.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const TABS = [{
  key: 'responseBody',
  label: 'Response Body'
}, {
  key: 'requestHeaders',
  label: 'Request Headers'
}, {
  key: 'requestBody',
  label: 'Request Body'
}, {
  key: 'responseHeaders',
  label: 'Response Headers'
}, {
  key: 'more',
  label: 'More'
}];
const TabBar = ({
  activeTab,
  onTabPress
}) => {
  const styles = useThemedStyles(themedStyles);
  const scrollRef = useRef(null);
  return /*#__PURE__*/_jsx(View, {
    style: styles.tabBarContainer,
    children: /*#__PURE__*/_jsx(ScrollView, {
      ref: scrollRef,
      horizontal: true,
      showsHorizontalScrollIndicator: false,
      contentContainerStyle: styles.tabBarContent,
      children: TABS.map(tab => /*#__PURE__*/_jsx(TouchableOpacity, {
        style: [styles.tab, activeTab === tab.key && styles.activeTab],
        onPress: () => onTabPress(tab.key),
        accessibilityRole: "tab",
        accessibilityState: {
          selected: activeTab === tab.key
        },
        children: /*#__PURE__*/_jsx(Text, {
          style: [styles.tabText, activeTab === tab.key && styles.activeTabText],
          children: tab.label
        })
      }, tab.key))
    })
  });
};
const JsonContent = ({
  data,
  raw
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
      base0F: theme.colors.statusBad
    };
    return /*#__PURE__*/_jsx(View, {
      style: styles.jsonTreeContainer,
      children: /*#__PURE__*/_jsx(JSONTree, {
        data: data,
        theme: jsonTheme,
        invertTheme: false,
        hideRoot: true
      })
    });
  }
  return /*#__PURE__*/_jsx(PlainText, {
    children: raw
  });
};
const PlainText = ({
  children
}) => {
  const styles = useThemedStyles(themedStyles);
  if (Platform.OS === 'ios') {
    return /*#__PURE__*/_jsx(TextInput, {
      style: [styles.content, styles.plainTextContent],
      multiline: true,
      editable: false,
      value: children
    });
  }
  return /*#__PURE__*/_jsx(View, {
    style: styles.plainTextContent,
    children: /*#__PURE__*/_jsx(ScrollView, {
      nestedScrollEnabled: true,
      children: /*#__PURE__*/_jsx(View, {
        children: /*#__PURE__*/_jsx(Text, {
          style: styles.content,
          selectable: true,
          children: children
        })
      })
    })
  });
};
const HeadersTab = ({
  headers,
  title
}) => {
  const styles = useThemedStyles(themedStyles);
  return /*#__PURE__*/_jsxs(ScrollView, {
    style: styles.tabContent,
    children: [/*#__PURE__*/_jsx(Header, {
      shareContent: headers && JSON.stringify(headers, null, 2),
      children: title
    }), /*#__PURE__*/_jsxs(View, {
      style: styles.content,
      children: [Object.entries(headers || {}).map(([name, value]) => /*#__PURE__*/_jsxs(View, {
        style: styles.headerContainer,
        children: [/*#__PURE__*/_jsxs(Text, {
          style: styles.headerKey,
          children: [name, ": "]
        }), /*#__PURE__*/_jsx(Text, {
          style: styles.headerValue,
          children: value
        })]
      }, name)), Object.keys(headers || {}).length === 0 && /*#__PURE__*/_jsx(Text, {
        style: styles.emptyText,
        children: "No headers"
      })]
    })]
  });
};
const BodyTab = ({
  body,
  title
}) => {
  const styles = useThemedStyles(themedStyles);
  let parsed = null;
  try {
    parsed = JSON.parse(body);
  } catch {
    // not JSON
  }
  return /*#__PURE__*/_jsxs(ScrollView, {
    style: styles.tabContent,
    children: [/*#__PURE__*/_jsx(Header, {
      shareContent: body,
      children: title
    }), /*#__PURE__*/_jsx(JsonContent, {
      data: parsed,
      raw: body
    })]
  });
};
const MoreTab = ({
  request,
  responseBody
}) => {
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
      duration: request.duration
    };
    return JSON.stringify(processedRequest, null, 2);
  };
  return /*#__PURE__*/_jsxs(ScrollView, {
    style: styles.tabContent,
    children: [/*#__PURE__*/_jsx(Header, {
      children: "More"
    }), /*#__PURE__*/_jsx(Button, {
      onPress: () => Share.share({
        message: getFullRequest()
      }),
      fullWidth: true,
      children: "Share full request"
    }), /*#__PURE__*/_jsx(Button, {
      onPress: () => Share.share({
        message: request.curlRequest
      }),
      fullWidth: true,
      children: "Share as cURL"
    })]
  });
};
const RequestDetails = ({
  request,
  onClose
}) => {
  const [responseBody, setResponseBody] = useState('Loading...');
  const [activeTab, setActiveTab] = useState('responseBody');
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
        return /*#__PURE__*/_jsx(BodyTab, {
          body: responseBody,
          title: "Response Body"
        });
      case 'requestHeaders':
        return /*#__PURE__*/_jsx(HeadersTab, {
          headers: request.requestHeaders,
          title: "Request Headers"
        });
      case 'requestBody':
        return /*#__PURE__*/_jsx(BodyTab, {
          body: requestBody,
          title: "Request Body"
        });
      case 'responseHeaders':
        return /*#__PURE__*/_jsx(HeadersTab, {
          headers: request.responseHeaders,
          title: "Response Headers"
        });
      case 'more':
        return /*#__PURE__*/_jsx(MoreTab, {
          request: request,
          responseBody: responseBody
        });
    }
  };
  return /*#__PURE__*/_jsxs(View, {
    style: styles.container,
    children: [/*#__PURE__*/_jsx(ResultItem, {
      request: request,
      style: styles.info
    }), /*#__PURE__*/_jsx(TabBar, {
      activeTab: activeTab,
      onTabPress: setActiveTab
    }), /*#__PURE__*/_jsx(View, {
      style: styles.tabContentWrapper,
      children: renderTabContent()
    }), !backHandlerSet() && /*#__PURE__*/_jsx(Button, {
      onPress: onClose,
      style: styles.close,
      children: "Close"
    })]
  });
};
const themedStyles = theme => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingBottom: 10
  },
  info: {
    margin: 0,
    maxHeight: 150
  },
  close: {
    position: 'absolute',
    right: 10,
    top: 0
  },
  tabBarContainer: {
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.muted + '40'
  },
  tabBarContent: {
    paddingHorizontal: 4
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 2,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  activeTab: {
    borderBottomColor: theme.colors.link
  },
  tabText: {
    fontSize: 14,
    color: theme.colors.muted,
    fontWeight: '500'
  },
  activeTabText: {
    color: theme.colors.link,
    fontWeight: '600'
  },
  tabContentWrapper: {
    flex: 1
  },
  tabContent: {
    flex: 1
  },
  headerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  headerKey: {
    fontWeight: 'bold',
    color: theme.colors.text
  },
  headerValue: {
    color: theme.colors.text
  },
  content: {
    backgroundColor: theme.colors.card,
    padding: 10,
    color: theme.colors.text
  },
  plainTextContent: {
    flex: 1
  },
  jsonTreeContainer: {
    backgroundColor: theme.colors.card,
    padding: 10
  },
  emptyText: {
    color: theme.colors.muted,
    fontStyle: 'italic'
  }
});
export default RequestDetails;
//# sourceMappingURL=RequestDetails.js.map