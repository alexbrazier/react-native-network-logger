import React, { Dispatch } from 'react';
type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';
declare const initialFilter: {
    methods: Set<Method>;
};
type Filter = {
    methods?: typeof initialFilter.methods;
    status?: number;
    statusErrors?: boolean;
};
interface AppState {
    search: string;
    filter: Filter;
    filterActive: boolean;
}
type Action = {
    type: 'SET_SEARCH';
    payload: string;
} | {
    type: 'SET_FILTER';
    payload: Filter;
} | {
    type: 'CLEAR_FILTER';
};
declare const AppContext: React.Context<AppState & {
    dispatch: Dispatch<Action>;
}>;
export declare const useAppContext: () => AppState & {
    dispatch: Dispatch<Action>;
};
export declare const useDispatch: () => React.Dispatch<Action>;
export declare const AppContextProvider: ({ children, }: {
    children: React.ReactNode;
}) => React.JSX.Element;
export default AppContext;
//# sourceMappingURL=AppContext.d.ts.map