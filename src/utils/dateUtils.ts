export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isTaskOverdue(dueDate: string, status: string): boolean {
  if (status === 'COMPLETED') return false;
  const today = getTodayDateString();
  return dueDate < today;
}

export function isTaskDueToday(dueDate: string): boolean {
  const today = getTodayDateString();
  return dueDate === today;
}

export function isTaskUpcoming(dueDate: string): boolean {
  const today = getTodayDateString();
  return dueDate > today;
}

export function getDueDateWarning(dueDate: string, status: string): {
  label: string;
  badgeClass: string;
  isOverdue: boolean;
} {
  if (status === 'COMPLETED') {
    return {
      label: 'Completed',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      isOverdue: false,
    };
  }

  const todayStr = getTodayDateString();
  if (dueDate === todayStr) {
    return {
      label: 'Due Today',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 font-medium',
      isOverdue: false,
    };
  }

  // Calculate day difference
  const todayDate = new Date(todayStr + 'T00:00:00');
  const targetDate = new Date(dueDate + 'T00:00:00');
  const diffTime = targetDate.getTime() - todayDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return {
      label: 'Due Tomorrow',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      isOverdue: false,
    };
  }

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      label: overdueDays === 1 ? 'Overdue by 1 day' : `Overdue by ${overdueDays} days`,
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 font-semibold',
      isOverdue: true,
    };
  }

  return {
    label: `Due in ${diffDays} days`,
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    isOverdue: false,
  };
}

export function formatFriendlyDate(dateString: string): string {
  if (!dateString) return 'No date';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return dateString;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
