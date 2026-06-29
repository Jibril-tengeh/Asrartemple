import React from 'react';

interface ActivityGraphProps {
  data: { [date: string]: number }; // e.g. "YYYY-MM-DD": count
}

export const ActivityGraph: React.FC<ActivityGraphProps> = ({ data }) => {
  // Generate last 30 days
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split('T')[0];
  });

  const maxCount = Math.max(1, ...Object.values(data));

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    const intensity = count / maxCount;
    if (intensity < 0.25) return 'bg-emerald-200 dark:bg-emerald-900';
    if (intensity < 0.5) return 'bg-emerald-300 dark:bg-emerald-700';
    if (intensity < 0.75) return 'bg-emerald-400 dark:bg-emerald-600';
    return 'bg-emerald-500 dark:bg-emerald-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Assiduité (30 derniers jours)</h3>
      <div className="flex flex-wrap gap-1">
        {days.map((day) => {
          const count = data[day] || 0;
          return (
            <div
              key={day}
              title={`${day}: ${count} actions`}
              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-sm ${getColor(count)}`}
            ></div>
          );
        })}
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
        <span>Moins</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800"></div>
          <div className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900"></div>
          <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-600"></div>
          <div className="w-3 h-3 rounded-sm bg-emerald-500 dark:bg-emerald-500"></div>
        </div>
        <span>Plus</span>
      </div>
    </div>
  );
};
