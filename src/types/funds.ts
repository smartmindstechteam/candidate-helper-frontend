import { ExpenseStatus } from './enums'; 
// Other interfaces (Fund, ExpenseCategory, User) must also be defined.
import { FundStatus } from './enums'; 
import { Operator } from './operator';
import { User } from './users';
// Other interfaces (User, Expense, BudgetAllocation, Event, OperatorFund, Operator) must also be defined.

export interface Fund {
  id: number;
  name: string;
  amount: number; // Decimal(12, 2). Defaults to 0.
  source: string | null;
  status: FundStatus;
  description: string | null;
  createdBy: number;
  updatedBy: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Relations
  createdByUser: User;
  updatedByUser: User | null;
  expenses: Expense[];
  allocations: BudgetAllocation[];
  events: Event[];
  OperatorFund: OperatorFund[];
}

// BudgetAllocation Model
export interface BudgetAllocation {
  id: number;
  fundId: number;
  category: string;
  amount: number; // Decimal(12, 2)
  description: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  fund: Fund;
}

// OperatorFund Model (M:M bridge between Operator and Fund)
export interface OperatorFund {
  id: number;
  operatorId: number;
  fundId: number;
  amount: number; // Decimal(12, 2)
  createdAt: Date;
  updatedAt: Date;

  // Relations
  operator: Operator;
  fund: Fund;
}

export interface Expense {
  id: number;
  title: string;
  amount: number; // Decimal(12, 2)
  expenseDate: Date; // @db.Date
  fundId: number | null;
  categoryId: number | null;
  status: ExpenseStatus;
  notes: string | null;
  createdBy: number;
  updatedBy: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Relations
  fund: Fund | null;
  category: ExpenseCategory | null;
  createdByUser: User;
  updatedByUser: User | null;
}

export interface ExpenseCategory {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  expenses: Expense[];
}