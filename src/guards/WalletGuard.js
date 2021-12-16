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

  useEffect(() => {
    if (!connected) {
      setActivatingConnector(currentConnector);
      activate(currentConnector);
    }
  }, []);

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  useEffect(() => {
    const { ethereum } = window;
    console.log(ethereum._state);
    setAccountChanged(ethereum._state.accounts ? ethereum._state.accounts.length : -1);
  }, [active, error, triedEager, activate]);

  if (activating)
    return (
      <>
        <LoadingScreen />
      </>
    );

  if (error || accountChanged === 0) return <Navigate to="/" />;

  return <>{children}</>;
}
