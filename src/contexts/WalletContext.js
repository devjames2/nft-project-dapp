import PropTypes from 'prop-types';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers, providers } from 'ethers';
import Web3 from 'web3';
// ----------------------------------------------------------------------

function getLibrary(provider, connector) {
  // const library = new ethers.providers.Web3Provider(provider); // this will vary according to whether you use e.g. ethers or web3.js
  console.log(provider);
  const library = new Web3(provider);
  // library.pollingInterval = 12000;
  return library;
}

WalletProvider.propTypes = {
  children: PropTypes.node
};

function WalletProvider({ children }) {
  return <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>;
}

export { WalletProvider };
