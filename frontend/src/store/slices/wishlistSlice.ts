"use client";

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface WishlistState {
  items: WishlistItem[];
}

const getInitialWishlist = (): WishlistItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('wishlistItems');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Failed to load wishlist items from localStorage", err);
    return [];
  }
};

const initialState: WishlistState = {
  items: getInitialWishlist(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<WishlistItem>) {
      const exists = state.items.some(item => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
        if (typeof window !== 'undefined') {
          localStorage.setItem('wishlistItems', JSON.stringify(state.items));
        }
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('wishlistItems', JSON.stringify(state.items));
      }
    },
    clearWishlist(state) {
      state.items = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem('wishlistItems');
      }
    }
  }
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
