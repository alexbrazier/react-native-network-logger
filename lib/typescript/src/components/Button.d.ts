import React from 'react';
import { TouchableOpacityProps, StyleProp, ViewStyle, TextStyle } from 'react-native';
type Props = {
    children: string;
    fullWidth?: boolean;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
} & TouchableOpacityProps;
declare const Button: React.FC<Props>;
export default Button;
//# sourceMappingURL=Button.d.ts.map