import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import trendingUpFill from '@iconify/icons-eva/trending-up-fill';
import trendingDownFill from '@iconify/icons-eva/trending-down-fill';
// material
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, Tab, Card, Grid, Divider, Skeleton, Container, Typography, Stack } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
// hooks
import Markdown from '../../../Markdown';
import useSettings from '../../../../hooks/useSettings';
// utils
import { fNumber, fPercent } from '../../../../utils/formatNumber';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { getProduct } from '../../../../redux/slices/product';

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

const PERCENT = 2.6;
const TOTAL_USER = 18765;
const CHART_DATA = [{ data: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26] }];
const PRODUCT_DESCRIPTION = [
  {
    title: 'Contract Address',
    description: '0x2953399124f0cbb46d2cbacd8a89cf0599974963'
  },
  {
    title: 'Token ID',
    description: '89588803813285719784009642283373842536903659365150438920143814564534175137797'
  },
  {
    title: 'Token Standard',
    description: 'ERC-1155'
  },
  {
    title: 'Blockchain',
    description: 'Mumbai'
  },
  {
    title: 'Metadata',
    description: 'Editable'
  }
];

export default function NftDetailsDescription() {
  const theme = useTheme();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { name } = useParams();
  const [value, setValue] = useState('1');
  const { product, error } = useSelector((state) => state.product);

  const chartOptions = {
    colors: [theme.palette.primary.main],
    chart: { sparkline: { enabled: true } },
    plotOptions: { bar: { columnWidth: '68%', borderRadius: 2 } },
    labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
    tooltip: {
      x: { show: false },
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: () => ''
        }
      },
      marker: { show: false }
    }
  };

  useEffect(() => {
    dispatch(getProduct(name));
  }, [dispatch, name]);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <Card>
        <TabContext value={value}>
          <Box sx={{ px: 3, bgcolor: 'background.neutral' }}>
            <Tab onChange={handleChangeTab} disableRipple value="1" label="Description" />
          </Box>

          <Divider />

          <TabPanel value="1">
            <Box sx={{ p: 3 }}>
              <Markdown children={product.description} />
            </Box>
          </TabPanel>
        </TabContext>
      </Card>
    </Container>
  );
}