// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  department?: string;
}

export type UserRole =
  | "owner"
  | "admin"
  | "project_manager"
  | "team_lead"
  | "developer"
  | "qa"
  | "designer"
  | "viewer"
  | "guest";

// Workspace Types
export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  members: User[];
  createdAt: string;
  updatedAt: string;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  owner: User;
  team?: Team;
  status: ProjectStatus;
  priority: Priority;
  startDate?: string;
  dueDate?: string;
  progress?: number;
  budget?: number;
  labels?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus =
  | "planning"
  | "active"
  | "on_hold"
  | "at_risk"
  | "completed"
  | "cancelled";

export type Priority = "critical" | "high" | "medium" | "low";

// Task Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee?: User;
  reporter?: User;
  priority: Priority;
  status: TaskStatus;
  dueDate?: string;
  startDate?: string;
  labels?: string[];
  estimatedHours?: number;
  actualHours?: number;
  projectId: string;
  dependencies?: string[];
  subtasks?: Task[];
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus =
  | "backlog"
  | "todo"
  | "in_progress"
  | "review"
  | "testing"
  | "done"
  | "blocked"
  | "cancelled";

// Team Types
export interface Team {
  id: string;
  name: string;
  description?: string;
  members: User[];
  workload?: TeamMemberWorkload[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberWorkload {
  userId: string;
  user: User;
  allocatedHours: number;
  currentHours: number;
  capacity: number;
}

// Sprint Types
export interface Sprint {
  id: string;
  name: string;
  goal?: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
  velocity?: number;
  capacity?: number;
  status: SprintStatus;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export type SprintStatus = "planning" | "active" | "completed" | "cancelled";

// Comment Types
export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

// Document Types
export interface Document {
  id: string;
  title: string;
  content: string;
  author: User;
  projectId?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedItemId?: string;
  read: boolean;
  createdAt: string;
}

export type NotificationType =
  | "task_assigned"
  | "task_updated"
  | "comment"
  | "mention"
  | "status_changed"
  | "project_updated"
  | "sprint_updated"
  | "deadline_approaching";

// Activity Types
export interface Activity {
  id: string;
  type: string;
  actor: User;
  action: string;
  relatedItem: string;
  relatedItemId: string;
  changes?: Record<string, any>;
  createdAt: string;
}
