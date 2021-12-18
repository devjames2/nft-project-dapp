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
  sortBy: null,
  filters: {
    gender: [],
    category: 'All',
    colors: [],
    priceRange: '',
    rating: ''
  },
  checkout: {
    activeStep: 0,
    cart: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    shipping: 0,
    billing: null
  }
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

    // GET ITEMS
    getItemsSuccess(state, action) {
      state.isLoading = false;
      state.items = action.payload;
    },

    // GET ITEM
    getItemSuccess(state, action) {
      state.isLoading = false;
      state.item = action.payload;
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
    },

    //  SORT & FILTER NFTS
    sortByNfts(state, action) {
      state.sortBy = action.payload;
    },

    filterNfts(state, action) {
      state.filters.gender = action.payload.gender;
      state.filters.category = action.payload.category;
      state.filters.colors = action.payload.colors;
      state.filters.priceRange = action.payload.priceRange;
      state.filters.rating = action.payload.rating;
    },

    // CHECKOUT
    getCart(state, action) {
      const cart = action.payload;

      const subtotal = sum(cart.map((nft) => nft.price * nft.quantity));
      const discount = cart.length === 0 ? 0 : state.checkout.discount;
      const shipping = cart.length === 0 ? 0 : state.checkout.shipping;
      const billing = cart.length === 0 ? null : state.checkout.billing;

      state.checkout.cart = cart;
      state.checkout.discount = discount;
      state.checkout.shipping = shipping;
      state.checkout.billing = billing;
      state.checkout.subtotal = subtotal;
      state.checkout.total = subtotal - discount;
    },

    addCart(state, action) {
      const nft = action.payload;
      const isEmptyCart = state.checkout.cart.length === 0;

      if (isEmptyCart) {
        state.checkout.cart = [...state.checkout.cart, nft];
      } else {
        state.checkout.cart = map(state.checkout.cart, (_nft) => {
          const isExisted = _nft.id === nft.id;
          if (isExisted) {
            return {
              ..._nft,
              quantity: _nft.quantity + 1
            };
          }
          return _nft;
        });
      }
      state.checkout.cart = uniqBy([...state.checkout.cart, nft], 'id');
    },

    deleteCart(state, action) {
      const updateCart = filter(state.checkout.cart, (item) => item.id !== action.payload);

      state.checkout.cart = updateCart;
    },

    resetCart(state) {
      state.checkout.activeStep = 0;
      state.checkout.cart = [];
      state.checkout.total = 0;
      state.checkout.subtotal = 0;
      state.checkout.discount = 0;
      state.checkout.shipping = 0;
      state.checkout.billing = null;
    },

    onBackStep(state) {
      state.checkout.activeStep -= 1;
    },

    onNextStep(state) {
      state.checkout.activeStep += 1;
    },

    onGotoStep(state, action) {
      const goToStep = action.payload;
      state.checkout.activeStep = goToStep;
    },

    increaseQuantity(state, action) {
      const nftId = action.payload;
      const updateCart = map(state.checkout.cart, (nft) => {
        if (nft.id === nftId) {
          return {
            ...nft,
            quantity: nft.quantity + 1
          };
        }
        return nft;
      });

      state.checkout.cart = updateCart;
    },

    decreaseQuantity(state, action) {
      const nftId = action.payload;
      const updateCart = map(state.checkout.cart, (nft) => {
        if (nft.id === nftId) {
          return {
            ...nft,
            quantity: nft.quantity - 1
          };
        }
        return nft;
      });

      state.checkout.cart = updateCart;
    },

    createBilling(state, action) {
      state.checkout.billing = action.payload;
    },

    applyDiscount(state, action) {
      const discount = action.payload;
      state.checkout.discount = discount;
      state.checkout.total = state.checkout.subtotal - discount;
    },

    applyShipping(state, action) {
      const shipping = action.payload;
      state.checkout.shipping = shipping;
      state.checkout.total = state.checkout.subtotal - state.checkout.discount + shipping;
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

export function getItems() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://52.231.48.130:8080/items/vouchers/');
      dispatch(slice.actions.getItemsSuccess(response.data.items));
      console.log(response.data.items);
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getItem(name) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://52.231.48.130:8080/items/vouchers/', {
        params: { name }
      });
      console.log(response);
      dispatch(slice.actions.getItemSuccess(response.data.item));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
