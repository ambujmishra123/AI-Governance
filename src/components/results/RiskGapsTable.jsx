import React from 'react';

function tagClass(tag) {
  const t = tag.toLowerCase();
  if (t.includes('rbi')) return 'reg-tag reg-rbi';
  if (t.includes('dpdp')) return 'reg-tag reg-dpdp';
  return 'reg-tag reg-eu';
}

export default function RiskGapsTable({ riskGaps }) {
  if (!riskGaps || riskGaps.length === 0) {
    return (
      <div className="card p-6 text-center">
        <p className="text-green-400 font-semibold text-lg">🎉 No critical risk gaps detected!</p>
        <p className="text-slate-400 text-sm mt-1">All high-risk questions answered at maximum score.</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-bold text-white mb-5">
        ⚡ Top {riskGaps.length} Risk Gaps &amp; Recommended Actions
      </h3>
      <div className="flex flex-col gap-4">
        {riskGaps.map((gap, idx) => (
          <div
            key={gap.id}
            className="border border-slate-700 rounded-xl p-4 bg-slate-800/40 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-start gap-3">
              {/* Rank number */}
              <div className="shrink-0 w-7 h-7 rounded-full bg-red-950 border border-red-800 flex items-center justify-center">
                <span className="text-red-400 text-xs font-bold">{idx + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                {/* Section + risk row */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs text-slate-500">{gap.sectionTitle}</span>
                  <span className="risk-pill risk-high">High Risk</span>
                  <span className="text-xs text-red-400 font-semibold">
                    −{gap.pointsLost} pts
                  </span>
                </div>
                {/* Question */}
                <p className="text-sm font-semibold text-white leading-snug mb-2">
                  Q{gap.num}: {gap.text}
                </p>
                {/* Guidance / recommended action */}
                <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-3 mb-3">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <span className="text-brand font-semibold">Recommended action: </span>
                    {gap.guidance}
                  </p>
                </div>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {gap.tags?.map((tag, ti) => (
                    <span key={ti} className={tagClass(tag)}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
