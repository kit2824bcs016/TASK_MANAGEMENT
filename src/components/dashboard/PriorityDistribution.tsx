import React from 'react';
import { DashboardStatistics } from '../../types';
import { TASK_CATEGORIES } from '../../lib/constants';

export interface PriorityDistributionProps {
  stats: DashboardStatistics;
}

export const PriorityDistribution: React.FC<PriorityDistributionProps> = ({ stats }) => {
  const total = stats.totalTasks || 1;

  const priorities = [
    {
      label: 'High Priority',
      count: stats.priorityCounts.HIGH,
      percentage: Math.round((stats.priorityCounts.HIGH / total) * 100),
      color: 'bg-rose-500',
      textColor: 'text-rose-700',
      bgLight: 'bg-rose-50',
    },
    {
      label: 'Medium Priority',
      count: stats.priorityCounts.MEDIUM,
      percentage: Math.round((stats.priorityCounts.MEDIUM / total) * 100),
      color: 'bg-amber-500',
      textColor: 'text-amber-700',
      bgLight: 'bg-amber-50',
    },
    {
      label: 'Low Priority',
      count: stats.priorityCounts.LOW,
      percentage: Math.round((stats.priorityCounts.LOW / total) * 100),
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      bgLight: 'bg-emerald-50',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs text-left space-y-5">
      <div>
        <h3 className="text-base font-semibold text-slate-900">Task Priorities</h3>
        <p className="text-xs text-slate-500">Distribution by urgency level</p>
      </div>

      <div className="space-y-3.5">
        {priorities.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-700">{item.label}</span>
              <span className="text-slate-500">
                <span className="font-semibold text-slate-800">{item.count}</span> tasks ({item.percentage}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${stats.totalTasks > 0 ? item.percentage : 0}%` }}
                className={`h-full ${item.color} rounded-full transition-all duration-500`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Category distribution */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
          By Category
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {TASK_CATEGORIES.map((cat) => {
            const count = stats.categoryCounts[cat] || 0;
            return (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-slate-50 border border-slate-200 text-slate-700"
              >
                <span>{cat}</span>
                <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] font-semibold flex items-center justify-center">
                  {count}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
