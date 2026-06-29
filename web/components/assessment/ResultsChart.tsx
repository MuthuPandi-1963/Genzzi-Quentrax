"use client";

import React, { useMemo } from 'react';

interface ResultsChartProps {
  correct: number;
  incorrect: number;
  unanswered: number;
  total: number;
}

export default function ResultsChart({ correct, incorrect, unanswered, total }: ResultsChartProps) {
  const data = useMemo(() => {
    return [
      { name: 'Correct', value: correct, color: '#10b981' }, // emerald-500
      { name: 'Incorrect', value: incorrect, color: '#ef4444' }, // red-500
      { name: 'Unanswered', value: unanswered, color: '#94a3b8' }, // slate-400
    ].filter(item => item.value > 0);
  }, [correct, incorrect, unanswered]);

  // Simple SVG Pie Chart logic
  const radius = 50;
  const cx = 50;
  const cy = 50;

  let currentAngle = 0;

  const paths = data.map((item, i) => {
    const fraction = item.value / total;
    const isFullCircle = fraction === 1;
    
    if (isFullCircle) {
      return (
        <circle 
          key={item.name}
          cx={cx} 
          cy={cy} 
          r={radius} 
          fill={item.color} 
        />
      );
    }

    const startAngle = currentAngle;
    const endAngle = currentAngle + fraction * 360;

    const x1 = cx + radius * Math.cos((Math.PI * startAngle) / 180);
    const y1 = cy + radius * Math.sin((Math.PI * startAngle) / 180);
    
    const x2 = cx + radius * Math.cos((Math.PI * endAngle) / 180);
    const y2 = cy + radius * Math.sin((Math.PI * endAngle) / 180);

    const largeArcFlag = fraction > 0.5 ? 1 : 0;

    const pathData = [
      `M ${cx} ${cy}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `Z`
    ].join(' ');

    currentAngle = endAngle;

    return (
      <path
        key={item.name}
        d={pathData}
        fill={item.color}
        className="transition-all duration-300 hover:opacity-80 cursor-pointer"
      />
    );
  });

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-6">
      <svg viewBox="0 0 100 100" className="w-48 h-48 drop-shadow-xl transform -rotate-90">
        {paths}
        <circle cx={cx} cy={cy} r={radius * 0.5} fill="currentColor" className="text-white dark:text-[#0B0A10]" />
      </svg>

      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Answer Distribution</h3>
        {data.map(item => (
          <div key={item.name} className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="font-medium text-gray-700 dark:text-gray-300 w-24">{item.name}</span>
            <span className="font-bold text-gray-900 dark:text-white">
              {item.value} <span className="text-xs text-gray-500 font-normal">({Math.round((item.value / total) * 100)}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
