import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import clockFill from '@iconify/icons-eva/clock-fill';
import roundVerified from '@iconify/icons-ic/round-verified';
import roundVerifiedUser from '@iconify/icons-ic/round-verified-user';
import ReactApexChart from 'react-apexcharts';
import trendingUpFill from '@iconify/icons-eva/trending-up-fill';
import trendingDownFill from '@iconify/icons-eva/trending-down-fill';
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

// hooks
import Markdown from '../../../Markdown';
import useSettings from '../../../../hooks/useSettings';

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  width: 24,
  height: 24,
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.success.main,
  backgroundColor: alpha(theme.palette.success.main, 0.16)
}));

// ----------------------------------------------------------------------

export default function NftDetailsDetails() {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { name } = useParams();
  const [value, setValue] = useState('1');
  const { nft, error } = useSelector((state) => state.nft);

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <Card>
        <TabContext value={value}>
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
