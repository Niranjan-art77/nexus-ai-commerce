import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  routedRetailer?: string;
  basePrice?: number;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  aiSuggestions: any[];
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  aiSuggestions: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      const payload = {
        ...action.payload,
        basePrice: action.payload.basePrice || action.payload.price,
        routedRetailer: action.payload.routedRetailer || "Nexus Store"
      };
      if (existingItem) {
        existingItem.quantity += payload.quantity;
      } else {
        state.items.push(payload);
      }
      state.totalAmount += payload.price * payload.quantity;
    },
    removeFromCart(state, action: PayloadAction<string>) {
      const existingItem = state.items.find(item => item.id === action.payload);
      if (existingItem) {
        state.totalAmount -= existingItem.price * existingItem.quantity;
        state.items = state.items.filter(item => item.id !== action.payload);
      }
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        const diff = action.payload.quantity - item.quantity;
        item.quantity = action.payload.quantity;
        state.totalAmount += item.price * diff;
      }
    },
    updateItemRoute(state, action: PayloadAction<{ id: string; routedRetailer: string; price: number }>) {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        state.totalAmount -= item.price * item.quantity;
        item.price = action.payload.price;
        item.routedRetailer = action.payload.routedRetailer;
        state.totalAmount += item.price * item.quantity;
      }
    },
    clearCart(state) {
      state.items = [];
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, updateItemRoute, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
