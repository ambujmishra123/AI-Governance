import React from 'react';

function getAnswerClass(score, maxScore) {
  if (score === maxScore) return 'pass';
  if (score === 0) return 'fail';
  return 'part';
}

function getAnsSymbol(score, maxScore) {
  if (score === maxScore) return '✓';
  if (score === 0) return '✗';
  return '~';
}

const SECTION_ICONS = ['📋', '🔒', '👁️', '🎓', '🤝', '⚠️', '🔍'];

export default function ReportDocument({
  reportRef,
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
  companyName,
  assessedBy,
  reportDate,
}) {
  const topGaps = riskGaps.slice(0, 5);

  return (
    <div
      ref={reportRef}
      style={{
        position: 'absolute',
        left: '-9999px',
        top: 0,
        width: '794px',
        fontFamily: "'Segoe UI', Arial, sans-serif",
        fontSize: '12px',
        color: '#1a1a1a',
        background: '#f0f0f0',
      }}
    >

      {/* ── PAGE 1: COVER ── */}
      <div className="pdf-page" style={{
        width: '794px', background: '#fff', marginBottom: '40px',
        padding: '56px 64px', borderRadius: '4px',
      }}>
        <div style={{ textAlign: 'center', padding: '60px 0 40px' }}>
          <div style={{
            display: 'inline-block', background: '#0F6E56', color: '#fff',
            fontSize: '13px', fontWeight: 700, letterSpacing: '1px',
            padding: '8px 18px', borderRadius: '4px', marginBottom: '40px',
          }}>GOVERN·AI</div>

          <div style={{ fontSize: '28px', fontWeight: 700, color: '#0F6E56', marginBottom: '10px', lineHeight: '1.2' }}>
            AI Governance Audit<br />Readiness Report
          </div>
          <div style={{ fontSize: '14px', color: '#555', marginBottom: '40px' }}>
            Assessed against RBI IT Governance Framework, EU AI Act, and India DPDP Act 2023
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
            <div style={{
              display: 'inline-flex', flexDirection: 'column', gap: '8px', textAlign: 'left',
              background: '#f7f7f5', border: '1px solid #e0e0da', borderRadius: '6px',
              padding: '20px 28px', minWidth: '320px',
            }}>
              <div style={{ fontSize: '12px', color: '#444' }}><strong>Company:</strong> {companyName || 'Your Organisation'}</div>
              <div style={{ fontSize: '12px', color: '#444' }}><strong>Assessed by:</strong> {assessedBy || 'Head of GRC'}</div>
              <div style={{ fontSize: '12px', color: '#444' }}><strong>Date:</strong> {reportDate || new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</div>
              <div style={{ fontSize: '12px', color: '#444' }}><strong>Report ID:</strong> AGR-{new Date().getFullYear()}-{String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}</div>
            </div>
          </div>

          {/* Score badge */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '120px', height: '120px', borderRadius: '50%',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                border: `5px solid ${scoreBand?.color || '#0F6E56'}`, background: '#fff',
                margin: '0 auto',
              }}>
                <span style={{ fontSize: '32px', fontWeight: 700, color: scoreBand?.color || '#0F6E56', lineHeight: 1 }}>
                  {overallPct}<span style={{ fontSize: '14px' }}>%</span>
                </span>
                <span style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>
                  {overallScore} / {metaData?.maxScore} pts
                </span>
              </div>
              <div style={{ height: '12px' }} />
              <span style={{
                display: 'inline-block', padding: '7px 20px', borderRadius: '20px',
                fontWeight: 700, fontSize: '13px', background: `${scoreBand?.color}22`,
                color: scoreBand?.color || '#0F6E56', border: `1px solid ${scoreBand?.color}66`,
              }}>
                {scoreBand?.label}
              </span>
            </div>
          </div>

          <div style={{ fontSize: '12px', color: '#555', maxWidth: '440px', margin: '0 auto 28px', lineHeight: '1.6' }}>
            {scoreBand?.headline}
          </div>

          <div style={{
            fontSize: '10px', color: '#aaa', borderTop: '1px solid #e8e8e4',
            paddingTop: '20px', marginTop: '8px',
          }}>
            This report was generated using the AI Governance Readiness Scorecard. It is an internal self-assessment tool
            and does not constitute a formal regulatory audit or legal opinion.
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '12px', borderTop: '1px solid #e8e8e4', fontSize: '9px', color: '#bbb' }}>
          <span>GOVERN·AI — AI Governance Scorecard</span>
          <span>Confidential — Internal Use Only</span>
          <span>Page 1</span>
        </div>
      </div>

      {/* ── PAGE 2: EXECUTIVE SUMMARY ── */}
      <div className="pdf-page" style={{ width: '794px', background: '#fff', marginBottom: '40px', padding: '56px 64px', borderRadius: '4px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#0F6E56', marginBottom: '6px' }}>Executive Summary</div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '4px' }}>Assessment Overview</div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #0F6E56' }}>
          High-level scores across all 7 governance domains
        </div>

        {/* Score cards */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
          {[
            { num: `${overallPct}%`, label: 'Overall compliance score', color: scoreBand?.color, main: true },
            { num: topGaps.length, label: 'Critical gaps (high risk)', color: '#E24B4A' },
            { num: sections.reduce((s, sec) => s + sec.questions.filter(q => q.risk === 'med').length, 0), label: 'Medium risk questions', color: '#EF9F27' },
            { num: 32 - topGaps.length, label: 'Questions with adequate controls', color: '#1D9E75' },
          ].map((c, i) => (
            <div key={i} style={{
              flex: 1, border: `1px solid ${c.main ? (scoreBand?.color || '#0F6E56') : '#e0e0da'}`,
              borderRadius: '6px', padding: '14px', textAlign: 'center',
              background: c.main ? '#f0faf6' : '#fff',
            }}>
              <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '2px', color: c.color || '#111' }}>{c.num}</div>
              <div style={{ fontSize: '10px', color: '#777' }}>{c.label}</div>
            </div>
          ))}
        </div>

        {/* Section bars */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: '#222' }}>Score by governance domain</h3>
          {sections.map((section, idx) => {
            const pct = sectionPcts[idx];
            const barColor = pct >= 80 ? '#1D9E75' : pct >= 60 ? '#EF9F27' : '#E24B4A';
            return (
              <div key={section.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ fontSize: '11px', color: '#444', width: '200px', flexShrink: 0 }}>{section.title}</div>
                <div style={{ flex: 1, height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: '4px' }} />
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#333', width: '36px', textAlign: 'right' }}>{pct}%</div>
              </div>
            );
          })}
        </div>

        {/* Gap table */}
        <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px', color: '#222' }}>Top {topGaps.length} critical gaps</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '28px' }}>
          <thead>
            <tr>
              {['#', 'Gap', 'Risk', 'Regulation', 'Impact'].map(h => (
                <th key={h} style={{ fontSize: '10px', fontWeight: 700, textAlign: 'left', color: '#777', letterSpacing: '0.5px', padding: '6px 10px', background: '#f7f7f5', borderBottom: '1px solid #e0e0da' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topGaps.map((gap, i) => (
              <tr key={gap.id}>
                <td style={{ fontSize: '11px', padding: '10px', borderBottom: '1px solid #f0f0ea', fontWeight: 700, color: '#E24B4A' }}>{i + 1}</td>
                <td style={{ fontSize: '11px', padding: '10px', borderBottom: '1px solid #f0f0ea', color: '#333' }}>
                  Q{gap.num}: {gap.text.substring(0, 80)}{gap.text.length > 80 ? '…' : ''}
                </td>
                <td style={{ fontSize: '11px', padding: '10px', borderBottom: '1px solid #f0f0ea' }}>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 700, background: '#FCEBEB', color: '#A32D2D', whiteSpace: 'nowrap' }}>High</span>
                </td>
                <td style={{ fontSize: '11px', padding: '10px', borderBottom: '1px solid #f0f0ea' }}>
                  {gap.tags?.slice(0, 2).map((t, ti) => {
                    const tc = t.toLowerCase();
                    const bg = tc.includes('rbi') ? '#E6F1FB' : tc.includes('dpdp') ? '#EAF3DE' : '#EEEDFE';
                    const col = tc.includes('rbi') ? '#185FA5' : tc.includes('dpdp') ? '#3B6D11' : '#3C3489';
                    return <span key={ti} style={{ display: 'inline-block', padding: '1px 6px', borderRadius: '10px', fontSize: '9px', fontWeight: 600, marginRight: '3px', background: bg, color: col }}>{t.split(' ').slice(0, 3).join(' ')}</span>;
                  })}
                </td>
                <td style={{ fontSize: '11px', padding: '10px', borderBottom: '1px solid #f0f0ea', color: '#A32D2D', fontWeight: 600 }}>−{gap.pointsLost} pts</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '12px', borderTop: '1px solid #e8e8e4', fontSize: '9px', color: '#bbb' }}>
          <span>GOVERN·AI — AI Governance Scorecard</span>
          <span>Confidential — Internal Use Only</span>
          <span>Page 2</span>
        </div>
      </div>

      {/* ── PAGE 3: ACTION PLAN ── */}
      <div className="pdf-page" style={{ width: '794px', background: '#fff', marginBottom: '40px', padding: '56px 64px', borderRadius: '4px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#0F6E56', marginBottom: '6px' }}>Remediation</div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '4px' }}>Prioritised Action Plan</div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #0F6E56' }}>
          Top actions to close the highest-risk gaps, ordered by regulatory urgency
        </div>
        <ul style={{ listStyle: 'none', marginBottom: '28px' }}>
          {topGaps.map((gap, i) => (
            <li key={gap.id} style={{ display: 'flex', gap: '12px', padding: '12px 14px', border: '1px solid #e8e8e4', borderRadius: '6px', marginBottom: '8px', alignItems: 'flex-start' }}>
              <div style={{
                flexShrink: 0, width: '22px', height: '22px', borderRadius: '50%',
                background: '#0F6E56', color: '#fff', fontSize: '11px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px',
              }}>{i + 1}</div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#111', marginBottom: '2px' }}>
                  Q{gap.num}: {gap.text.substring(0, 60)}{gap.text.length > 60 ? '…' : ''}
                </div>
                <div style={{ fontSize: '11px', color: '#555', lineHeight: '1.5', marginBottom: '6px' }}>
                  {gap.guidance}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {gap.tags?.slice(0, 2).map((t, ti) => {
                    const tc = t.toLowerCase();
                    const bg = tc.includes('rbi') ? '#E6F1FB' : tc.includes('dpdp') ? '#EAF3DE' : '#EEEDFE';
                    const col = tc.includes('rbi') ? '#185FA5' : tc.includes('dpdp') ? '#3B6D11' : '#3C3489';
                    return <span key={ti} style={{ display: 'inline-block', padding: '1px 7px', borderRadius: '10px', fontSize: '9px', fontWeight: 600, background: bg, color: col }}>{t.split(' ').slice(0, 3).join(' ')}</span>;
                  })}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #e8e8e4', fontSize: '9px', color: '#bbb' }}>
          <span>GOVERN·AI — AI Governance Scorecard</span>
          <span>Confidential — Internal Use Only</span>
          <span>Page 3</span>
        </div>
      </div>

      {/* ── PAGE 4: DETAILED Q&A BREAKDOWN ── */}
      <div className="pdf-page" style={{ width: '794px', background: '#fff', marginBottom: '40px', padding: '56px 64px', borderRadius: '4px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#0F6E56', marginBottom: '6px' }}>Detail</div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '4px' }}>Question-level Responses</div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #0F6E56' }}>
          Full answer log across all 7 governance domains
        </div>
        {sections.map((section, sIdx) => {
          const pct = sectionPcts[sIdx];
          const pillBg = pct >= 80 ? '#E1F5EE' : pct >= 60 ? '#FAEEDA' : '#FCEBEB';
          const pillCol = pct >= 80 ? '#0F6E56' : pct >= 60 ? '#854F0B' : '#A32D2D';
          return (
            <div key={section.id} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: '#f7f7f5', borderRadius: '4px', marginBottom: '6px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#222', flex: 1 }}>
                  {SECTION_ICONS[sIdx]} {section.title}
                </div>
                <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 700, background: pillBg, color: pillCol }}>
                  {pct}% · {sectionScores[sIdx]}/{sectionMaxScores[sIdx]} pts
                </span>
              </div>
              {section.questions.filter(q => q.type === 'single_choice').map((q) => {
                const ans = answers[q.id];
                const chosenScore = ans !== undefined ? (q.options[ans]?.score ?? 0) : 0;
                const status = getAnswerClass(chosenScore, q.weight);
                const borderCol = status === 'pass' ? '#1D9E75' : status === 'fail' ? '#E24B4A' : '#EF9F27';
                const ansCol = status === 'pass' ? '#0F6E56' : status === 'fail' ? '#A32D2D' : '#854F0B';
                const sym = getAnsSymbol(chosenScore, q.weight);
                const optLabel = ans !== undefined ? q.options[ans]?.label : 'Not answered';
                return (
                  <div key={q.id} style={{ display: 'flex', gap: '10px', padding: '8px 12px', borderLeft: `3px solid ${borderCol}`, marginBottom: '5px', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, fontSize: '11px', color: '#333', lineHeight: '1.4' }}>
                      <strong>Q{q.num}.</strong> {q.text.substring(0, 100)}{q.text.length > 100 ? '…' : ''}
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: ansCol, whiteSpace: 'nowrap', marginTop: '1px' }}>
                      {sym} {(optLabel || '').substring(0, 28)}{(optLabel || '').length > 28 ? '…' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #e8e8e4', fontSize: '9px', color: '#bbb' }}>
          <span>GOVERN·AI — AI Governance Scorecard</span>
          <span>Confidential — Internal Use Only</span>
          <span>Page 4</span>
        </div>
      </div>

      {/* ── PAGE 5: ATTESTATION ── */}
      <div className="pdf-page" style={{ width: '794px', background: '#fff', marginBottom: '40px', padding: '56px 64px', borderRadius: '4px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#0F6E56', marginBottom: '6px' }}>Sign-off</div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#111', marginBottom: '4px' }}>Management Attestation</div>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #0F6E56' }}>
          To be completed by the Head of GRC or equivalent responsible officer
        </div>
        <div style={{ border: '1px solid #e0e0da', borderRadius: '6px', padding: '20px 24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 700, marginBottom: '10px', color: '#222' }}>Declaration</h3>
          <p style={{ fontSize: '11px', color: '#444', lineHeight: '1.7' }}>
            I, the undersigned, confirm that the information provided in this AI Governance Audit Readiness Scorecard is accurate
            and complete to the best of my knowledge. This self-assessment was completed in good faith using the GOVERN·AI assessment
            framework mapped to RBI IT Governance Circular 2023, EU AI Act (Regulation 2024/1689), and India DPDP Act 2023.
          </p>
          <div style={{ display: 'flex', gap: '40px', marginTop: '28px' }}>
            {['Name & Signature', 'Designation', 'Date'].map(l => (
              <div key={l} style={{ flex: 1 }}>
                <div style={{ borderBottom: '1px solid #aaa', height: '36px', marginBottom: '4px' }} />
                <div style={{ fontSize: '10px', color: '#888' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <h3 style={{ fontSize: '12px', fontWeight: 700, marginBottom: '10px', color: '#222' }}>Regulatory framework reference</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
          <thead>
            <tr style={{ background: '#f7f7f5' }}>
              {['Framework', 'Jurisdiction', 'Key references used', 'Status'].map(h => (
                <th key={h} style={{ padding: '6px 10px', textAlign: 'left', color: '#777', borderBottom: '1px solid #e0e0da' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { fw: 'RBI IT Governance & Risk', j: 'India', refs: 'IT Circular 2023, ML Model Risk, IS Policy, Data Localisation', tag: 'RBI', bg: '#E6F1FB', col: '#185FA5', status: 'Active' },
              { fw: 'EU AI Act', j: 'European Union', refs: 'Art. 4, 6, 9, 10, 11, 12, 13, 14, 19, 25, 26, 50, 53, 62, 73', tag: 'EU', bg: '#EEEDFE', col: '#3C3489', status: 'Enforcement 2025–26' },
              { fw: 'India DPDP Act 2023', j: 'India', refs: 'S.4, S.8, S.10, S.12, S.16', tag: 'DPDP', bg: '#EAF3DE', col: '#3B6D11', status: 'Active — rules pending' },
            ].map((r, i) => (
              <tr key={i}>
                <td style={{ padding: '8px 10px', borderBottom: '1px solid #f0f0ea', fontWeight: 600 }}>{r.fw}</td>
                <td style={{ padding: '8px 10px', borderBottom: '1px solid #f0f0ea', color: '#555' }}>{r.j}</td>
                <td style={{ padding: '8px 10px', borderBottom: '1px solid #f0f0ea', color: '#555' }}>{r.refs}</td>
                <td style={{ padding: '8px 10px', borderBottom: '1px solid #f0f0ea' }}>
                  <span style={{ display: 'inline-block', padding: '1px 6px', borderRadius: '10px', fontSize: '9px', fontWeight: 600, background: r.bg, color: r.col }}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '24px', padding: '12px 14px', background: '#f7f7f5', borderRadius: '4px', fontSize: '10px', color: '#777', lineHeight: '1.6' }}>
          <strong style={{ color: '#444' }}>About this assessment:</strong> This scorecard was generated by GOVERN·AI, covering 32 questions
          across 7 domains, weighted by regulatory criticality (max 200 points). It is recommended to repeat this assessment quarterly.
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '12px', borderTop: '1px solid #e8e8e4', fontSize: '9px', color: '#bbb' }}>
          <span>GOVERN·AI — AI Governance Scorecard</span>
          <span>Confidential — Internal Use Only</span>
          <span>Page 5</span>
        </div>
      </div>
    </div>
  );
}


