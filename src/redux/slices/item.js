import { sum, map, filter, uniqBy, reject } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: false,
  items: [],
  item: {},
  tokenId: '1'
};

const slice = createSlice({
  name: 'item',
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

    // GET ITEMS
    getItemsSuccess(state, action) {
      state.isLoading = false;
      state.items = action.payload;
    },

    // GET ITEM
    getItemSuccess(state, action) {
      state.isLoading = false;
      state.item = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
// export const { deleteNft } = slice.actions;

export function getItems() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://52.231.48.130:8080/items/vouchers/');
      dispatch(slice.actions.getItemsSuccess(response.data.items));
      console.log(response);
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getItem(tokenId) {
  console.log('tokenId URL 가나?');
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://52.231.48.130:8080/items/vouchers/1');
      console.log(response);
      dispatch(slice.actions.getItemSuccess(response.data.item));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
