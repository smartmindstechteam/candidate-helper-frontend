// Assuming Operator interface is defined.

import { Operator } from "./operator";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: string; // Defaults to "medium"
  status: string; // Defaults to "pending"
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  operatorTasks: OperatorTask[];
}

// OperatorTask Model (M:M bridge between Operator and Task)
export interface OperatorTask {
  id: number;
  operatorId: number;
  taskId: number;
  status: string; // Defaults to "pending"
  createdAt: Date;
  updatedAt: Date;

  // Relations
  operator: Operator;
  task: Task;
}