import { createMockModel } from './fileDb';

export interface IReview {
  _id: string;
  user: string;
  rating: number;
  text: string;
  createdAt: Date;
}

export interface IProduct {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  model3DUrl?: string; // For Three.js rendering
  stock: number;
  features: string[];
  aiSummary?: string;
  aiPros?: string[];
  aiCons?: string[];
  idealUserType?: string;
  reviews?: IReview[];
  rating?: number;
  numReviews?: number;
  originalPrice?: number;
  deliveryDays?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const Product = createMockModel<IProduct>('Product');
