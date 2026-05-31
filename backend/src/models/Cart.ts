import { createMockModel } from './fileDb';

export interface ICartItem {
  product: string;
  quantity: number;
}

export interface ICart {
  _id?: string;
  user: string;
  items: ICartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const Cart = createMockModel<ICart>('Cart');
