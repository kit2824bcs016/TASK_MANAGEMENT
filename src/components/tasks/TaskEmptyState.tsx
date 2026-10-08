import React from 'react';
import { CheckCircle, SearchX, Plus, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export interface TaskEmptyStateProps {
  type: 'no-tasks' | 'no-filter-match' | 'no-today-tasks' | 'no-upcoming-tasks';
  onCreateTask?: () => void;
  onResetFilters?: () => void;
  onSeedDemo?: () => void;
}

export const TaskEmptyState: React.FC<TaskEmptyStateProps> = ({
  type,
  onCreateTask,
  onResetFilters,
  onSeedDemo,
}) => {
  if (type === 'no-filter-match') {
    return (
      <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 mx-auto flex items-center justify-center mb-3">
          <SearchX className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">
          No tasks match your search
        </h3>
        <p className="text-sm text-slate-500 mb-5">
          Try adjusting your search terms or clearing one of your filters to see more tasks.
        </p>
        {onResetFilters && (
          <Button variant="outline" size="sm" onClick={onResetFilters}>
            Reset all filters
          </Button>
        )}
      </div>
    );
  }

  if (type === 'no-today-tasks') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-2">
          <CheckCircle className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-medium text-slate-800 mb-0.5">
          You're all caught up for today
        </h4>
        <p className="text-xs text-slate-500">
          No tasks are due today. Enjoy your day or plan ahead!
        </p>
      </div>
    );
  }

  if (type === 'no-upcoming-tasks') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
        <h4 className="text-sm font-medium text-slate-800 mb-0.5">
          No upcoming tasks
        </h4>
        <p className="text-xs text-slate-500">
          You have no tasks scheduled for future dates.
        </p>
      </div>
    );
  }

  // Default: no tasks created yet
  return (
    <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-3">
        <CheckCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">
        No tasks yet
      </h3>
      <p className="text-sm text-slate-500 mb-6">
        Create your first task to get started and keep your daily activities organized.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {onCreateTask && (
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={onCreateTask}
          >
            Create Task
          </Button>
        )}
        {onSeedDemo && (
          <Button
            variant="outline"
            size="md"
            icon={<Sparkles className="w-4 h-4 text-amber-500" />}
            onClick={onSeedDemo}
          >
            Load Sample Tasks
          </Button>
        )}
      </div>
    </div>
  );
};
