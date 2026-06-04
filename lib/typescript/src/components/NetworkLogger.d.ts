import React from 'react';
import { Theme, ThemeName } from '../theme';
import { DeepPartial } from '../types';
interface Props {
    theme?: ThemeName | DeepPartial<Theme>;
    sort?: 'asc' | 'desc';
    compact?: boolean;
    maxRows?: number;
}
declare const NetworkLogger: React.FC<Props>;
export { NetworkLogger as default, Props as NetworkLoggerProps };
//# sourceMappingURL=NetworkLogger.d.ts.map