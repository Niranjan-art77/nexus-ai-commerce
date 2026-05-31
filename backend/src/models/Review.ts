import { createMockModel } from './fileDb';

export interface IReview {
  _id?: string;
  user: string;
  product: string;
  rating: number;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const Review = createMockModel<IReview>('Review');
