import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Task, TaskFormData, TaskPriority, TaskCategory, TaskStatus } from '../../types';
import { TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES, VALIDATION_LIMITS } from '../../lib/constants';
import { validateTask } from '../../validators/taskValidator';
import { getTodayDateString } from '../../utils/dateUtils';

export interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  initialData?: Task | null;
  title: string;
  submitLabel: string;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
  submitLabel,
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    category: 'Personal',
    dueDate: getTodayDateString(),
    status: 'TODO',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Sync form data when initialData or modal open changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        priority: initialData.priority,
        category: initialData.category,
        dueDate: initialData.dueDate,
        status: initialData.status,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'MEDIUM',
        category: 'Personal',
        dueDate: getTodayDateString(),
        status: 'TODO',
      });
    }
    setErrors({});
    setServerError(null);
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validate
    const validation = validateTask(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save task. Please try again.';
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityOptions = TASK_PRIORITIES.map((p) => ({
    value: p.value,
    label: p.label,
  }));

  const categoryOptions = TASK_CATEGORIES.map((c) => ({
    value: c,
    label: c,
  }));

  const statusOptions = TASK_STATUSES.map((s) => ({
    value: s.value,
    label: s.label,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {serverError && (
          <Alert type="error" message={serverError} onClose={() => setServerError(null)} />
        )}

        {/* Title */}
        <div>
          <Input
            label="Task Title"
            required
            placeholder="e.g., Complete DNN assignment"
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
            error={errors.title}
            maxLength={VALIDATION_LIMITS.TITLE_MAX_LENGTH}
            autoFocus
          />
          <div className="flex justify-end mt-1">
            <span className="text-[11px] text-slate-400">
              {formData.title.length}/{VALIDATION_LIMITS.TITLE_MAX_LENGTH}
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            rows={3}
            className={`block w-full rounded-lg border text-sm transition-colors py-2 px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
              errors.description
                ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
            placeholder="Add relevant notes, requirements, or links..."
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              if (errors.description) setErrors({ ...errors, description: '' });
            }}
            maxLength={VALIDATION_LIMITS.DESCRIPTION_MAX_LENGTH}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.description ? (
              <p className="text-xs text-rose-600">{errors.description}</p>
            ) : <span />}
            <span className="text-[11px] text-slate-400">
              {formData.description.length}/{VALIDATION_LIMITS.DESCRIPTION_MAX_LENGTH}
            </span>
          </div>
        </div>

        {/* 2-Column fields: Priority & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Priority"
            required
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value as TaskPriority })
            }
            options={priorityOptions}
            error={errors.priority}
          />

          <Select
            label="Category"
            required
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value as TaskCategory })
            }
            options={categoryOptions}
            error={errors.category}
          />
        </div>

        {/* 2-Column fields: Due Date & Status (if editing) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="date"
            label="Due Date"
            required
            value={formData.dueDate}
            onChange={(e) => {
              setFormData({ ...formData, dueDate: e.target.value });
              if (errors.dueDate) setErrors({ ...errors, dueDate: '' });
            }}
            error={errors.dueDate}
          />

          {initialData ? (
            <Select
              label="Status"
              value={formData.status || 'TODO'}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as TaskStatus })
              }
              options={statusOptions}
              error={errors.status}
            />
          ) : (
            <div className="flex flex-col justify-end text-xs text-slate-500 pb-2">
              <span className="font-medium text-slate-700">Initial Status</span>
              <span>New tasks begin as "To Do".</span>
            </div>
          )}
        </div>

        {/* Modal actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
