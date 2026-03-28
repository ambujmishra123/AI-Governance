import React from 'react';
import QuestionCard from './QuestionCard';

const SECTION_ICONS = ['📋', '🔒', '👁️', '🎓', '🤝', '⚠️', '🔍'];

export default function SectionScreen({
  section,
  sectionIdx,
  answers,
  onAnswer,
  onNext,
  onPrev,
  isFirst,
  isLast,
  isSectionComplete,
  sectionScore,
  sectionMaxScore,
}) {
  const answeredCount = section.questions.filter(
    (q) => answers[q.id] !== undefined
  ).length;
  const totalCount = section.questions.length;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Section header */}
      <div className="card p-6">
        <div className="flex items-center gap-4">
          <span className="text-3xl">{SECTION_ICONS[sectionIdx]}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-brand uppercase tracking-widest">
                Section {sectionIdx + 1}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white leading-tight">{section.title}</h2>
            <p className="text-sm text-slate-400 mt-1">{section.description}</p>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-2xl font-bold text-white">{answeredCount}/{totalCount}</div>
            <div className="text-xs text-slate-500">answered</div>
          </div>
        </div>

        {/* Mini progress bar for section */}
        <div className="mt-4 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full bar-fill-animate"
            style={{ width: `${Math.round((answeredCount / totalCount) * 100)}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-4">
        {section.questions.map((q, qi) => (
          <QuestionCard
            key={q.id}
            question={q}
            answer={answers[q.id]}
            onAnswer={onAnswer}
            questionNumber={q.num}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-2 pb-8">
        <button
          className="btn-secondary"
          onClick={onPrev}
          disabled={isFirst}
        >
          ← Back
        </button>
        <button
          className="btn-primary"
          onClick={onNext}
          disabled={!isSectionComplete}
        >
          {isLast ? '📊 View Results' : 'Next Section →'}
        </button>
      </div>
    </div>
  );
}
