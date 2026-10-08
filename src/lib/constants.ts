import { TaskCategory, TaskPriority, TaskStatus } from '../types';

export const TASK_CATEGORIES: TaskCategory[] = [
  'Personal',
  'College',
  'Work',
  'Health',
  'Finance',
  'Other',
];

export const TASK_PRIORITIES: { value: TaskPriority; label: string; badgeClass: string; borderClass: string }[] = [
  {
    value: 'LOW',
    label: 'Low Priority',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    borderClass: 'border-l-emerald-500',
  },
  {
    value: 'MEDIUM',
    label: 'Medium Priority',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    borderClass: 'border-l-amber-500',
  },
  {
    value: 'HIGH',
    label: 'High Priority',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    borderClass: 'border-l-rose-500',
  },
];

export const TASK_STATUSES: { value: TaskStatus; label: string; badgeClass: string }[] = [
  {
    value: 'TODO',
    label: 'To Do',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  {
    value: 'IN_PROGRESS',
    label: 'In Progress',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    value: 'COMPLETED',
    label: 'Completed',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
];

export const VALIDATION_LIMITS = {
  TITLE_MIN_LENGTH: 2,
  TITLE_MAX_LENGTH: 120,
  DESCRIPTION_MAX_LENGTH: 1000,
  DISPLAY_NAME_MAX_LENGTH: 100,
  PASSWORD_MIN_LENGTH: 6,
};
