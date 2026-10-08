import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { TaskCard } from '../../components/tasks/TaskCard';
import { TaskFilterBar } from '../../components/tasks/TaskFilterBar';
import { TaskEmptyState } from '../../components/tasks/TaskEmptyState';
import { TaskFormModal } from '../../components/tasks/TaskFormModal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { Task, TaskFormData } from '../../types';

interface OutletContextType {
  openCreateTaskModal: () => void;
}

export const TasksPage: React.FC = () => {
  const { openCreateTaskModal } = useOutletContext<OutletContextType>();
  const {
    tasks,
    filteredTasks,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
    handleToggle,
    handleUpdate,
    handleDelete,
    handleSeed,
  } = useTasks();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Count active filters (excluding defaults)
  const activeFilterCount =
    (filters.searchQuery ? 1 : 0) +
    (filters.status !== 'ALL' ? 1 : 0) +
    (filters.priority !== 'ALL' ? 1 : 0) +
    (filters.category !== 'ALL' ? 1 : 0) +
    (filters.dueDateFilter !== 'ALL' ? 1 : 0);

  const confirmDelete = async () => {
    if (!deletingTask) return;
    setIsDeleting(true);
    try {
      const taskTitle = deletingTask.title;
      await handleDelete(deletingTask.id);
      setDeletingTask(null);
      setFeedbackMessage({
        type: 'success',
        text: `Task "${taskTitle}" was deleted successfully.`,
      });
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err: unknown) {
      setFeedbackMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to delete task.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSubmit = async (data: TaskFormData) => {
    if (!editingTask) return;
    await handleUpdate(editingTask.id, data);
    setEditingTask(null);
    setFeedbackMessage({
      type: 'success',
      text: `Task "${data.title}" updated successfully.`,
    });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Tasks
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, prioritize, and track your daily tasks and assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tasks.length === 0 && (
            <Button
              variant="outline"
              size="sm"
              icon={<Sparkles className="w-4 h-4 text-amber-500" />}
              onClick={handleSeed}
              title="Add sample tasks for college viva testing"
            >
              Load Sample Tasks
            </Button>
          )}

          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={openCreateTaskModal}
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {feedbackMessage && (
        <Alert
          type={feedbackMessage.type}
          message={feedbackMessage.text}
          onClose={() => setFeedbackMessage(null)}
        />
      )}

      {error && (
        <Alert
          type="error"
          message={error}
        />
      )}

      {/* Filter and Search Bar */}
      <TaskFilterBar
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Results summary row */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800">{filteredTasks.length}</strong> of{' '}
          <strong className="text-slate-800">{tasks.length}</strong> total tasks
        </span>
        {activeFilterCount > 0 && (
          <span className="font-medium text-indigo-600">
            Filtered view active
          </span>
        )}
      </div>

      {/* Task List or Empty State */}
      {loading ? (
        <div className="space-y-3 py-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-28 bg-white rounded-xl border border-slate-200 animate-pulse p-4"
            />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <TaskEmptyState
          type="no-tasks"
          onCreateTask={openCreateTaskModal}
          onSeedDemo={handleSeed}
        />
      ) : filteredTasks.length === 0 ? (
        <TaskEmptyState
          type="no-filter-match"
          onResetFilters={resetFilters}
        />
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStatus={async (t) => {
                await handleToggle(t.id, t.status);
              }}
              onEdit={(t) => setEditingTask(t)}
              onDelete={(t) => setDeletingTask(t)}
            />
          ))}
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskFormModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={handleEditSubmit}
          initialData={editingTask}
          title="Edit Task"
          submitLabel="Save Changes"
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={confirmDelete}
        title="Delete this task?"
        message={`Are you sure you want to permanently delete "${deletingTask?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Task"
        isLoading={isDeleting}
      />
    </div>
  );
};
