import React from 'react';
import { DeepPartial } from './types';
export type ThemeName = 'light' | 'dark';
export declare const ThemeContext: React.Context<ThemeName | DeepPartial<Theme>>;
export type Theme = {
    colors: {
        background: string;
        link: string;
        card: string;
        text: string;
        statusGood: string;
        statusWarning: string;
        statusBad: string;
        secondary: string;
        onSecondary: string;
        muted: string;
    };
};
export declare const useTheme: () => Theme;
export declare const useThemedStyles: <T>(styles: (theme: Theme) => T) => T;
//# sourceMappingURL=theme.d.ts.map