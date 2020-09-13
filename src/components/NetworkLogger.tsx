import React, { useEffect, useState } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import logger from '../loggerSingleton';
import NetworkRequestInfo from '../NetworkRequestInfo';
import { ThemeContext, ThemeName } from '../theme';
import RequestList from './RequestList';
import RequestDetails from './RequestDetails';

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
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    logger.setCallback((updatedRequests: NetworkRequestInfo[]) => {
      setRequests(sortRequests(updatedRequests, sort));
    });

    logger.enableXHRInterception();
  }, [sort]);

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
