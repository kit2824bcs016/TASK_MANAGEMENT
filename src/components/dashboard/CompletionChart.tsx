import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DashboardStatistics } from '../../types';

export interface CompletionChartProps {
  stats: DashboardStatistics;
}

export const CompletionChart: React.FC<CompletionChartProps> = ({ stats }) => {
  const data = [
    { name: 'To Do', value: stats.pendingTasks, color: '#94a3b8' }, // slate-400
    { name: 'In Progress', value: stats.inProgressTasks, color: '#3b82f6' }, // blue-500
    { name: 'Completed', value: stats.completedTasks, color: '#10b981' }, // emerald-500
  ];

  const hasData = stats.totalTasks > 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs text-left">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Task Completion</h3>
          <p className="text-xs text-slate-500">Overall progress across all tasks</p>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-indigo-600">
            {stats.completionPercentage}%
          </span>
          <span className="text-xs text-slate-400 block">completed</span>
        </div>
      </div>

      {/* Visual progress bar */}
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-5 flex">
        {stats.totalTasks > 0 ? (
          <>
            <div
              style={{ width: `${(stats.completedTasks / stats.totalTasks) * 100}%` }}
              className="bg-emerald-500 h-full transition-all duration-500"
              title={`Completed: ${stats.completedTasks}`}
            />
            <div
              style={{ width: `${(stats.inProgressTasks / stats.totalTasks) * 100}%` }}
              className="bg-blue-500 h-full transition-all duration-500"
              title={`In Progress: ${stats.inProgressTasks}`}
            />
            <div
              style={{ width: `${(stats.pendingTasks / stats.totalTasks) * 100}%` }}
              className="bg-slate-300 h-full transition-all duration-500"
              title={`To Do: ${stats.pendingTasks}`}
            />
          </>
        ) : (
          <div className="w-full bg-slate-200 h-full" />
        )}
      </div>

      {/* Chart container */}
      <div className="h-44 w-full relative flex items-center justify-center">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: any, name: any) => [`${val} tasks`, name]}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f8',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-xs text-slate-400">
            No tasks to display yet.
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
        <div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>To Do</span>
          </div>
          <span className="text-sm font-semibold text-slate-800">
            {stats.pendingTasks}
          </span>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>In Progress</span>
          </div>
          <span className="text-sm font-semibold text-slate-800">
            {stats.inProgressTasks}
          </span>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Completed</span>
          </div>
          <span className="text-sm font-semibold text-slate-800">
            {stats.completedTasks}
          </span>
        </div>
      </div>
    </div>
  );
};
