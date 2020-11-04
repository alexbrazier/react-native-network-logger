import React, { useEffect, useState, useCallback } from 'react';
import { Alert, View, StyleSheet, BackHandler } from 'react-native';
import logger from '../loggerSingleton';
import NetworkRequestInfo from '../NetworkRequestInfo';
import { ThemeContext, ThemeName } from '../theme';
import RequestList from './RequestList';
import RequestDetails from './RequestDetails';
import { setBackHandler } from '../backHandler';

interface Props {
  theme?: ThemeName;
  sort?: 'asc' | 'desc';
}

const sortRequests = (requests: NetworkRequestInfo[], sort: 'asc' | 'desc') => {
  if (sort === 'asc') {
    return requests.reverse();
  }
  return [...requests];
};

const NetworkLogger: React.FC<Props> = ({ theme = 'light', sort = 'desc' }) => {
  const [requests, setRequests] = useState(
    sortRequests(logger.getRequests(), sort)
  );
  const [request, setRequest] = useState<NetworkRequestInfo>();
  const [showDetails, _setShowDetails] = useState(false);

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
      setRequests(sortRequests(updatedRequests, sort));
    });

    logger.enableXHRInterception();

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

  const showMore = () => {
    Alert.alert('More Options', undefined, [
      {
        text: 'Clear Logs',
        onPress: () => logger.clearRequests(),
        style: 'destructive',
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

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
          <RequestList
            requests={requests}
            onShowMore={showMore}
            showDetails={showDetails && !!request}
            onPressItem={(item) => {
              setRequest(item);
              setShowDetails(true);
            }}
          />
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
});

export default NetworkLogger;
