import React from 'react';

export default function ProgressBar({ progressPct, currentSectionIdx, totalSections }) {
  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 px-6 py-3">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs font-semibold text-brand">GOVERN·AI</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-400 font-medium">
              Section {currentSectionIdx + 1} of {totalSections}
            </span>
            <span className="text-xs font-bold text-brand">{progressPct}% complete</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full bar-fill-animate"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
