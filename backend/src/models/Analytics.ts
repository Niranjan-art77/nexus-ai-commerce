import { createMockModel } from './fileDb';

export interface IAnalytics {
  _id?: string;
  date: Date;
  pageViews: number;
  uniqueVisitors: number;
  totalRevenue: number;
  ordersPlaced: number;
  aiInteractions: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const Analytics = createMockModel<IAnalytics>('Analytics');
