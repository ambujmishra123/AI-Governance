import React from 'react';

function getBarColor(pct) {
  if (pct >= 80) return '#1D9E75';
  if (pct >= 60) return '#EF9F27';
  if (pct >= 40) return '#E85D24';
  return '#E24B4A';
}

const SECTION_ICONS = ['📋', '🔒', '👁️', '🎓', '🤝', '⚠️', '🔍'];

export default function SectionBreakdown({ sections, sectionScores, sectionMaxScores, sectionPcts }) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-bold text-white mb-5">Score by Governance Domain</h3>
      <div className="flex flex-col gap-4">
        {sections.map((section, idx) => {
          const pct = sectionPcts[idx];
          const color = getBarColor(pct);
          return (
            <div key={section.id}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{SECTION_ICONS[idx]}</span>
                  <span className="text-sm font-medium text-slate-200">{section.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    {sectionScores[idx]}/{sectionMaxScores[idx]} pts
                  </span>
                  <span
                    className="text-xs font-bold w-10 text-right"
                    style={{ color }}
                  >
                    {pct}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bar-fill-animate"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: color,
                    transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
