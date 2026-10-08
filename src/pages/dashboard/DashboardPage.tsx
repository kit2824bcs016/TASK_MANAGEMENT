import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  CheckSquare,
  Clock,
  PlayCircle,
  AlertOctagon,
  Calendar,
  Plus,
  ArrowRight,
  Sparkles,
  ListTodo,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { StatCard } from '../../components/dashboard/StatCard';
import { CompletionChart } from '../../components/dashboard/CompletionChart';
import { PriorityDistribution } from '../../components/dashboard/PriorityDistribution';
import { TaskCard } from '../../components/tasks/TaskCard';
import { TaskEmptyState } from '../../components/tasks/TaskEmptyState';
import { TaskFormModal } from '../../components/tasks/TaskFormModal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Task, TaskFormData } from '../../types';
import { isTaskDueToday, isTaskUpcoming } from '../../utils/dateUtils';

interface OutletContextType {
  openCreateTaskModal: () => void;
}

export const DashboardPage: React.FC = () => {
  const { user, userProfile } = useAuth();
  const { openCreateTaskModal } = useOutletContext<OutletContextType>();
  const {
    tasks,
    loading,
    error,
    stats,
    handleToggle,
    handleUpdate,
    handleDelete,
    handleSeed,
  } = useTasks();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const displayName =
    userProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'User';

  // Greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Filter today's tasks and upcoming tasks
  const todayTasks = tasks.filter((t) => isTaskDueToday(t.dueDate));
  const upcomingTasks = tasks
    .filter((t) => isTaskUpcoming(t.dueDate) && t.status !== 'COMPLETED')
    .slice(0, 4);

  const confirmDelete = async () => {
    if (!deletingTask) return;
    setIsDeleting(true);
    try {
      await handleDelete(deletingTask.id);
      setDeletingTask(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {getGreeting()}, {displayName} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here is your daily activity and task progress overview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tasks.length === 0 && (
            <Button
              variant="outline"
              size="sm"
              icon={<Sparkles className="w-4 h-4 text-amber-500" />}
              onClick={handleSeed}
              title="Load standard mini-project sample tasks"
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

      {/* Error alert if any */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Tasks"
          value={loading ? '...' : stats.totalTasks}
          subtitle="All created"
          icon={<ListTodo className="w-5 h-5 text-indigo-600" />}
          iconBgClass="bg-indigo-50"
        />

        <StatCard
          title="To Do"
          value={loading ? '...' : stats.pendingTasks}
          subtitle="Awaiting start"
          icon={<Clock className="w-5 h-5 text-slate-600" />}
          iconBgClass="bg-slate-100"
        />

        <StatCard
          title="In Progress"
          value={loading ? '...' : stats.inProgressTasks}
          subtitle="Actively working"
          icon={<PlayCircle className="w-5 h-5 text-blue-600" />}
          iconBgClass="bg-blue-50"
        />

        <StatCard
          title="Completed"
          value={loading ? '...' : stats.completedTasks}
          subtitle={`${stats.completionPercentage}% achieved`}
          icon={<CheckSquare className="w-5 h-5 text-emerald-600" />}
          iconBgClass="bg-emerald-50"
        />

        <StatCard
          title="Overdue"
          value={loading ? '...' : stats.overdueTasks}
          subtitle="Needs attention"
          icon={<AlertOctagon className="w-5 h-5 text-rose-600" />}
          iconBgClass="bg-rose-50"
          accentBorderClass={stats.overdueTasks > 0 ? 'border-rose-300' : 'border-slate-200'}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CompletionChart stats={stats} />
        <PriorityDistribution stats={stats} />
      </div>

      {/* Two-Column Section: Today's Tasks & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Today's Tasks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-slate-900">Today's Tasks</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                {todayTasks.length}
              </span>
            </div>
            <Link
              to="/tasks"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {todayTasks.length > 0 ? (
              todayTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStatus={(t) => handleToggle(t.id, t.status)}
                  onEdit={(t) => setEditingTask(t)}
                  onDelete={(t) => setDeletingTask(t)}
                />
              ))
            ) : (
              <TaskEmptyState type="no-today-tasks" />
            )}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-semibold text-slate-900">Upcoming Tasks</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                {upcomingTasks.length}
              </span>
            </div>
            <Link
              to="/tasks"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Manage tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStatus={(t) => handleToggle(t.id, t.status)}
                  onEdit={(t) => setEditingTask(t)}
                  onDelete={(t) => setDeletingTask(t)}
                />
              ))
            ) : (
              <TaskEmptyState type="no-upcoming-tasks" />
            )}
          </div>
        </div>
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskFormModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={async (data: TaskFormData) => {
            await handleUpdate(editingTask.id, data);
            setEditingTask(null);
          }}
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
