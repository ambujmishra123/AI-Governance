import React, { useState } from 'react';
import ScoreGauge from './ScoreGauge';
import SectionBreakdown from './SectionBreakdown';
import RiskGapsTable from './RiskGapsTable';
import { generatePDF } from '../pdf/PdfGenerator';

export default function ResultsScreen({
  sections,
  metaData,
  answers,
  sectionScores,
  sectionMaxScores,
  sectionPcts,
  overallScore,
  overallPct,
  scoreBand,
  riskGaps,
  onReset,
}) {
  const [generating, setGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [assessedBy, setAssessedBy] = useState('');

  const handleDownload = () => {
    setGenerating(true);
    try {
      const filename = `AI-Governance-Report-${new Date().toISOString().slice(0, 10)}.pdf`;
      generatePDF({
        sections, metaData, answers,
        sectionScores, sectionMaxScores, sectionPcts,
        overallScore, overallPct, scoreBand, riskGaps,
        companyName, assessedBy,
        reportDate: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
        filename,
      });
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed: ' + err.message);
    } finally {
      setGenerating(false);
      setShowModal(false);
    }
  };

  const bandColors = {
    '#1D9E75': 'border-green-500 bg-green-950/30',
    '#EF9F27': 'border-amber-500 bg-amber-950/30',
    '#E85D24': 'border-orange-500 bg-orange-950/30',
    '#E24B4A': 'border-red-500 bg-red-950/30',
  };
  const bandBorder = bandColors[scoreBand?.color] || 'border-slate-600 bg-slate-900';

  return (
    <>

      {/* Company info modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="card p-8 w-full max-w-md mx-4 animate-slide-up">
            <h3 className="text-lg font-bold text-white mb-2">Before Downloading</h3>
            <p className="text-sm text-slate-400 mb-6">Optionally add your details to personalise the report cover page.</p>
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Acme Fintech Pvt. Ltd."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Assessed by</label>
                <input
                  type="text"
                  value={assessedBy}
                  onChange={e => setAssessedBy(e.target.value)}
                  placeholder="Head of GRC"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button className="btn-secondary flex-1" onClick={() => setShowModal(false)}>Cancel</button>
              <button
                className="btn-primary flex-1"
                onClick={handleDownload}
                disabled={generating}
              >
                {generating ? (
                  <><span className="animate-spin">⟳</span> Generating…</>
                ) : (
                  '⬇ Download PDF'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6 animate-fade-in">
        {/* Hero score section */}
        <div className={`card p-8 border-2 ${bandBorder}`}>
          <div className="text-center mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Assessment Complete</span>
            <h2 className="text-2xl font-bold text-white mt-1">Your AI Governance Score</h2>
          </div>
          <ScoreGauge
            overallPct={overallPct}
            overallScore={overallScore}
            maxScore={metaData?.maxScore}
            scoreBand={scoreBand}
          />

          {/* Score summary stat chips */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="text-center bg-slate-800/60 rounded-xl p-3">
              <div className="text-xl font-bold text-red-400">{riskGaps.length}</div>
              <div className="text-xs text-slate-500 mt-0.5">Critical Gaps</div>
            </div>
            <div className="text-center bg-slate-800/60 rounded-xl p-3">
              <div className="text-xl font-bold text-white">{32}</div>
              <div className="text-xs text-slate-500 mt-0.5">Questions Assessed</div>
            </div>
            <div className="text-center bg-slate-800/60 rounded-xl p-3">
              <div className="text-xl font-bold text-brand">{metaData?.frameworks?.length || 3}</div>
              <div className="text-xs text-slate-500 mt-0.5">Frameworks Covered</div>
            </div>
          </div>

          {/* Framework tags */}
          <div className="mt-4 flex justify-center flex-wrap gap-2">
            {metaData?.frameworks?.map((fw, i) => (
              <span key={i} className="text-xs bg-slate-800 border border-slate-700 text-slate-400 rounded-full px-3 py-1">
                {fw}
              </span>
            ))}
          </div>
        </div>

        {/* Section breakdown */}
        <SectionBreakdown
          sections={sections}
          sectionScores={sectionScores}
          sectionMaxScores={sectionMaxScores}
          sectionPcts={sectionPcts}
        />

        {/* Risk gaps */}
        <RiskGapsTable riskGaps={riskGaps} />

        {/* Action buttons */}
        <div className="flex gap-4 justify-center pt-2 pb-8">
          <button className="btn-secondary" onClick={onReset}>
            ↺ Retake Assessment
          </button>
          <button
            className="btn-primary text-base px-8 py-3.5"
            onClick={() => setShowModal(true)}
            disabled={generating}
          >
            ⬇ Download PDF Report
          </button>
        </div>
      </div>
    </>
  );
}
