import React from 'react';

function tagClass(tag) {
  const t = tag.toLowerCase();
  if (t.includes('rbi')) return 'reg-tag reg-rbi';
  if (t.includes('dpdp')) return 'reg-tag reg-dpdp';
  return 'reg-tag reg-eu';
}

export default function QuestionCard({ question, answer, onAnswer, questionNumber }) {
  const isSingleChoice = question.type === 'single_choice';
  const isMultiChoice = question.type === 'multi_choice';

  const handleSingleClick = (idx) => {
    onAnswer(question.id, idx);
  };

  const handleMultiClick = (idx) => {
    const current = Array.isArray(answer) ? answer : [];
    if (current.includes(idx)) {
      onAnswer(question.id, current.filter((i) => i !== idx));
    } else {
      onAnswer(question.id, [...current, idx]);
    }
  };

  const isOptionSelected = (idx) => {
    if (isSingleChoice) return answer === idx;
    if (isMultiChoice) return Array.isArray(answer) && answer.includes(idx);
    return false;
  };

  const riskColor = {
    high: 'text-red-400',
    med: 'text-amber-400',
    low: 'text-green-400',
  }[question.risk] || 'text-slate-400';

  return (
    <div className="card p-6 animate-slide-up">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="shrink-0 w-8 h-8 rounded-lg bg-brand/20 text-brand text-sm font-bold flex items-center justify-center">
            {questionNumber}
          </span>
          <span className={`text-xs font-bold uppercase tracking-wider ${riskColor}`}>
            {question.risk === 'high' ? '⚡ High Risk' : question.risk === 'med' ? '● Medium Risk' : '○ Low Risk'}
          </span>
        </div>
        {isMultiChoice && (
          <span className="shrink-0 text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-full border border-slate-700">
            Select all that apply
          </span>
        )}
      </div>

      {/* Question text */}
      <p className="text-base font-medium text-slate-100 leading-relaxed mb-5">
        {question.text}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-2.5 mb-5">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            className={`option-btn ${isOptionSelected(idx) ? 'selected' : ''}`}
            onClick={() => isSingleChoice ? handleSingleClick(idx) : handleMultiClick(idx)}
          >
            <div className="flex items-center gap-3">
              <span className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                ${isOptionSelected(idx)
                  ? 'border-brand bg-brand'
                  : 'border-slate-600'
                }`}>
                {isOptionSelected(idx) && (
                  <span className="w-2 h-2 rounded-full bg-white block" />
                )}
              </span>
              <span className="text-sm text-slate-200">{opt.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Regulation tags */}
      {question.tags && question.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {question.tags.map((tag, i) => (
            <span key={i} className={tagClass(tag)}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Guidance — show when answered */}
      {answer !== undefined && question.guidance && (
        <div className="mt-3 p-3 bg-slate-800/60 border border-slate-700 rounded-lg">
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="text-brand font-semibold">💡 Guidance: </span>
            {question.guidance}
          </p>
        </div>
      )}
    </div>
  );
}
