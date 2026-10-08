import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown, RotateCcw } from 'lucide-react';
import { TaskFilters, TaskStatus, TaskPriority, TaskCategory, DateFilter } from '../../types';
import { TASK_CATEGORIES } from '../../lib/constants';

export interface TaskFilterBarProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
  onReset: () => void;
  activeFilterCount: number;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  filters,
  onChange,
  onReset,
  activeFilterCount,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, searchQuery: e.target.value });
  };

  const handleClearSearch = () => {
    onChange({ ...filters, searchQuery: '' });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs text-left">
      {/* Search Input Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            className="w-full pl-9 pr-9 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 placeholder:text-slate-400"
            placeholder="Search tasks by title or description..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
          />
          {filters.searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Sort:</span>
          </div>

          <select
            value={filters.sortBy}
            onChange={(e) =>
              onChange({
                ...filters,
                sortBy: e.target.value as TaskFilters['sortBy'],
              })
            }
            className="text-xs py-2 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            aria-label="Sort tasks by"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title (Alphabetical)</option>
            <option value="createdAt">Created Date</option>
            <option value="updatedAt">Updated Date</option>
          </select>

          <button
            type="button"
            onClick={() =>
              onChange({
                ...filters,
                sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
              })
            }
            className="p-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer"
            aria-label={`Toggle sort order, currently ${filters.sortOrder === 'asc' ? 'ascending' : 'descending'}`}
            title={`Sort order: ${filters.sortOrder.toUpperCase()}`}
          >
            {filters.sortOrder === 'asc' ? 'Asc ↑' : 'Desc ↓'}
          </button>
        </div>
      </div>

      {/* Filter Row: Status, Priority, Category, Due Date, Reset */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
        <span className="text-slate-500 font-medium flex items-center gap-1 shrink-0 mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </span>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) =>
            onChange({
              ...filters,
              status: e.target.value as TaskFilters['status'],
            })
          }
          className={`py-1.5 px-2.5 rounded-lg border text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
            filters.status !== 'ALL'
              ? 'border-indigo-400 text-indigo-700 bg-indigo-50/50 font-medium'
              : 'border-slate-300 text-slate-700'
          }`}
          aria-label="Filter by status"
        >
          <option value="ALL">All Statuses</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        {/* Priority */}
        <select
          value={filters.priority}
          onChange={(e) =>
            onChange({
              ...filters,
              priority: e.target.value as TaskFilters['priority'],
            })
          }
          className={`py-1.5 px-2.5 rounded-lg border text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
            filters.priority !== 'ALL'
              ? 'border-indigo-400 text-indigo-700 bg-indigo-50/50 font-medium'
              : 'border-slate-300 text-slate-700'
          }`}
          aria-label="Filter by priority"
        >
          <option value="ALL">All Priorities</option>
          <option value="HIGH">High Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="LOW">Low Priority</option>
        </select>

        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) =>
            onChange({
              ...filters,
              category: e.target.value as TaskFilters['category'],
            })
          }
          className={`py-1.5 px-2.5 rounded-lg border text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
            filters.category !== 'ALL'
              ? 'border-indigo-400 text-indigo-700 bg-indigo-50/50 font-medium'
              : 'border-slate-300 text-slate-700'
          }`}
          aria-label="Filter by category"
        >
          <option value="ALL">All Categories</option>
          {TASK_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Due Date Filter */}
        <select
          value={filters.dueDateFilter}
          onChange={(e) =>
            onChange({
              ...filters,
              dueDateFilter: e.target.value as DateFilter,
            })
          }
          className={`py-1.5 px-2.5 rounded-lg border text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
            filters.dueDateFilter !== 'ALL'
              ? 'border-indigo-400 text-indigo-700 bg-indigo-50/50 font-medium'
              : 'border-slate-300 text-slate-700'
          }`}
          aria-label="Filter by due date"
        >
          <option value="ALL">All Due Dates</option>
          <option value="TODAY">Due Today</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="OVERDUE">Overdue</option>
        </select>

        {/* Reset button if any filter active */}
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 py-1 px-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors cursor-pointer ml-auto font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset filters ({activeFilterCount})</span>
          </button>
        )}
      </div>
    </div>
  );
};
