import React from 'react';
interface Props {
    value: string;
    onChangeText(text: string): void;
    options: {
        text: string;
        onPress: () => Promise<void>;
    }[];
}
declare const SearchBar: React.FC<Props>;
export default SearchBar;
//# sourceMappingURL=SearchBar.d.ts.map