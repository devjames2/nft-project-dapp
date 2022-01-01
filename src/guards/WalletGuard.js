import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
// hooks
import { useWeb3React } from '@web3-react/core';
import { injected } from '../hooks/connectors';
import { useEagerConnect } from '../hooks/useEagerConnect';
import { useInactiveListener } from '../hooks/useInactiveListener';
// import useWallet from '../hooks/useWallet';
import LoadingScreen, { ProgressBarStyle } from '../components/LoadingScreen';
import axios from '../utils/axios_real';

WalletGuard.propTypes = {
  children: PropTypes.node
};

export default function WalletGuard({ children }) {
  const location = useLocation();
  const [activatingConnector, setActivatingConnector] = useState();
  const [accountChanged, setAccountChanged] = useState();
  const { connector, activate, active, library, account, error } = useWeb3React();
  const triedEager = useEagerConnect();
  const currentConnector = injected;
  const activating = currentConnector === activatingConnector;
  const connected = currentConnector === connector;

  const accessToken = localStorage.getItem(`session_${account}`);
  axios.defaults.headers.common.Authorization = `${accessToken}`;

  // console.log(connector, activate, active, library, account, error);

  return <>{children}</>;
}
