export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export type TaskCategory =
  | 'Personal'
  | 'College'
  | 'Work'
  | 'Health'
  | 'Finance'
  | 'Other';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string; // YYYY-MM-DD
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  completedAt?: string | null; // ISO string or null
}

export type TaskFormData = {
  title: string;
  description: string;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string;
  status?: TaskStatus;
};

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStatistics {
  totalTasks: number;
  pendingTasks: number; // TODO
  inProgressTasks: number; // IN_PROGRESS
  completedTasks: number; // COMPLETED
  overdueTasks: number;
  completionPercentage: number;
  priorityCounts: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
  };
  categoryCounts: Record<TaskCategory, number>;
}

export type DateFilter = 'ALL' | 'TODAY' | 'UPCOMING' | 'OVERDUE';

export interface TaskFilters {
  searchQuery: string;
  status: 'ALL' | TaskStatus;
  priority: 'ALL' | TaskPriority;
  category: 'ALL' | TaskCategory;
  dueDateFilter: DateFilter;
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'updatedAt' | 'title';
  sortOrder: 'asc' | 'desc';
}
