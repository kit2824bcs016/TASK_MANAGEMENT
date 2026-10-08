import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Calendar,
  Tag,
  Edit2,
  Trash2,
  AlertCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { Badge } from '../ui/Badge';
import { TASK_PRIORITIES } from '../../lib/constants';
import { formatFriendlyDate, getDueDateWarning } from '../../utils/dateUtils';

export interface TaskCardProps {
  task: Task;
  onToggleStatus: (task: Task) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const [isToggling, setIsToggling] = useState(false);
  const isCompleted = task.status === 'COMPLETED';

  const priorityConfig =
    TASK_PRIORITIES.find((p) => p.value === task.priority) || TASK_PRIORITIES[0];

  const dueWarning = getDueDateWarning(task.dueDate, task.status);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggleStatus(task);
    } finally {
      setIsToggling(false);
    }
  };

  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case 'HIGH':
        return <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" />;
      case 'MEDIUM':
        return <Clock className="w-3.5 h-3.5 text-amber-600" />;
      case 'LOW':
        return <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />;
    }
  };

  return (
    <div
      className={`group relative bg-white rounded-xl border transition-all duration-200 text-left p-4 sm:p-5 hover:shadow-md ${
        isCompleted
          ? 'border-slate-200 bg-slate-50/60 opacity-90'
          : `border-slate-200 hover:border-indigo-200 border-l-4 ${priorityConfig.borderClass}`
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Toggle completion checkbox button */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={isToggling}
          className="mt-0.5 shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
          aria-label={isCompleted ? `Mark "${task.title}" as incomplete` : `Mark "${task.title}" as completed`}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
          ) : (
            <Circle className="w-5 h-5 hover:text-indigo-600" />
          )}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h4
              className={`text-base font-medium leading-snug break-words ${
                isCompleted
                  ? 'text-slate-500 line-through decoration-slate-400'
                  : 'text-slate-900'
              }`}
            >
              {task.title}
            </h4>

            {/* Actions: Edit & Delete */}
            <div className="flex items-center gap-1 shrink-0 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => onEdit(task)}
                className="p-1.5 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                aria-label={`Edit task ${task.title}`}
                title="Edit task"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(task)}
                className="p-1.5 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                aria-label={`Delete task ${task.title}`}
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Optional description */}
          {task.description && (
            <p
              className={`mt-1.5 text-sm leading-relaxed line-clamp-2 ${
                isCompleted ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Badges / Metadata row */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
            {/* Priority Badge */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-medium ${priorityConfig.badgeClass}`}
            >
              {getPriorityIcon(task.priority)}
              <span>{task.priority}</span>
            </span>

            {/* Category Badge */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-slate-200 bg-slate-50 text-slate-700">
              <Tag className="w-3 h-3 text-slate-400" />
              <span>{task.category}</span>
            </span>

            {/* Due date and warning */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border ${dueWarning.badgeClass}`}
            >
              <Calendar className="w-3 h-3 shrink-0" />
              <span>{formatFriendlyDate(task.dueDate)}</span>
              {dueWarning.label !== 'Completed' && (
                <span className="ml-0.5 text-[10px] font-semibold">
                  ({dueWarning.label})
                </span>
              )}
            </span>

            {/* Status indicator badge */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] ${
                task.status === 'COMPLETED'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : task.status === 'IN_PROGRESS'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <span>{task.status.replace('_', ' ')}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
