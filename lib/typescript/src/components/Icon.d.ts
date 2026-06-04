import React from 'react';
import { Image, TouchableOpacityProps } from 'react-native';
declare const icons: {
    close: any;
    filter: any;
    more: any;
    search: any;
    share: any;
};
type ButtonProps = {
    onPress?: never;
    accessibilityLabel?: string;
} | ({
    onPress: () => void;
    accessibilityLabel: string;
} & TouchableOpacityProps);
type IconName = keyof typeof icons;
declare const Icon: ({ name, onPress, accessibilityLabel, iconStyle, ...rest }: {
    name: IconName;
    iconStyle?: Image["props"]["style"];
} & ButtonProps) => React.JSX.Element;
export default Icon;
//# sourceMappingURL=Icon.d.ts.map