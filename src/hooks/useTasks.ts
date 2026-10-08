import { useState, useEffect, useMemo, useCallback } from 'react';
import { Task, TaskFormData, TaskStatus, TaskFilters, DashboardStatistics } from '../types';
import { useAuth } from './useAuth';
import {
  subscribeToUserTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  seedDemoTasks,
} from '../services/tasks/taskService';
import { calculateDashboardStats, filterAndSortTasks } from '../utils/statsUtils';
import { getFriendlyErrorMessage } from '../lib/errors';

export const DEFAULT_FILTERS: TaskFilters = {
  searchQuery: '',
  status: 'ALL',
  priority: 'ALL',
  category: 'ALL',
  dueDateFilter: 'ALL',
  sortBy: 'dueDate',
  sortOrder: 'asc',
};

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS);

  // Subscribe to real-time updates for user tasks
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToUserTasks(
      user.uid,
      (fetchedTasks) => {
        setTasks(fetchedTasks);
        setLoading(false);
      },
      (err) => {
        setError(getFriendlyErrorMessage(err));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Derived statistics (calculated dynamically from actual Firestore data)
  const stats: DashboardStatistics = useMemo(() => {
    return calculateDashboardStats(tasks);
  }, [tasks]);

  // Derived filtered & sorted list
  const filteredTasks: Task[] = useMemo(() => {
    return filterAndSortTasks(tasks, filters);
  }, [tasks, filters]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const handleCreate = async (formData: TaskFormData) => {
    setError(null);
    try {
      await createTask(formData);
    } catch (err) {
      const msg = getFriendlyErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<TaskFormData>) => {
    setError(null);
    try {
      await updateTask(id, updates);
    } catch (err) {
      const msg = getFriendlyErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteTask(id);
    } catch (err) {
      const msg = getFriendlyErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const handleToggle = async (id: string, currentStatus: TaskStatus) => {
    setError(null);
    try {
      await toggleTaskCompletion(id, currentStatus);
    } catch (err) {
      const msg = getFriendlyErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const handleSeed = async () => {
    setError(null);
    try {
      await seedDemoTasks();
    } catch (err) {
      const msg = getFriendlyErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  return {
    tasks,
    loading,
    error,
    stats,
    filters,
    setFilters,
    resetFilters,
    filteredTasks,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleToggle,
    handleSeed,
  };
}
