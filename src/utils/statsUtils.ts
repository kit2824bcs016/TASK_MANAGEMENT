import { Task, DashboardStatistics, TaskFilters, TaskPriority, TaskCategory } from '../types';
import { TASK_CATEGORIES } from '../lib/constants';
import { isTaskDueToday, isTaskOverdue, isTaskUpcoming } from './dateUtils';

export function calculateDashboardStats(tasks: Task[]): DashboardStatistics {
  const totalTasks = tasks.length;
  let pendingTasks = 0;
  let inProgressTasks = 0;
  let completedTasks = 0;
  let overdueTasks = 0;

  const priorityCounts: { LOW: number; MEDIUM: number; HIGH: number } = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
  };

  const categoryCounts = TASK_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = 0;
    return acc;
  }, {} as Record<TaskCategory, number>);

  for (const task of tasks) {
    if (task.status === 'TODO') pendingTasks++;
    else if (task.status === 'IN_PROGRESS') inProgressTasks++;
    else if (task.status === 'COMPLETED') completedTasks++;

    if (isTaskOverdue(task.dueDate, task.status)) {
      overdueTasks++;
    }

    if (task.priority in priorityCounts) {
      priorityCounts[task.priority]++;
    }

    if (task.category in categoryCounts) {
      categoryCounts[task.category]++;
    }
  }

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    totalTasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    overdueTasks,
    completionPercentage,
    priorityCounts,
    categoryCounts,
  };
}

export function filterAndSortTasks(tasks: Task[], filters: TaskFilters): Task[] {
  const { searchQuery, status, priority, category, dueDateFilter, sortBy, sortOrder } = filters;
  const query = searchQuery.trim().toLowerCase();

  const filtered = tasks.filter((task) => {
    // 1. Search filter (title or description)
    if (query) {
      const matchTitle = task.title.toLowerCase().includes(query);
      const matchDesc = task.description ? task.description.toLowerCase().includes(query) : false;
      if (!matchTitle && !matchDesc) return false;
    }

    // 2. Status filter
    if (status !== 'ALL' && task.status !== status) {
      return false;
    }

    // 3. Priority filter
    if (priority !== 'ALL' && task.priority !== priority) {
      return false;
    }

    // 4. Category filter
    if (category !== 'ALL' && task.category !== category) {
      return false;
    }

    // 5. Due date filter
    if (dueDateFilter === 'TODAY' && !isTaskDueToday(task.dueDate)) {
      return false;
    }
    if (dueDateFilter === 'UPCOMING' && !isTaskUpcoming(task.dueDate)) {
      return false;
    }
    if (dueDateFilter === 'OVERDUE' && !isTaskOverdue(task.dueDate, task.status)) {
      return false;
    }

    return true;
  });

  // Priority rank helper
  const priorityRank: Record<TaskPriority, number> = {
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };

  filtered.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'dueDate':
        comparison = a.dueDate.localeCompare(b.dueDate);
        break;
      case 'priority':
        comparison = (priorityRank[a.priority] || 0) - (priorityRank[b.priority] || 0);
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'createdAt':
        comparison = a.createdAt.localeCompare(b.createdAt);
        break;
      case 'updatedAt':
        comparison = (a.updatedAt || a.createdAt).localeCompare(b.updatedAt || b.createdAt);
        break;
      default:
        comparison = a.dueDate.localeCompare(b.dueDate);
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return filtered;
}
