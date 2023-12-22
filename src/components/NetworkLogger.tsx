import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, BackHandler, Share, Text } from 'react-native';
import logger from '../loggerSingleton';
import NetworkRequestInfo from '../NetworkRequestInfo';
import { Theme, ThemeContext, ThemeName } from '../theme';
import { setBackHandler } from '../backHandler';
import { DeepPartial } from '../types';
import RequestList from './RequestList';
import RequestDetails from './RequestDetails';
import createHar from '../utils/createHar';
import Unmounted from './Unmounted';

interface Props {
  theme?: ThemeName | DeepPartial<Theme>;
  sort?: 'asc' | 'desc';
  compact?: boolean;
  maxRows?: number;
}

const sortRequests = (requests: NetworkRequestInfo[], sort: 'asc' | 'desc') => {
  if (sort === 'asc') {
    return requests.reverse();
  }
  return [...requests];
};

const NetworkLogger: React.FC<Props> = ({
  theme = 'light',
  sort = 'desc',
  compact = false,
  maxRows,
}) => {
  const [requests, setRequests] = useState(logger.getRequests());
  const [request, setRequest] = useState<NetworkRequestInfo>();
  const [showDetails, _setShowDetails] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [paused, setPaused] = useState<boolean>(logger.paused);

  const setShowDetails = useCallback((shouldShow: boolean) => {
    _setShowDetails(shouldShow);

    if (shouldShow) {
      setBackHandler(() => setShowDetails(false));
    } else {
      setBackHandler(undefined);
    }
  }, []);

  useEffect(() => {
    logger.setCallback((updatedRequests: NetworkRequestInfo[]) => {
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

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBack
    );

    return () => backHandler.remove();
  }, [showDetails, setShowDetails]);

  const getHar = useCallback(async () => {
    const har = await createHar(logger.getRequests());
    await Share.share({
      message: JSON.stringify(har),
    });
  }, []);

  const options = useMemo(() => {
    return [
      {
        text: paused ? 'Resume' : 'Pause',
        onPress: () => {
          setPaused((prev: boolean) => {
            logger.paused = !prev;
            return !prev;
          });
        },
      },
      {
        text: 'Clear Logs',
        onPress: () => logger.clearRequests(),
      },
      {
        text: 'Export all Logs',
        onPress: getHar,
      },
    ];
  }, [paused, getHar]);

  const requestsInfo = useMemo(() => {
    return sortRequests(requests, sort).map((r) => r.toRow());
  }, [sort, requests]);

  return (
    <ThemeContext.Provider value={theme}>
      <View style={styles.visible}>
        {showDetails && !!request && (
          <View style={styles.visible}>
            <RequestDetails
              onClose={() => setShowDetails(false)}
              request={request}
            />
          </View>
        )}
        <View style={showDetails && !!request ? styles.hidden : styles.visible}>
          {mounted && !logger.enabled && !requests.length ? (
            <Unmounted />
          ) : (
            <>
              {paused && (
                <View style={styles.pausedBanner}>
                  <Text>Paused</Text>
                </View>
              )}
              <RequestList
                compact={compact}
                requestsInfo={requestsInfo}
                options={options}
                showDetails={showDetails && !!request}
                maxRows={maxRows ?? requests.length}
                onPressItem={(id) => {
                  setRequest(requests.find((r) => r.id === id));
                  setShowDetails(true);
                }}
              />
            </>
          )}
        </View>
      </View>
    </ThemeContext.Provider>
  );
};

const styles = StyleSheet.create({
  visible: {
    flex: 1,
  },
  hidden: {
    flex: 0,
  },
  pausedBanner: {
    backgroundColor: '#ff7c7c',
    padding: 10,
    alignItems: 'center',
  },
});

export { NetworkLogger as default, Props as NetworkLoggerProps };
