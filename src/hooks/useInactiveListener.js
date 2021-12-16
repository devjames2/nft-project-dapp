import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import { useNavigate } from 'react-router-dom';
import { injected } from './connectors';

export function useInactiveListener(suppress = false, accountsChanged) {
  console.log(accountsChanged);
  const { active, error, activate } = useWeb3React();
  const [accountChanged, setAccountChanged] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event");
        activate(injected);
      };
      const handleChainChanged = (chainId) => {
        console.log("Handling 'chainChanged' event with payload", chainId);
        activate(injected);
      };
      const handleAccountsChanged = (accounts) => {
        accountsChanged(accounts);
        console.log("Handling 'accountsChansdfsdfged' event with payload", accounts);
        if (accounts.length > 0) {
          activate(injected);
        }
      };
      const handleNetworkChanged = (networkId) => {
        console.log("Handling 'networkChanged' event with payload", networkId);
        activate(injected);
      };

      ethereum.on('connect', handleConnect);
      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('networkChanged', handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect);
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('networkChanged', handleNetworkChanged);
        }
      };
    }
  }, [active, error, suppress, activate]);

  return accountChanged;
}
