import React, { useEffect, useState } from 'react';
import logger from '../loggerSingleton';
import type NetworkRequestInfo from '../NetworkRequestInfo';
import { ThemeContext, ThemeName } from '../theme';
import RequestList from './RequestList';
import RequestDetails from './RequestDetails';

interface Props {
  theme?: ThemeName;
}

const NetworkLogger: React.FC<Props> = ({ theme = 'light' }) => {
  const [requests, setRequests] = useState(logger.getRequests());
  const [request, setRequest] = useState<NetworkRequestInfo>();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    logger.setCallback((updatedRequests: NetworkRequestInfo[]) => {
      setRequests([...updatedRequests]);
    });

    logger.enableXHRInterception();
  }, []);

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
