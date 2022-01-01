import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios_real';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  itemDetail: null,
  itemList: []
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
    },

    // GET ALL ITEMS
    getLazyMintedItemsSuccess(state, action) {
      state.isLoading = false;
      state.itemList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

export function lazyMintNewAsset(params) {
  const {
    tokenAddress = '0xb35691d2475e95040edb891bc4497ed7b5044009',
    tokenId = '1',
    ownerOf = '0xC6159EEa73133F9813304a272DB2203c09b872F1',
    amount,
    contractType = 'ERC721',
    name,
    symbol = 'KRB',
    tokenUri = 'https://ipfs.moralis.io:2053/ipfs/QmfHJRnapkxVHke8FP2iSWZmwnprjAHAMyaUqrdfSUWs3T',
    metadata,
    isValid = 1,
    frozen = 0
  } = params;

  return axios.post('/items/voucher', {
    tokenAddress,
    tokenId,
    ownerOf,
    amount,
    contractType,
    name,
    symbol,
    tokenUri,
    metadata,
    isValid,
    frozen
  });
}

export function createNewSellItem(params) {
  const {
    tokenAddress,
    tokenId,
    ownerOf,
    amount,
    contractType,
    name,
    symbol,
    tokenUri,
    metadata,
    isValid,
    frozen,
    minPrice,
    signature,
    creatorAddress,
    royalty,
    fee
  } = params;

  return axios.post('/items/sell', {
    tokenAddress,
    tokenId,
    ownerOf,
    amount,
    contractType,
    name,
    symbol,
    tokenUri,
    metadata,
    isValid,
    frozen,
    minPrice,
    signature,
    creatorAddress,
    royalty,
    fee
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

export function getLazyMintedItems() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/items/vouchers');
      dispatch(slice.actions.getLazyMintedItemsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
