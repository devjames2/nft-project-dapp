import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getUserList } from '../../redux/slices/user';
// routes
import { PATH_DASHBOARD, PATH_PAGE } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import AssetNewForm from '../../components/_dashboard/asset/AssetNewForm';

// ----------------------------------------------------------------------

export default function AssetCreate() {
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { account, active } = useWeb3React();
  const { pathname } = useLocation();
  const { name } = useParams();
  const { userList } = useSelector((state) => state.user);
  const isEdit = pathname.includes('edit');
  const currentUser = userList.find((user) => paramCase(user.name) === name);

  useEffect(() => {
    dispatch(getUserList());
  }, [dispatch]);

  useEffect(() => {
    // if (!account && !active) {
    //   console.log('wallet disconnected');
    // }
    // console.log(account);
    // console.log(active);
  }, []);

  return (
    <Page title="User: Create a new user | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create New Item' : 'Edit user'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Item', href: PATH_DASHBOARD.user.root },
            { name: !isEdit ? 'New item' : name }
          ]}
        />

        <AssetNewForm isEdit={isEdit} currentUser={currentUser} />
      </Container>
    </Page>
  );
}
