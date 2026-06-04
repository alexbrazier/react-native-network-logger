import React from 'react';
import NetworkRequestInfo from '../NetworkRequestInfo';
import { NetworkRequestInfoRow } from '../types';
interface Props {
    requestsInfo: NetworkRequestInfoRow[];
    onPressItem: (item: NetworkRequestInfo['id']) => void;
    options: {
        text: string;
        onPress: () => Promise<void>;
    }[];
    showDetails: boolean;
    compact: boolean;
    maxRows: number;
}
declare const RequestList: React.FC<Props>;
export default RequestList;
//# sourceMappingURL=RequestList.d.ts.map