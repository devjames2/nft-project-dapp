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
  const { item } = useSelector((state) => state.item);

  const tokenId = 1;

  useEffect(() => {
    dispatch(getItem(tokenId));
  }, [dispatch]);

  console.log(item);

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
              Token ID : {item.token_address}
              Item Name : {item.name}
              Owner : {item.owner_of}
              Contract Type : {item.contract_type}
              Token URI : {item.token_uri}
            </Box>
          </TabPanel>
        </TabContext>
      </Card>
    </Container>
  );
}
