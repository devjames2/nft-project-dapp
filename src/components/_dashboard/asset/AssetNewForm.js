import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
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
import { lazyMintNewAsset } from '../../../redux/slices/assets';

// ----------------------------------------------------------------------

AssetNewForm.propTypes = {
  isEdit: PropTypes.bool
};

export default function AssetNewForm({ isEdit }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewItemSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    collection: Yup.string().required('Collection is required'),
    blockchain: Yup.string().required('Blockchain is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      imageUrl: null,
      name: '',
      externalLink: '',
      description: '',
      collection: '',
      blockchain: '',
      amount: 1
    },
    validationSchema: NewItemSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      console.log(values);
      try {
        await fakeRequest(500);
        resetForm();
        setSubmitting(false);
        const response = await lazyMintNewAsset(values);
        console.log(response);
        enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', { variant: 'success' });
        // navigate(`/${response.data.token_address}/${response.data.tokenId}`);
        // navigate(`${PATH_ASSET}/contractAddress/tokenId`);
        console.log(response);
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
            <Card sx={{ py: 2, px: 1 }}>
              <Box sx={{ mb: 5 }}>
                <UploadItemImage
                  accept="image/*"
                  file={values.imageUrl}
                  maxSize={3145728}
                  onDrop={handleDrop}
                  error={Boolean(touched.imageUrl && errors.imageUrl)}
                  caption={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.secondary'
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {fData(3145728)}
                    </Typography>
                  }
                />
                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                  {touched.imageUrl && errors.imageUrl}
                </FormHelperText>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Name"
                  required
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />
                <TextField
                  fullWidth
                  label="External link"
                  {...getFieldProps('externalLink')}
                  error={Boolean(touched.externalLink && errors.externalLink)}
                  helperText={touched.externalLink && errors.externalLink}
                />

                <TextField
                  fullWidth
                  rows={10}
                  multiline
                  label="Description"
                  {...getFieldProps('description')}
                  error={Boolean(touched.description && errors.description)}
                  helperText={touched.description && errors.description}
                />
                <TextField
                  select
                  fullWidth
                  label="Collection"
                  placeholder="Collection"
                  {...getFieldProps('collection')}
                  SelectProps={{ native: true }}
                  error={Boolean(touched.collection && errors.collection)}
                  helperText={touched.collection && errors.collection}
                >
                  <option value="" />
                  {collections.map((option) => (
                    <option key={option.code} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Blockchain"
                  placeholder="Blockchain"
                  {...getFieldProps('blockchain')}
                  SelectProps={{ native: true }}
                  error={Boolean(touched.blockchain && errors.blockchain)}
                  helperText={touched.blockchain && errors.blockchain}
                >
                  <option value="" />
                  {blockchains.map((option) => (
                    <option key={option.code} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  label="Amount"
                  {...getFieldProps('amount')}
                  error={Boolean(touched.amount && errors.amount)}
                  helperText={touched.amount && errors.amount}
                />
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create' : 'Save Changes'}
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
