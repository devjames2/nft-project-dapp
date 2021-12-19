import { sum, map, filter, uniqBy, reject } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  nfts: [],
  nft: null,
  items: [],
  item: null,
  tokenId: null
};

const slice = createSlice({
  name: 'nft',
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

    // GET NFTS
    getNftsSuccess(state, action) {
      state.isLoading = false;
      state.nfts = action.payload;
    },

    // GET NFT
    getNftSuccess(state, action) {
      state.isLoading = false;
      state.nft = action.payload;
    },

    // DELETE NFT
    deleteNft(state, action) {
      state.nfts = reject(state.nfts, { id: action.payload });
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getCart,
  addCart,
  resetCart,
  onGotoStep,
  onBackStep,
  onNextStep,
  deleteCart,
  deleteNft,
  createBilling,
  applyShipping,
  applyDiscount,
  filterNfts,
  sortByNfts,
  increaseQuantity,
  decreaseQuantity
} = slice.actions;

// ----------------------------------------------------------------------

export function getNfts() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/nfts');
      console.log(response);
      dispatch(slice.actions.getNftsSuccess(response.data.nfts));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getNft(name) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/nfts/nft', {
        params: { name }
      });
      console.log(response);
      dispatch(slice.actions.getNftSuccess(response.data.nft));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
