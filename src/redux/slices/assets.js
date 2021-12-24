/* eslint-disable camelcase */
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios_real';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  itemDetail: null
};

const slice = createSlice({
  name: 'asset',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET ITEM DETAIL
    getLazyMintedItemSuccess(state, action) {
      state.isLoading = false;
      state.itemDetail = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

export function lazyMintNewAsset(params) {
  const {
    token_address = '0xb35691d2475e95040edb891bc4497ed7b5044009',
    token_id = '1',
    owner_of = '0xcea695c0f108833f347239bb2f05cef06f6a7658',
    amount,
    contract_type = 'ERC721',
    name,
    symbol = 'KRB',
    token_uri = 'https://ipfs.moralis.io:2053/ipfs/QmfHJRnapkxVHke8FP2iSWZmwnprjAHAMyaUqrdfSUWs3T',
    metadata,
    is_valid = 1,
    frozen = 0
  } = params;

  return axios.post('/items/voucher', {
    token_address,
    token_id,
    owner_of,
    amount,
    contract_type,
    name,
    symbol,
    token_uri,
    metadata,
    is_valid,
    frozen
  });
}

export function getLazyMintedItem(contractAddress, tokenId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/items/vouchers/${contractAddress}/${tokenId}`);
      console.log(response);
      dispatch(slice.actions.getLazyMintedItemSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
