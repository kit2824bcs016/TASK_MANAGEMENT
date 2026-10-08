import React from 'react';
import { Menu, LogOut, CheckSquare, Plus, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenCreateTask?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onOpenCreateTask,
}) => {
  const { user, userProfile, logout } = useAuth();

  const displayName = userProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & App Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-semibold text-slate-900 tracking-tight block leading-tight">
                TaskFlow
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:block leading-none">
                Personal Task Management
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick actions & User profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenCreateTask && (
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={onOpenCreateTask}
              className="hidden sm:inline-flex"
            >
              New Task
            </Button>
          )}

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 text-left">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-xs border border-indigo-200 shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block leading-tight">
              <p className="text-xs font-semibold text-slate-800 truncate max-w-[120px]">
                {displayName}
              </p>
              <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                {user?.email}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            icon={<LogOut className="w-4 h-4" />}
            aria-label="Sign out"
            title="Sign out"
            className="text-slate-500 hover:text-rose-600"
          >
            <span className="hidden lg:inline">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
