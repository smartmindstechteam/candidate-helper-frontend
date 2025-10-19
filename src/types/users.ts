import { UserRole} from './enums'; 
import { Expense, Fund } from './funds';
import { Operator } from './operator';
import { Supporter } from './supporter';
// Assuming enums are imported from an enums file

export interface User {
  id: number;
  name: string;
  email: string;
  emailVerifiedAt: Date | null;
  password: string;
  role: UserRole;
  rememberToken: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  createdSupporters: Supporter[];
  updatedSupporters: Supporter[];
  createdOperators: Operator[];
  updatedOperators: Operator[];
  createdEvents: Event[];
  updatedEvents: Event[];
  createdFunds: Fund[];
  updatedFunds: Fund[];
  createdExpenses: Expense[];
  updatedExpenses: Expense[];
}

export interface Admin {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string; // "admin"
  status: string; // "active"
  createdAt: Date;
  updatedAt: Date;

  // Relations
  activityLogs: AdminActivityLog[];
}

export interface AdminActivityLog {
  id: number;
  adminId: number;
  action: string;
  details: string | null;
  createdAt: Date;

  // Relations
  admin: Admin;
}