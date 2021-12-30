/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes, { func } from 'prop-types';
// hooks
import { useWeb3React } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector';
import { ethers, providers } from 'ethers';
import { injected } from '../hooks/connectors';
import { useEagerConnect } from '../hooks/useEagerConnect';
import { useInactiveListener } from '../hooks/useInactiveListener';
// import useWallet from '../hooks/useWallet';
import LoadingScreen, { ProgressBarStyle } from '../components/LoadingScreen';
import axios from '../utils/axios_real';

WalletSignGuard.propTypes = {
  children: PropTypes.node
};

export default function WalletSignGuard({ children }) {
  const userToken = Object.entries(localStorage)
    .map((x) => x[0])
    .filter((x) => x.substring(0, 8) === 'session_');
  const location = useLocation();
  const [activatingConnector, setActivatingConnector] = useState();
  const [accountChanged, setAccountChanged] = useState();
  const [userHasSigned, setUserHasSigned] = useState(userToken.length > 0);
  const { connector, activate, active, library, account, error } = useWeb3React();
  const triedEager = useEagerConnect();
  const currentConnector = injected;
  const activating = currentConnector === activatingConnector;
  const connected = currentConnector === connector;
  const { ethereum } = window;

  // const handleAccountChanged = (accounts) => {
  //   console.log('accounts');
  //   console.log(accounts);
  // };

  // ethereum.on('accountChanged', handleAccountChanged);

  useEffect(() => {
    const isUserHasToken = userToken.length > 0;
    // console.log(triedEager);
    // console.log(connector);
    // console.log(activate);
    // console.log(active);
    // console.log(library);
    // console.log(account);
    // console.log(error);
    // console.log(`is user has a token?:${isUserHasToken}`);
    // console.log(ethereum.selectedAddress);
    // console.log(ethereum._state.accounts);
    if (error instanceof NoEthereumProviderError) {
      console.log(
        'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
      );
    }

    if (error instanceof UserRejectedRequestErrorInjected) {
      console.log('Please authorize this website to access your Ethereum account.');
    }

    // 사용자 지갑의 모든 계정과 사이트와의 연결이 없으면 초기화 해야한다.
    if (!ethereum.selectedAddress && !active && triedEager) {
      Object.entries(localStorage)
        .map((x) => x[0])
        .filter((x) => x.substring(0, 8) === 'session_')
        .map((x) => localStorage.removeItem(x));
    }

    // console.log(userHasSigned);
  }, [connector, activate, active, library, account, error]);

  useEffect(() => {
    // 사용자가 지갑과 사이트를 연결했다는 것을 감지할 수 있어야 한다.
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
    setAccountChanged(ethereum._state.accounts ? ethereum._state.accounts.length : -1);
    // token 을 삭제해야 하는 경우는,
    // 1. 사용자가 wallet connection 을 끊는 경우
    // 2. 사용자의 wallet 이 logout 된 경우
    if (accountChanged === 0) localStorage.removeItem(`session_${account}`);
  }, [active, error, triedEager, activate]);

  useEffect(() => {
    const token = localStorage.getItem(`session_${account}`);

    async function signMsg() {
      try {
        const nonceRes = await axios.get(`/auth?accountAddress=${account}`);
        // const accounts = await library.eth.getAccounts();
        // console.log(accounts);
        // console.log(typeof accounts[0]);
        // const tempAccount = '0x8eb9f52858d830ac99011eb1bdf7095b0ee3b958';
        // console.log(typeof tempAccount);
        const signature = await library.eth.personal.sign(
          `I am signing my one-time nonce: ${nonceRes.data.nonce}`,
          account,
          ''
        );
        console.log(`I am signing my one-time nonce: ${nonceRes.data.nonce}`, account, '');
        const jwtTokenRes = await axios.post(`/auth`, {
          accountAddress: account,
          signature,
          nonce: nonceRes.data.nonce
        });
        localStorage.setItem(`session_${account}`, jwtTokenRes.data.accessToken);
        axios.defaults.headers.common.Authorization = `${jwtTokenRes.data.accessToken}`;
        setUserHasSigned(true);
      } catch (error) {
        console.log(error);
      }

      // const byteMessage = library.utils.arrayify(`I am signing my one-time nonce: ${nonce}`).then((value) => value);
      // const hash = await ethers.utils.keccak256(`I am signing my one-time nonce: ${nonce}`);
      // const temp = new ethers.providers.Web3Provider(window.ethereum);
      // const sig = ethers.utils.arrayify(hash);
      // console.log(sig);
      // library
      //   .getSigner(account)
      //   .signMessage(hash)
      //   .then((signature) => {
      //     console.log({
      //       accountAddress: account,
      //       signature,
      //       nonce
      //     });
      //     const jwtTokenPromise = axios.post(`/auth`, {
      //       accountAddress: account,
      //       signature,
      //       nonce
      //     });
      //     jwtTokenPromise
      //       .then((res) => {
      //         console.log(res.data);
      //       })
      //       .catch(() => console.log);
      //     localStorage.setItem(`session_${account}`, signature);
      //     setUserHasSigned(true);
      //   })
      //   .catch((error) => {
      //     window.alert(`Failure!${error && error.message ? `\n\n${error.message}` : ''}`);
      //   });
    }

    // console.log(token);

    // 지갑연결은 되었으나 jwt token 이 없는 경우.
    if (active && !token) {
      signMsg();
    }
  }, [active]);

  // console.log(userToken);
  // console.log(userHasSigned);

  // 사용자가 지갑에 연결버튼을 클릭하는 중...
  if (activating)
    return (
      <>
        <LoadingScreen />
      </>
    );

  // 사용자가 아직 서명전이므로 loading screen 을 리턴한다.
  if (userToken.length === 0 && active) {
    return (
      <>
        <LoadingScreen />
      </>
    );
  }

  // TODO. 404 page 로 보내는 것과 wallet connect 화면으로 보낼 것으로 구분할 것.
  // 지갑의 어떤 계정과도 연결이 안된 상태
  if (error || (accountChanged === 0 && !active)) return <Navigate to="/" />;

  return <>{children}</>;
}
