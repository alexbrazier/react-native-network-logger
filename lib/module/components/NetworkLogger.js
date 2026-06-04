"use strict";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, BackHandler, Share, Text } from 'react-native';
import logger from "../loggerSingleton.js";
import { ThemeContext } from "../theme.js";
import { setBackHandler } from "../backHandler.js";
import RequestList from "./RequestList.js";
import RequestDetails from "./RequestDetails.js";
import createHar from "../utils/createHar.js";
import Unmounted from "./Unmounted.js";
import { AppContextProvider } from "./AppContext.js";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
const sortRequests = (requests, sort) => {
  if (sort === 'asc') {
    return requests.reverse();
  }
  return [...requests];
};
const NetworkLogger = ({
  theme = 'light',
  sort = 'desc',
  compact = false,
  maxRows
}) => {
  const [requests, setRequests] = useState(logger.getRequests());
  const [request, setRequest] = useState();
  const [showDetails, _setShowDetails] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [paused, setPaused] = useState(logger.isPaused);
  const setShowDetails = useCallback(shouldShow => {
    _setShowDetails(shouldShow);
    if (shouldShow) {
      setBackHandler(() => setShowDetails(false));
    } else {
      setBackHandler(undefined);
    }
  }, []);
  useEffect(() => {
    logger.setCallback(updatedRequests => {
      setRequests([...updatedRequests]);
    });
    logger.enableXHRInterception();
    setMounted(true);
    return () => {
      // no-op if component is unmounted
      logger.setCallback(() => {});
    };
  }, [sort]);
  useEffect(() => {
    const onBack = () => {
      if (showDetails) {
        setShowDetails(false);
        return true;
      }

      // Let default back handler take over
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => backHandler.remove();
  }, [showDetails, setShowDetails]);
  const getHar = useCallback(async () => {
    const har = await createHar(logger.getRequests());
    await Share.share({
      message: JSON.stringify(har)
    });
  }, []);
  const options = useMemo(() => {
    return [{
      text: paused ? 'Resume' : 'Pause',
      onPress: async () => {
        setPaused(prev => {
          logger.onPausedChange(!prev);
          return !prev;
        });
      }
    }, {
      text: 'Clear Logs',
      onPress: async () => {
        logger.clearRequests();
      }
    }, {
      text: 'Export all Logs',
      onPress: getHar
    }];
  }, [paused, getHar]);
  const requestsInfo = useMemo(() => {
    return sortRequests(requests, sort).map(r => r.toRow());
  }, [sort, requests]);
  return /*#__PURE__*/_jsx(ThemeContext.Provider, {
    value: theme,
    children: /*#__PURE__*/_jsx(AppContextProvider, {
      children: /*#__PURE__*/_jsxs(View, {
        style: styles.visible,
        children: [showDetails && !!request && /*#__PURE__*/_jsx(View, {
          style: styles.visible,
          children: /*#__PURE__*/_jsx(RequestDetails, {
            onClose: () => setShowDetails(false),
            request: request
          })
        }), /*#__PURE__*/_jsx(View, {
          style: showDetails && !!request ? styles.hidden : styles.visible,
          children: mounted && !logger.enabled && !requests.length ? /*#__PURE__*/_jsx(Unmounted, {}) : /*#__PURE__*/_jsxs(_Fragment, {
            children: [paused && /*#__PURE__*/_jsx(View, {
              style: styles.pausedBanner,
              children: /*#__PURE__*/_jsx(Text, {
                children: "Paused"
              })
            }), /*#__PURE__*/_jsx(RequestList, {
              compact: compact,
              requestsInfo: requestsInfo,
              options: options,
              showDetails: showDetails && !!request,
              maxRows: maxRows ?? requests.length,
              onPressItem: id => {
                setRequest(requests.find(r => r.id === id));
                setShowDetails(true);
              }
            })]
          })
        })]
      })
    })
  });
};
const styles = StyleSheet.create({
  visible: {
    flex: 1
  },
  hidden: {
    flex: 0
  },
  pausedBanner: {
    backgroundColor: '#ff7c7c',
    padding: 10,
    alignItems: 'center'
  }
});
export { NetworkLogger as default };
//# sourceMappingURL=NetworkLogger.js.map