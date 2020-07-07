import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
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
      {showDetails && request ? (
        <RequestDetails
          onClose={() => setShowDetails(false)}
          request={request}
        />
      ) : (
        <RequestList
          requests={requests}
          onShowMore={showMore}
          onPressItem={(item) => {
            setRequest(item);
            setShowDetails(true);
          }}
        />
      )}
    </ThemeContext.Provider>
  );
};

export default NetworkLogger;
