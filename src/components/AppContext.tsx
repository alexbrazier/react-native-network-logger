import React, { Dispatch, useContext, useReducer } from 'react';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';

const initialFilter = {
  methods: new Set<Method>(),
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

type Action =
  | {
      type: 'SET_SEARCH';
      payload: string;
    }
  | {
      type: 'SET_FILTER';
      payload: Filter;
    }
  | {
      type: 'CLEAR_FILTER';
    };

const initialState: AppState = {
  search: '',
  filter: initialFilter,
  filterActive: false,
};

const AppContext = React.createContext<
  AppState & { dispatch: Dispatch<Action> }
>({
  ...initialState,
  // @ts-ignore
  dispatch: {},
});

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_SEARCH':
      return {
        ...state,
        search: action.payload,
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload,
        filterActive:
          !!action.payload.methods?.size ||
          !!action.payload.status ||
          !!action.payload.statusErrors,
      };
    case 'CLEAR_FILTER':
      return {
        ...state,
        filter: initialFilter,
        filterActive: false,
      };
    default:
      return state;
  }
};

export const useAppContext = () => useContext(AppContext);
export const useDispatch = () => useAppContext().dispatch;

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
