import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import clockFill from '@iconify/icons-eva/clock-fill';
import roundVerified from '@iconify/icons-ic/round-verified';
import roundVerifiedUser from '@iconify/icons-ic/round-verified-user';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Tab, Card, Grid, Divider, Skeleton, Container, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProduct } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Markdown from '../../components/Markdown';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  NftDetailsAboutCollection,
  NftDetailsCarousel,
  NftDetailsDescription,
  NftDetailsDetails,
  NftDetailsItemActivity,
  NftDetailsListings,
  NftDetailsMoreCollection,
  NftDetailsOffers,
  NftDetailsPriceHistory,
  NftDetailsSumary
} from '../../components/_dashboard/e-commerce/nft-details';
import CartWidget from '../../components/_dashboard/e-commerce/CartWidget';
import { getNft } from '../../redux/slices/nft';

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  justifyContent: 'center',
  height: theme.spacing(8),
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}`
}));

// ----------------------------------------------------------------------

const SkeletonLoad = (
  <Grid container spacing={3}>
    <Grid item xs={12} md={6} lg={7}>
      <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: '100%', borderRadius: 2 }} />
    </Grid>
    <Grid item xs={12} md={6} lg={5}>
      <Skeleton variant="circular" width={80} height={80} />
      <Skeleton variant="text" height={240} />
      <Skeleton variant="text" height={40} />
      <Skeleton variant="text" height={40} />
      <Skeleton variant="text" height={40} />
    </Grid>
  </Grid>
);

export default function EcommerceNftDetails() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { name } = useParams();
  const [value, setValue] = useState('1');
  const { nft, error } = useSelector((state) => state.nft);

  useEffect(() => {
    dispatch(getNft(name));
  }, [dispatch, name]);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Page title="Ecommerce: Nft Details | Minimal-UI">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Nft Details"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root
            },
            { name: sentenceCase(name) }
          ]}
        />

        <CartWidget />

        {nft && (
          <>
            <Card>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={5.7}>
                  <NftDetailsCarousel />
                </Grid>
                <Grid item xs={12} md={6} lg={5.7}>
                  <NftDetailsSumary />
                </Grid>
                {/* <Grid item xs={12} md={6} lg={5.7}>
                  <NftDetailsPriceHistory />
                </Grid>
                <Grid item xs={12} md={6} lg={5.7}>
                  <NftDetailsListings />
                </Grid>
                <Grid item xs={12} md={6} lg={5.7}>
                  <NftDetailsOffers />
                </Grid>
                <Grid item xs={12} md={6} lg={5.7}>
                  <NftDetailsDescription />
                </Grid>
                <Grid item xs={12} md={6} lg={5.7}>
                  <NftDetailsAboutCollection />
                </Grid>
                <Grid item xs={12} md={6} lg={5.7}>
                  <NftDetailsDetails />
                </Grid>
                <Grid item xs={12} md={6} lg={5.7}>
                  <NftDetailsItemActivity />
                </Grid>
                <Grid item xs={12} md={6} lg={5.7}>
                  <NftDetailsMoreCollection />
                </Grid> */}
              </Grid>
            </Card>
          </>
        )}

        {!nft && SkeletonLoad}

        {error && <Typography variant="h6">404 Product not found</Typography>}
      </Container>
    </Page>
  );
}
