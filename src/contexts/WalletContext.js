import PropTypes from 'prop-types';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers, providers } from 'ethers';
// ----------------------------------------------------------------------

function getLibrary(provider, connector) {
  return new ethers.providers.Web3Provider(provider); // this will vary according to whether you use e.g. ethers or web3.js
}

WalletProvider.propTypes = {
  children: PropTypes.node
};

function WalletProvider({ children }) {
  return <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>;
}

export { WalletProvider };
