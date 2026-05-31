import { createMockModel } from './fileDb';

export interface IOrderItem {
  product: string; // Product ID
  name?: string; // Optional product name cache
  quantity: number;
  price: number;
}

export interface IOrder {
  _id?: string;
  user: string; // User ID
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  deliveryStages: { stage: string; timestamp: Date; completed: boolean }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const Order = createMockModel<IOrder>('Order');
