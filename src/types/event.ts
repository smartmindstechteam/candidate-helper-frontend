import { EventType, EventPriority, RecurrenceType, EventStatus } from './enums'; 
import { Fund } from './funds';
import { District, Region } from './geography';
import { Operator } from './operator';
import { User } from './users';
// Assuming enums are imported from an enums file
// Other interfaces (District, Region, Fund, Operator, User, OperatorEvent) must also be defined.

export interface Event {
  id: number;
  title: string;
  type: EventType;
  category: string;
  timezone: string;
  description: string;
  objective: string | null;
  tags: object | null; // Json
  priority: EventPriority;
  startTime: Date;
  endTime: Date;
  recurrence: RecurrenceType;
  recurrenceRule: object | null; // Json
  setupTime: Date | null;
  teardownTime: Date | null;
  venue: string;
  city: string;
  districtId: number;
  regionId: number;
  address: string;
  lat: number | null; // Decimal
  lng: number | null; // Decimal
  maxCapacity: number;
  expectedAttendance: number | null;
  actualAttendance: number | null;
  budgetAmount: number; // Decimal(12, 2)
  estimatedCost: number | null; // Decimal(12, 2)
  fundingSourceId: number | null;
  status: EventStatus;
  mediaLinks: object | null; // Json
  organizerName: string;
  organizerContact: string;
  backupContact: string | null;
  assignedOperatorId: number | null;
  riskAssessment: string | null;
  contingencyPlan: string | null;
  feedbackLink: string | null;
  createdBy: number;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Relations
  district: District;
  region: Region;
  fundingSource: Fund | null;
  assignedOperator: Operator | null;
  createdByUser: User;
  updatedByUser: User;
  operatorEvents: OperatorEvent[];
}

// OperatorEvent Model (M:M bridge between Operator and Event)
export interface OperatorEvent {
  id: number;
  operatorId: number;
  eventId: number;
  role: string | null; // Defaults to "participant"
  createdAt: Date;
  updatedAt: Date;

  // Relations
  operator: Operator;
  event: Event;
}