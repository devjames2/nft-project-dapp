import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getUserList } from '../../redux/slices/user';
import { getLazyMintedItem } from '../../redux/slices/assets';
// routes
import { PATH_DASHBOARD, PATH_PAGE } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import AssetSellForm from '../../components/_dashboard/asset/AssetSellForm';

// ----------------------------------------------------------------------

export default function AssetSell() {
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { account, active } = useWeb3React();
  const { pathname } = useLocation();
  const { name, contractAddress, tokenId } = useParams();
  const { userList } = useSelector((state) => state.user);
  const { itemDetail, isLoading } = useSelector((state) => state.assets);
  const isEdit = pathname.includes('edit');
  const currentUser = userList.find((user) => paramCase(user.name) === name);

  useEffect(() => {
    dispatch(getUserList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getLazyMintedItem(contractAddress, tokenId));
  }, [dispatch]);

  useEffect(() => {
    console.log(itemDetail);
  }, [itemDetail]);

  useEffect(() => {
    console.log(account, active);
  }, [account, active]);

  console.log(contractAddress, tokenId);
  console.log(itemDetail);

  return (
    <Page title="Item: Sell the item | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'List item for sale' : 'Edit user'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Item', href: PATH_DASHBOARD.user.root },
            { name: !isEdit ? 'Sell' : name }
          ]}
        />
        {!isLoading && itemDetail && <AssetSellForm isEdit={isEdit} currentUser={currentUser} item={itemDetail} />}
      </Container>
    </Page>
  );
}
