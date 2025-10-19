// Enums
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  OPERATOR = 'operator',
  SUPPORTER = 'supporter',
}

export enum Gender {
  M = 'm',
  F = 'f',
}

export enum SupporterStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum OperatorRole {
  OPERATOR = 'operator',
  SUPERVISOR = 'supervisor',
  ADMIN = 'admin',
}

export enum OperatorStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum EventType {
  RALLY = 'rally',
  FUNDRAISER = 'fundraiser',
  TRAINING = 'training',
  MEETING = 'meeting',
  OTHER = 'other',
}

export enum EventPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum RecurrenceType {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  CUSTOM = 'custom',
}

export enum EventStatus {
  PLANNED = 'planned',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum FundStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum ExpenseStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}