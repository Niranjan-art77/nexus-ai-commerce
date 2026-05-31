import { createMockModel } from './fileDb';

export interface IAIProfile {
  _id?: string;
  user: string;
  shoppingPersona: string; // e.g. "Performance-Driven Gamer"
  colorPreferences: string[];
  interestCategories: string[];
  averageSpend: number;
  recommendedProducts: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const AIProfile = createMockModel<IAIProfile>('AIProfile');
