import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { TaskFormModal } from '../tasks/TaskFormModal';
import { useTasks } from '../../hooks/useTasks';

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { handleCreate } = useTasks();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased">
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onOpenCreateTask={() => setIsCreateModalOpen(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpenCreateTask={() => setIsCreateModalOpen(true)}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <Outlet context={{ openCreateTaskModal: () => setIsCreateModalOpen(true) }} />
        </main>
      </div>

      <TaskFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
        title="Create New Task"
        submitLabel="Create Task"
      />
    </div>
  );
};
