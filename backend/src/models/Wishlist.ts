import { createMockModel } from './fileDb';

export interface IWishlist {
  _id?: string;
  user: string;
  products: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const Wishlist = createMockModel<IWishlist>('Wishlist');
