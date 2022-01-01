import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import { ethers, providers } from 'ethers';
// material
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
  FormHelperText,
  FormControlLabel,
  TextareaAutosize
} from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD, PATH_ASSET } from '../../../routes/paths';
//
import Label from '../../Label';
import { UploadItemImage } from '../../upload';
import collections from './collections';
import blockchains from './blockchains';
import { createNewSellItem } from '../../../redux/slices/assets';
import ItemCard from './sell/ItemCard';

// ----------------------------------------------------------------------

AssetSellForm.propTypes = {
  isEdit: PropTypes.bool
};

const types = {
  NFTVoucher: [
    { name: 'name', type: 'string' },
    { name: 'symbol', type: 'string' },
    { name: 'tokenAddress', type: 'string' },
    { name: 'tokenId', type: 'string' },
    { name: 'tokenUri', type: 'string' },
    { name: 'ownerOf', type: 'string' },
    { name: 'amount', type: 'uint256' },
    { name: 'contractType', type: 'string' },
    { name: 'metadata', type: 'string' },
    { name: 'isValid', type: 'uint256' },
    { name: 'frozen', type: 'uint256' },
    { name: 'minPrice', type: 'uint256' },
    { name: 'creatorAddress', type: 'string' },
    { name: 'royalty', type: 'uint256' },
    { name: 'fee', type: 'uint256' }
  ]
};

const SIGNING_DOMAIN_NAME = 'KryptoBirdz-Voucher';
const SIGNING_DOMAIN_VERSION = '1';

function _signingDomain(contractAddress, chainId) {
  // if (this._domain != null) {
  //   return this._domain;
  // }
  // const chainId = await this.contract.getChainID()
  const _domain = {
    name: SIGNING_DOMAIN_NAME,
    version: SIGNING_DOMAIN_VERSION,
    verifyingContract: contractAddress,
    chainId
  };
  return _domain;
}

export default function AssetSellForm({ isEdit, item }) {
  // console.log(item);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { account, active, library, chainId, connector } = useWeb3React();

  const NewItemSchema = Yup.object().shape({
    minPrice: Yup.number().required('Price is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      tokenAddress: item.tokenAddress,
      tokenId: item.tokenId,
      ownerOf: item.ownerOf,
      amount: item.amount,
      contractType: item.contractType,
      name: item.name,
      symbol: item.symbol,
      tokenUri: item.tokenUri,
      metadata: item.metadata,
      isValid: item.isValid,
      frozen: item.frozen,
      minPrice: '',
      signature: '',
      creatorAddress: account,
      royalty: 1,
      fee: 1
    },
    validationSchema: NewItemSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      const domain = {
        name: SIGNING_DOMAIN_NAME,
        version: SIGNING_DOMAIN_VERSION,
        chainId,
        verifyingContract: values.tokenAddress
      };

      const types = {
        NFTVoucher: [
          { name: 'name', type: 'string' },
          { name: 'symbol', type: 'string' },
          { name: 'tokenAddress', type: 'string' },
          { name: 'tokenId', type: 'string' },
          { name: 'tokenUri', type: 'string' },
          { name: 'ownerOf', type: 'string' },
          { name: 'amount', type: 'uint256' },
          { name: 'contractType', type: 'string' },
          { name: 'metadata', type: 'string' },
          { name: 'isValid', type: 'uint256' },
          { name: 'frozen', type: 'uint256' },
          { name: 'minPrice', type: 'uint256' },
          { name: 'creatorAddress', type: 'string' },
          { name: 'royalty', type: 'uint256' },
          { name: 'fee', type: 'uint256' }
        ]
      };

      try {
        await fakeRequest(500);
        resetForm();
        setSubmitting(false);
        const signer = library.getSigner();
        const signature = await signer._signTypedData(domain, types, {
          ...values,
          metadata: ''
        });

        const sellItem = {
          ...values,
          metadata: '',
          signature
        };
        const response = await createNewSellItem(sellItem);
        enqueueSnackbar(!isEdit ? 'Your item is now listed for sale' : 'Update success', { variant: 'success' });
        navigate(`${PATH_ASSET.root}/${response.data.tokenAddress}/${response.data.tokenId}`);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        enqueueSnackbar('False', { variant: 'error' });
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue('imageUrl', {
          ...file,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue]
  );

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            {item && <ItemCard data={item} />}
          </Grid>

          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack spacing={3} direction="row" alignItems="center">
                  <Typography variant="button">Fixed Price</Typography>
                  <Switch />
                  <Typography variant="button">Timed Auction</Typography>
                </Stack>
                <Stack spacing={3} direction="row" alignItems="center">
                  <Typography variant="button">Price</Typography>
                  <TextField
                    fullWidth
                    label="Amount"
                    {...getFieldProps('minPrice')}
                    error={Boolean(touched.minPrice && errors.minPrice)}
                    helperText={touched.minPrice && errors.minPrice}
                  />
                </Stack>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Sell' : 'Save Changes'}
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
