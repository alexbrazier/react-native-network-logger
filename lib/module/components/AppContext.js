"use strict";

import React, { useContext, useReducer } from 'react';
import { jsx as _jsx } from "react/jsx-runtime";
const initialFilter = {
  methods: new Set()
};
const initialState = {
  search: '',
  filter: initialFilter,
  filterActive: false
};
const AppContext = /*#__PURE__*/React.createContext({
  ...initialState,
  // @ts-ignore
  dispatch: {}
});
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_SEARCH':
      return {
        ...state,
        search: action.payload
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload,
        filterActive: !!action.payload.methods?.size || !!action.payload.status || !!action.payload.statusErrors
      };
    case 'CLEAR_FILTER':
      return {
        ...state,
        filter: initialFilter,
        filterActive: false
      };
    default:
      return state;
  }
};
export const useAppContext = () => useContext(AppContext);
export const useDispatch = () => useAppContext().dispatch;
export const AppContextProvider = ({
  children
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return /*#__PURE__*/_jsx(AppContext.Provider, {
    value: {
      ...state,
      dispatch
    },
    children: children
  });
};
export default AppContext;
//# sourceMappingURL=AppContext.js.map