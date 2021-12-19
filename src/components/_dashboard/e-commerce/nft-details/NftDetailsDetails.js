import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// material
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, Tab, Card, Grid, Divider, Skeleton, Container, Typography, Stack } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { getNft } from '../../../../redux/slices/nft';
import { getItem, getItems } from '../../../../redux/slices/item';
// utils
import { fNumber, fPercent } from '../../../../utils/formatNumber';
import axios from '../../../../utils/axios';
// hooks
import Markdown from '../../../Markdown';
import useSettings from '../../../../hooks/useSettings';

// ----------------------------------------------------------------------

export default function NftDetailsDetails() {
  const { themeStretch } = useSettings();
  const { name } = useParams();
  const dispatch = useDispatch();
  const { nft } = useSelector((state) => state.nft);
  const { item, tokenId } = useSelector((state) => state.item);

  console.log('item : ', item);
  console.log('tokenId : ', tokenId);

  useEffect(() => {
    dispatch(getItem(tokenId));
  }, [dispatch, tokenId]);

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <Card>
        <TabContext value="1">
          <Box sx={{ px: 3, bgcolor: 'background.neutral' }}>
            <Tab disableRipple value="1" label="Details" />
          </Box>

          <Divider />

          <TabPanel value="1">
            <Box sx={{ p: 3 }}>
              <Markdown children={nft.description} />
            </Box>
          </TabPanel>
        </TabContext>
      </Card>
    </Container>
  );
}
