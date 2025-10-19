import { Gender, OperatorRole, OperatorStatus } from './enums'; 
import { OperatorEvent } from './event';
import { OperatorFund } from './funds';
import { OperatorSupporter } from './supporter';
import { OperatorTask } from './tasks';
import { User } from './users';
// Assuming enums are imported from an enums file

export interface Operator {
  id: number;
  firstname: string;
  middlename: string | null;
  lastname: string;
  fourthname: string | null;
  birthdate: Date | null;
  gender: Gender;
  language: string | null;
  specialNeeds: string | null;
  email: string | null; // @unique
  address: string | null;
  latitude: number | null; // Decimal
  longitude: number | null; // Decimal
  role: OperatorRole;
  status: OperatorStatus;
  createdBy: number | null;
  updatedBy: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Relations
  createdByUser: User | null;
  updatedByUser: User | null;
  phones: OperatorPhone[];
  tasks: OperatorTask[];
  supporters: OperatorSupporter[];
  events: OperatorEvent[];
  funds: OperatorFund[];
  activityLogs: OperatorActivityLog[];
  actions: OperatorAction[];
  assignedEvents: Event[];
}

export interface OperatorPhone {
  id: number;
  operatorId: number;
  phone: string;
  type: string | null;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  operator: Operator;
}

export interface OperatorActivityLog {
  id: number;
  operatorId: number;
  action: string;
  details: string | null;
  createdAt: Date;

  // Relations
  operator: Operator;
}

export interface Action {
  id: number;
  name: string;
  description: string | null;
  type: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  operatorActions: OperatorAction[];
}

export interface OperatorAction {
  id: number;
  operatorId: number;
  actionId: number;
  createdAt: Date;

  // Relations
  operator: Operator;
  action: Action;
}