import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Settings,
  Plus,
  X,
  ClipboardCheck,
} from 'lucide-react';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateTask?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onOpenCreateTask,
}) => {
  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      to: '/tasks',
      label: 'My Tasks',
      icon: <CheckSquare className="w-5 h-5" />,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
    {
      to: '/tests',
      label: 'System Tests & Viva',
      icon: <ClipboardCheck className="w-5 h-5" />,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 md:hidden backdrop-blur-2xs"
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 z-40 md:z-20 h-screen md:h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out shrink-0 flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 flex flex-col h-full overflow-y-auto">
          {/* Mobile close button */}
          <div className="flex items-center justify-between md:hidden pb-3 border-b border-slate-100 mb-3">
            <span className="text-sm font-semibold text-slate-800">Navigation</span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Create Task button for mobile / sidebar */}
          {onOpenCreateTask && (
            <div className="mb-4">
              <button
                onClick={() => {
                  onClose();
                  onOpenCreateTask();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Task</span>
              </button>
            </div>
          )}

          {/* Nav links */}
          <nav className="space-y-1.5 flex-1" aria-label="Main Navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Empty spacer / blank footer */}
          <div className="mt-auto" />
        </div>
      </aside>
    </>
  );
};
