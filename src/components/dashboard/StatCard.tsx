import React from 'react';

export interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  iconBgClass: string;
  accentBorderClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBgClass,
  accentBorderClass = 'border-slate-200',
}) => {
  return (
    <div
      className={`bg-white rounded-xl border ${accentBorderClass} p-4 sm:p-5 shadow-2xs text-left transition-all hover:shadow-xs`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 font-normal">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl shrink-0 ${iconBgClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
