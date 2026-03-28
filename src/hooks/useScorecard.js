import { useState, useCallback } from 'react';
import questionsData from '../data/ai_governance_questions.json';

const { meta, sections } = questionsData;

// Compute max weight per section
const sectionMaxScores = sections.map((section) =>
  section.questions
    .filter((q) => q.type === 'single_choice')
    .reduce((sum, q) => sum + q.weight, 0)
);

const totalMaxScore = meta.maxScore; // 200

export function useScorecard() {
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { Q1: optionIndex, Q3: [0,2], ... }
  const [showResults, setShowResults] = useState(false);

  const totalScoredQuestions = sections.reduce(
    (sum, s) => sum + s.questions.length,
    0
  ); // 32

  const totalAnswered = Object.keys(answers).length;
  const progressPct = Math.round((totalAnswered / totalScoredQuestions) * 100);

  // Scoring
  const sectionScores = sections.map((section) => {
    let earned = 0;
    section.questions.forEach((q) => {
      if (q.type === 'single_choice') {
        const ans = answers[q.id];
        if (ans !== undefined && ans !== null) {
          earned += q.options[ans]?.score ?? 0;
        }
      }
      // multi_choice (Q3) is informational — no score
    });
    return earned;
  });

  const overallScore = sectionScores.reduce((a, b) => a + b, 0);
  const overallPct = Math.round((overallScore / totalMaxScore) * 100);

  const scoreBand = meta.scoreBands.find(
    (b) => overallScore >= b.min && overallScore <= b.max
  ) || meta.scoreBands[meta.scoreBands.length - 1];

  // Section completion percentages
  const sectionPcts = sections.map((section, idx) => {
    const max = sectionMaxScores[idx];
    return max > 0 ? Math.round((sectionScores[idx] / max) * 100) : 0;
  });

  // Top 5 risk gaps (from high-risk single_choice questions by pointsLost)
  const riskGaps = sections
    .flatMap((section) =>
      section.questions
        .filter((q) => q.type === 'single_choice' && q.risk === 'high')
        .map((q) => {
          const ans = answers[q.id];
          const chosenScore = ans !== undefined ? (q.options[ans]?.score ?? 0) : 0;
          const pointsLost = q.weight - chosenScore;
          return { ...q, sectionTitle: section.title, pointsLost, chosenScore };
        })
    )
    .filter((g) => g.pointsLost > 0)
    .sort((a, b) => b.pointsLost - a.pointsLost)
    .slice(0, 5);

  const setAnswer = useCallback((qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  }, []);

  const goNext = useCallback(() => {
    if (currentSectionIdx < sections.length - 1) {
      setCurrentSectionIdx((i) => i + 1);
    } else {
      setShowResults(true);
    }
  }, [currentSectionIdx]);

  const goPrev = useCallback(() => {
    if (showResults) {
      setShowResults(false);
    } else if (currentSectionIdx > 0) {
      setCurrentSectionIdx((i) => i - 1);
    }
  }, [currentSectionIdx, showResults]);

  const reset = useCallback(() => {
    setAnswers({});
    setCurrentSectionIdx(0);
    setShowResults(false);
  }, []);

  // Helper: check if current section is fully answered
  const currentSection = sections[currentSectionIdx];
  const isSectionComplete = currentSection?.questions.every(
    (q) => answers[q.id] !== undefined
  );

  return {
    sections,
    meta,
    currentSectionIdx,
    currentSection,
    answers,
    showResults,
    progressPct,
    totalAnswered,
    totalScoredQuestions,
    sectionScores,
    sectionMaxScores,
    sectionPcts,
    overallScore,
    overallPct,
    scoreBand,
    riskGaps,
    isSectionComplete,
    setAnswer,
    goNext,
    goPrev,
    reset,
    setShowResults,
  };
}
