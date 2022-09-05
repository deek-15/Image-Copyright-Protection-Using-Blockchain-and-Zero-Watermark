import React, { createContext, useContext, useReducer } from 'react'

const initialState = {
    web3: null,
    contract: null,
    accounts: null
}

const reducer = (action, state) => {
    switch (action.type) {
        case "LOAD_STATE":
            return {
                web3: action.payload.web3,
                contract: action.payload.contract,
                accounts: action.payload.accounts
            };
        default:
            return state;
    }
}

export const StateContext = createContext();

const StateProvider = ({ children }) => {
    return (
        <StateContext.Provider value={useReducer(reducer, initialState)}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateValue = () => useContext(StateContext);

export default StateProvider;