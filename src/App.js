import React from 'react';
import './index.css';
import { useScorecard } from './hooks/useScorecard';
import ProgressBar from './components/ProgressBar';
import SectionNav from './components/SectionNav';
import SectionScreen from './components/SectionScreen';
import ResultsScreen from './components/results/ResultsScreen';

function LandingScreen({ onStart, meta }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* Logo / brand */}
        <div className="inline-flex items-center gap-2 bg-brand/20 border border-brand/30 rounded-full px-5 py-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <span className="text-sm font-bold text-brand tracking-widest uppercase">GOVERN·AI</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
          AI Governance Audit<br />
          <span className="text-brand">Readiness Scorecard</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-6 max-w-xl mx-auto">
          Assess your organisation's AI governance maturity across 7 critical domains.
          Get a compliance score, identify your top risk gaps, and download a board-ready PDF report.
        </p>

        {/* Framework badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {meta?.frameworks?.map((fw, i) => (
            <span key={i} className="bg-slate-800 border border-slate-700 text-slate-300 rounded-full text-xs font-semibold px-3 py-1">
              {fw}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { num: '32', label: 'Questions', icon: '❓' },
            { num: '7', label: 'Domains', icon: '📐' },
            { num: '~10 min', label: 'To complete', icon: '⏱' },
          ].map((s) => (
            <div key={s.label} className="card p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-bold text-white">{s.num}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <button
          className="btn-primary text-base px-10 py-4 text-lg shadow-lg shadow-brand/20"
          onClick={onStart}
        >
          Start Assessment →
        </button>

        <p className="mt-6 text-xs text-slate-600">
          Self-assessment only — not a formal regulatory audit. All answers remain in your browser session.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const scorecard = useScorecard();
  const [started, setStarted] = React.useState(false);

  if (!started) {
    return <LandingScreen onStart={() => setStarted(true)} meta={scorecard.meta} />;
  }

  if (scorecard.showResults) {
    return (
      <div className="min-h-screen">
        <ProgressBar
          progressPct={scorecard.progressPct}
          currentSectionIdx={scorecard.currentSectionIdx}
          totalSections={scorecard.sections.length}
        />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <ResultsScreen
            sections={scorecard.sections}
            metaData={scorecard.meta}
            answers={scorecard.answers}
            sectionScores={scorecard.sectionScores}
            sectionMaxScores={scorecard.sectionMaxScores}
            sectionPcts={scorecard.sectionPcts}
            overallScore={scorecard.overallScore}
            overallPct={scorecard.overallPct}
            scoreBand={scorecard.scoreBand}
            riskGaps={scorecard.riskGaps}
            onReset={() => { scorecard.reset(); setStarted(false); }}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ProgressBar
        progressPct={scorecard.progressPct}
        currentSectionIdx={scorecard.currentSectionIdx}
        totalSections={scorecard.sections.length}
      />
      <div className="max-w-5xl mx-auto px-4 py-8 flex gap-8">
        <SectionNav
          sections={scorecard.sections}
          currentSectionIdx={scorecard.currentSectionIdx}
          answers={scorecard.answers}
        />
        <main className="flex-1 min-w-0">
          <SectionScreen
            section={scorecard.currentSection}
            sectionIdx={scorecard.currentSectionIdx}
            answers={scorecard.answers}
            onAnswer={scorecard.setAnswer}
            onNext={scorecard.goNext}
            onPrev={scorecard.goPrev}
            isFirst={scorecard.currentSectionIdx === 0}
            isLast={scorecard.currentSectionIdx === scorecard.sections.length - 1}
            isSectionComplete={scorecard.isSectionComplete}
            sectionScore={scorecard.sectionScores[scorecard.currentSectionIdx]}
            sectionMaxScore={scorecard.sectionMaxScores[scorecard.currentSectionIdx]}
          />
        </main>
      </div>
    </div>
  );
}
