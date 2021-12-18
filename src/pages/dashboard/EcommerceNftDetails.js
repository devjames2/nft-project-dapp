import { sentenceCase } from 'change-case';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Tab, Card, Grid, Divider, Skeleton, Container, Typography } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getNft } from '../../redux/slices/nft';
import { getItem, getItems } from '../../redux/slices/item';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Markdown from '../../components/Markdown';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  NftDetailsCarousel,
  NftDetailsDetails,
  NftDetailsSumary
} from '../../components/_dashboard/e-commerce/nft-details';
import CartWidget from '../../components/_dashboard/e-commerce/CartWidget';

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
                <Grid item xs={12} md={6} lg={5}>
                  <NftDetailsCarousel />
                </Grid>
                <Grid item xs={12} md={6} lg={5}>
                  <NftDetailsSumary />
                </Grid>
                <Grid item xs={12} md={6} lg={5}>
                  <NftDetailsDetails />
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

        {error && <Typography variant="h6">404 Nft not found</Typography>}
      </Container>
    </Page>
  );
}
