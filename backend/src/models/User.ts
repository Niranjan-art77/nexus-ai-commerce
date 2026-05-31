import { createMockModel } from './fileDb';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'customer' | 'admin' | 'seller' | 'delivery' | 'support';
  googleId?: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const User = createMockModel<IUser>('User');
