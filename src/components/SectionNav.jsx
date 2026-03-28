import React from 'react';

const SECTION_ICONS = ['📋', '🔒', '👁️', '🎓', '🤝', '⚠️', '🔍'];

export default function SectionNav({ sections, currentSectionIdx, answers }) {
  const getSectionStatus = (section, idx) => {
    if (idx < currentSectionIdx) return 'done';
    if (idx === currentSectionIdx) return 'active';
    return 'todo';
  };

  return (
    <aside className="hidden lg:flex flex-col gap-1 w-56 shrink-0 pt-2">
      {sections.map((section, idx) => {
        const status = getSectionStatus(section, idx);
        return (
          <div
            key={section.id}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
              ${status === 'active' ? 'bg-brand/10 border border-brand/30' : ''}
              ${status === 'done' ? 'opacity-60' : ''}
              ${status === 'todo' ? 'opacity-30' : ''}
            `}
          >
            <span className="text-sm">{SECTION_ICONS[idx]}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold truncate leading-tight
                ${status === 'active' ? 'text-brand' : 'text-slate-400'}`}>
                {section.title}
              </p>
              <p className="text-[10px] text-slate-600 mt-0.5">
                {section.questions.length} questions
              </p>
            </div>
            {status === 'done' && (
              <span className="text-brand text-xs">✓</span>
            )}
            {status === 'active' && (
              <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 animate-pulse" />
            )}
          </div>
        );
      })}
    </aside>
  );
}
