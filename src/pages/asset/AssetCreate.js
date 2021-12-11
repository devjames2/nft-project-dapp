import { useWeb3React } from '@web3-react/core';
// ----------------------------------------------------------------------

export default function AssetCreate() {
  const { account } = useWeb3React();

  return (
    <>
      <div>create page</div>
      <div>Account: {account}</div>
    </>
  );
}
