import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils


// ----------------------------------------------------------------------

const WalletContext = createContext({
  web3Tasks: () => Promise.resolve()
});

WalletProvider