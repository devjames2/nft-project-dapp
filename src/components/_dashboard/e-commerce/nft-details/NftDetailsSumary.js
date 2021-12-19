import { Icon } from '@iconify/react';
import flashFill from '@iconify/icons-eva/flash-fill';
import { AiFillEdit } from 'react-icons/ai';
import { sentenceCase } from 'change-case';
import { useNavigate } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import linkedinFill from '@iconify/icons-eva/linkedin-fill';
import facebookFill from '@iconify/icons-eva/facebook-fill';
import instagramFilled from '@iconify/icons-ant-design/instagram-filled';
import roundAddShoppingCart from '@iconify/icons-ic/round-add-shopping-cart';
import { useFormik, Form, FormikProvider, useField } from 'formik';
// material
import { useTheme, styled } from '@mui/material/styles';
import {
  Box,
  Link,
  Stack,
  Button,
  Rating,
  Tooltip,
  Divider,
  TextField,
  Typography,
  FormHelperText
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { addCart, onGotoStep } from '../../../../redux/slices/nft';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { fShortenNumber, fCurrency } from '../../../../utils/formatNumber';
//
import { MIconButton } from '../../../@material-extend';
import Label from '../../../Label';
import ColorSinglePicker from '../../../ColorSinglePicker';

// ----------------------------------------------------------------------

const SOCIALS = [
  {
    name: 'Facebook',
    icon: <Icon icon={facebookFill} width={20} height={20} color="#1877F2" />
  },
  {
    name: 'Instagram',
    icon: <Icon icon={instagramFilled} width={20} height={20} color="#D7336D" />
  },
  {
    name: 'Linkedin',
    icon: <Icon icon={linkedinFill} width={20} height={20} color="#006097" />
  },
  {
    name: 'Twitter',
    icon: <Icon icon={twitterFill} width={20} height={20} color="#1C9CEA" />
  }
];

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up(1368)]: {
    padding: theme.spacing(5, 8)
  }
}));

// ----------------------------------------------------------------------

export default function NftDetailsSumary() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { nft, checkout } = useSelector((state) => state.nft);
  const { id, name, sizes, price, cover, status, colors, available, priceSale, inventoryType } = nft;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id,
      name,
      cover,
      available,
      price,
      color: colors[0],
      size: sizes[4],
      quantity: available < 1 ? 0 : 1
    }
  });

  const { values, touched, errors, getFieldProps, handleSubmit } = formik;

  return (
    <RootStyle>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={inventoryType === 'in_stock' ? 'success' : 'error'}
            sx={{ textTransform: 'uppercase' }}
          >
            {sentenceCase(inventoryType)}
          </Label>
          <Typography
            variant="overline"
            sx={{
              mt: 2,
              mb: 1,
              display: 'block',
              color: status === 'sale' ? 'error.main' : 'info.main'
            }}
          >
            {status}
          </Typography>

          <Typography variant="h5" paragraph>
            {name}+NFT
          </Typography>

          <Typography variant="h4" sx={{ mb: 3 }}>
            <Box component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
              {priceSale && fCurrency(priceSale)}
            </Box>
            &nbsp;{fCurrency(price)}
          </Typography>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Button
            sx={{ m: 1 }}
            size="large"
            color="secondary"
            variant="contained"
            startIcon={<Icon icon={flashFill} width={20} height={20} />}
          >
            Buy
          </Button>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mt: 5 }}>
            <Button
              fullWidth
              size="large"
              type="button"
              color="warning"
              variant="contained"
              startIcon={<AiFillEdit />}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Edit
            </Button>
            <Button fullWidth size="large" type="submit" variant="contained">
              Sell
            </Button>
          </Stack>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            {SOCIALS.map((social) => (
              <Tooltip key={social.name} title={social.name}>
                <MIconButton>{social.icon}</MIconButton>
              </Tooltip>
            ))}
          </Box>
        </Form>
      </FormikProvider>
    </RootStyle>
  );
}
