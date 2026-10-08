import { TaskFormData, TaskPriority, TaskStatus, TaskCategory } from '../types';
import { TASK_CATEGORIES, VALIDATION_LIMITS } from '../lib/constants';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateTask(data: Partial<TaskFormData>): ValidationResult {
  const errors: Record<string, string> = {};

  // Title validation
  const title = (data.title || '').trim();
  if (!title) {
    errors.title = 'Task title is required.';
  } else if (title.length < VALIDATION_LIMITS.TITLE_MIN_LENGTH) {
    errors.title = `Task title must be at least ${VALIDATION_LIMITS.TITLE_MIN_LENGTH} characters.`;
  } else if (title.length > VALIDATION_LIMITS.TITLE_MAX_LENGTH) {
    errors.title = `Task title must not exceed ${VALIDATION_LIMITS.TITLE_MAX_LENGTH} characters.`;
  }

  // Description validation
  if (data.description && data.description.length > VALIDATION_LIMITS.DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description must not exceed ${VALIDATION_LIMITS.DESCRIPTION_MAX_LENGTH} characters.`;
  }

  // Priority validation
  const validPriorities: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];
  if (!data.priority || !validPriorities.includes(data.priority)) {
    errors.priority = 'Priority must be LOW, MEDIUM, or HIGH.';
  }

  // Category validation
  if (!data.category || !TASK_CATEGORIES.includes(data.category as TaskCategory)) {
    errors.category = 'Please select a valid category.';
  }

  // Status validation if provided
  if (data.status) {
    const validStatuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'COMPLETED'];
    if (!validStatuses.includes(data.status)) {
      errors.status = 'Status must be TODO, IN_PROGRESS, or COMPLETED.';
    }
  }

  // Due Date validation
  if (!data.dueDate) {
    errors.dueDate = 'Due date is required.';
  } else {
    // Check format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.dueDate)) {
      errors.dueDate = 'Please enter a valid date in YYYY-MM-DD format.';
    } else {
      const parsed = new Date(data.dueDate);
      if (isNaN(parsed.getTime())) {
        errors.dueDate = 'Invalid calendar date.';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
