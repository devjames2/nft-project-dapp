/* eslint-disable camelcase */
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import minusFill from '@iconify/icons-eva/minus-fill';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import linkedinFill from '@iconify/icons-eva/linkedin-fill';
import facebookFill from '@iconify/icons-eva/facebook-fill';
import instagramFilled from '@iconify/icons-ant-design/instagram-filled';
import roundAddShoppingCart from '@iconify/icons-ic/round-add-shopping-cart';
import { useWeb3React } from '@web3-react/core';
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
import { addCart, onGotoStep } from '../../../../redux/slices/product';
// routes
import { PATH_DASHBOARD, PATH_ASSET } from '../../../../routes/paths';
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

const Incrementer = (props) => {
  const [field, , helpers] = useField(props);
  // eslint-disable-next-line react/prop-types
  const { available } = props;
  const { value } = field;
  const { setValue } = helpers;

  const incrementQuantity = () => {
    setValue(value + 1);
  };
  const decrementQuantity = () => {
    setValue(value - 1);
  };

  return (
    <Box
      sx={{
        py: 0.5,
        px: 0.75,
        border: 1,
        lineHeight: 0,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        borderColor: 'grey.50032'
      }}
    >
      <MIconButton size="small" color="inherit" disabled={value <= 1} onClick={decrementQuantity}>
        <Icon icon={minusFill} width={16} height={16} />
      </MIconButton>
      <Typography
        variant="body2"
        component="span"
        sx={{
          width: 40,
          textAlign: 'center',
          display: 'inline-block'
        }}
      >
        {value}
      </Typography>
      <MIconButton size="small" color="inherit" disabled={value >= available} onClick={incrementQuantity}>
        <Icon icon={plusFill} width={16} height={16} />
      </MIconButton>
    </Box>
  );
};

export default function ItemDetailsSummary({ owner }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { product, checkout } = useSelector((state) => state.product);
  const { itemDetail } = useSelector((state) => state.assets);
  const { connector, activate, active, library, account } = useWeb3React();
  // const { id, sizes, price, cover, status, colors, available, priceSale, totalRating, totalReview, inventoryType } =
  //   product;

  useEffect(() => {
    console.log(connector);
    console.log(activate);
    console.log(active);
    console.log(library);
    console.log(account);
  }, [connector, activate, active, library, account]);

  const { amount, contractType, frozen, isValid, metadata, name, ownerOf, symbol, tokenAddress, tokenId, tokenUri } =
    itemDetail;

  console.log(itemDetail);

  // const alreadyProduct = checkout.cart.map((item) => item.id).includes(id);
  // const isMaxQuantity = checkout.cart.filter((item) => item.id === id).map((item) => item.quantity)[0] >= available;

  const onAddCart = (product) => {
    dispatch(addCart(product));
  };

  const handleBuyNow = () => {
    dispatch(onGotoStep(0));
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      amount,
      contractType,
      frozen,
      isValid,
      metadata,
      name,
      ownerOf,
      symbol,
      tokenAddress,
      tokenId,
      tokenUri
    },
    onSubmit: async (values, { setSubmitting }) => {
      // try {
      //   if (!alreadyProduct) {
      //     onAddCart({
      //       ...values,
      //       subtotal: values.price * values.quantity
      //     });
      //   }
      //   setSubmitting(false);
      //   handleBuyNow();
      navigate(`${PATH_ASSET.root}/${values.tokenAddress}/${values.tokenId}/sell`);
      // } catch (error) {
      //   setSubmitting(false);
      // }
    }
  });

  const { values, touched, errors, getFieldProps, handleSubmit } = formik;

  const handleAddCart = () => {
    onAddCart({
      ...values,
      subtotal: values.price * values.quantity
    });
  };

  return (
    <RootStyle>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={isValid ? 'success' : 'error'}
            sx={{ textTransform: 'uppercase' }}
          >
            {sentenceCase(isValid ? 'valid' : 'not valid')}
          </Label>

          <Typography variant="h5" paragraph>
            {name}
          </Typography>

          {/* <Stack spacing={0.5} direction="row" alignItems="center" sx={{ mb: 2 }}>
            <Rating value={totalRating} precision={0.1} readOnly />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              ({fShortenNumber(totalReview)}
              reviews)
            </Typography>
          </Stack> */}

          {/* <Typography variant="h4" sx={{ mb: 3 }}>
            <Box component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
              {priceSale && fCurrency(priceSale)}
            </Box>
            &nbsp;{fCurrency(price)}
          </Typography> */}

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack spacing={3} sx={{ my: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                {`Owned by ${ownerOf}`}
              </Typography>
              {/* <ColorSinglePicker
                {...getFieldProps('color')}
                colors={colors}
                sx={{
                  ...(colors.length > 4 && {
                    maxWidth: 144,
                    justifyContent: 'flex-end'
                  })
                }}
              /> */}
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                {`Symbol ${symbol}`}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
                {`Amount ${amount}`}
              </Typography>
              <div>
                {/* <Incrementer name="quantity" available={available} />
                <Typography
                  variant="caption"
                  sx={{
                    mt: 1,
                    display: 'block',
                    textAlign: 'right',
                    color: 'text.secondary'
                  }}
                >
                  Available: {available}
                </Typography> */}

                <FormHelperText error>{touched.quantity && errors.quantity}</FormHelperText>
              </div>
            </Stack>
          </Stack>
          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ mt: 5 }}>
            {ownerOf === account ? (
              <>
                <Button
                  fullWidth
                  // disabled={isMaxQuantity}
                  size="large"
                  type="button"
                  color="warning"
                  variant="contained"
                  onClick={handleAddCart}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Edit
                </Button>
                <Button fullWidth size="large" type="submit" variant="contained">
                  Sell
                </Button>
              </>
            ) : (
              <>
                <Button
                  fullWidth
                  // disabled={isMaxQuantity}
                  size="large"
                  type="button"
                  color="warning"
                  variant="contained"
                  onClick={handleAddCart}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Make Offer
                </Button>
              </>
            )}
          </Stack>

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
