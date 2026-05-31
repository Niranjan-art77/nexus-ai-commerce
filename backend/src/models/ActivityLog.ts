import { createMockModel } from './fileDb';

export interface IActivityLog {
  _id?: string;
  user?: string;
  action: string;
  details?: string;
  ipAddress?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const ActivityLog = createMockModel<IActivityLog>('ActivityLog');
