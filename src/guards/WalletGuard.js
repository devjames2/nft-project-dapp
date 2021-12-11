import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
// hooks
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
// import useWallet from '../hooks/useWallet';

WalletGuard.propTypes = {
  children: PropTypes.node
};

export default function WalletGuard({ children }) {
  const { connector, activate, active } = useWeb3React();
  const injected = new InjectedConnector();
  console.log(connector);
  if (connector) {
    console.log(connector);
    console.log(children);
    return <>{children}</>;
  }
  activate(injected);
  return <></>;
}
