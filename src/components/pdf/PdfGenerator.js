import { jsPDF } from 'jspdf';


function bandRgb(color) {
  const m = { '#1D9E75':[29,158,117], '#EF9F27':[239,159,39], '#E85D24':[232,93,36], '#E24B4A':[226,75,74] };
  return m[color] || [15,110,86];
}
function barColor(pct) {
  return pct >= 80 ? [29,158,117] : pct >= 60 ? [239,159,39] : [226,75,74];
}
function tagColors(tag) {
  const t = (tag||'').toLowerCase();
  if (t.includes('rbi'))  return { bg:[230,241,251], fg:[24,95,165] };
  if (t.includes('dpdp')) return { bg:[234,243,222], fg:[59,109,17] };
  return { bg:[238,237,254], fg:[60,52,137] };
}

const C = {
  green : [15,110,86],
  dark  : [17,17,17],
  grey  : [100,100,100],
  lgrey : [247,247,245],
  egrey : [224,224,218],
  white : [255,255,255],
  red   : [226,75,74],
  amber : [239,159,39],
};

/* ─── layout helpers ─────────────────────────────────── */
const ML = 20, MR = 190, W = 170;

function footer(pdf, n) {
  pdf.setDrawColor(...C.egrey); pdf.setLineWidth(0.3);
  pdf.line(ML, 283, MR, 283);
  pdf.setFontSize(7); pdf.setFont('helvetica','normal'); pdf.setTextColor(...[170,170,170]);
  pdf.text('GOVERN·AI — AI Governance Scorecard', ML, 288);
  pdf.text('Confidential — Internal Use Only', 105, 288, { align:'center' });
  pdf.text(`Page ${n}`, MR, 288, { align:'right' });
}

function sectionHdr(pdf, label, title, sub, y) {
  pdf.setFontSize(8); pdf.setFont('helvetica','bold'); pdf.setTextColor(...C.green);
  pdf.text(label.toUpperCase(), ML, y);
  pdf.setFontSize(16); pdf.setTextColor(...C.dark);
  pdf.text(title, ML, y+7);
  pdf.setFontSize(9); pdf.setFont('helvetica','normal'); pdf.setTextColor(...C.grey);
  pdf.text(sub, ML, y+13);
  pdf.setFillColor(...C.green); pdf.rect(ML, y+16, W, 0.4, 'F');
  return y + 22;
}

function pill(pdf, text, x, y, fg, bg) {
  const sw = pdf.getStringUnitWidth(text) * 8 / pdf.internal.scaleFactor + 6;
  pdf.setFillColor(...bg); pdf.roundedRect(x, y-2, sw, 5.5, 1.5, 1.5, 'F');
  pdf.setFont('helvetica','bold'); pdf.setFontSize(7); pdf.setTextColor(...fg);
  pdf.text(text, x + sw/2, y+1.8, { align:'center' });
  return x + sw + 3;
}

/* ─── MAIN EXPORT ────────────────────────────────────── */
export function generatePDF({
  sections, metaData, answers,
  sectionScores, sectionMaxScores, sectionPcts,
  overallScore, overallPct, scoreBand, riskGaps,
  companyName, assessedBy, reportDate,
  filename = 'AI-Governance-Report.pdf',
}) {
  const pdf = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
  const gaps = (riskGaps || []).slice(0, 5);
  const bRgb = bandRgb(scoreBand?.color);

  /* ══════ PAGE 1 — COVER ══════════════════════════════ */
  // Logo
  pdf.setFillColor(...C.green);
  pdf.roundedRect(73, 28, 64, 10, 2, 2, 'F');
  pdf.setFontSize(10); pdf.setFont('helvetica','bold'); pdf.setTextColor(...C.white);
  pdf.text('GOVERN·AI', 105, 35.5, { align:'center' });

  // Title
  pdf.setFontSize(22); pdf.setFont('helvetica','bold'); pdf.setTextColor(...C.green);
  pdf.text('AI Governance Audit', 105, 56, { align:'center' });
  pdf.text('Readiness Report', 105, 65, { align:'center' });
  pdf.setFontSize(9); pdf.setFont('helvetica','normal'); pdf.setTextColor(...C.grey);
  pdf.text('Assessed against RBI IT Governance Framework, EU AI Act, and India DPDP Act 2023', 105, 73, { align:'center' });

  // Details box
  pdf.setFillColor(...C.lgrey); pdf.setDrawColor(...C.egrey); pdf.setLineWidth(0.3);
  pdf.roundedRect(50, 80, 110, 34, 3, 3, 'FD');
  const details = [
    ['Company:', companyName || 'Your Organisation'],
    ['Assessed by:', assessedBy || 'Head of GRC'],
    ['Date:', reportDate || new Date().toLocaleDateString('en-IN',{month:'long',year:'numeric'})],
    ['Report ID:', `AGR-${new Date().getFullYear()}-${String(Math.floor(Math.random()*999)+1).padStart(3,'0')}`],
  ];
  details.forEach(([k,v], i) => {
    pdf.setFont('helvetica','bold'); pdf.setFontSize(8.5); pdf.setTextColor(...C.dark);
    pdf.text(k, 57, 89 + i*7);
    pdf.setFont('helvetica','normal'); pdf.setTextColor(...C.grey);
    pdf.text(v, 85, 89 + i*7);
  });

  // Score circle
  pdf.setDrawColor(...bRgb); pdf.setLineWidth(2.5);
  pdf.circle(105, 147, 24, 'D');
  pdf.setFontSize(22); pdf.setFont('helvetica','bold'); pdf.setTextColor(...bRgb);
  pdf.text(`${overallPct}%`, 105, 145.5, { align:'center' });
  pdf.setFontSize(7.5); pdf.setFont('helvetica','normal'); pdf.setTextColor(...C.grey);
  pdf.text(`${overallScore} / ${metaData?.maxScore||200} pts`, 105, 152, { align:'center' });

  // Band label
  const lbl = scoreBand?.label || '';
  const lw = pdf.getStringUnitWidth(lbl)*10/pdf.internal.scaleFactor + 12;
  pdf.setDrawColor(...bRgb); pdf.setLineWidth(0.5);
  pdf.roundedRect(105-lw/2, 174, lw, 9, 2.5, 2.5, 'D');
  pdf.setFontSize(10); pdf.setFont('helvetica','bold'); pdf.setTextColor(...bRgb);
  pdf.text(lbl, 105, 180, { align:'center' });

  if (scoreBand?.headline) {
    pdf.setFontSize(9); pdf.setFont('helvetica','normal'); pdf.setTextColor(...C.grey);
    const lines = pdf.splitTextToSize(scoreBand.headline, 100);
    pdf.text(lines, 105, 189, { align:'center' });
  }

  // Disclaimer
  pdf.setFontSize(7.5); pdf.setFont('helvetica','italic'); pdf.setTextColor(...C.grey);
  pdf.text('This report is an internal self-assessment and does not constitute a formal regulatory audit.', 105, 268, { align:'center' });

  footer(pdf, 1);

  /* ══════ PAGE 2 — EXECUTIVE SUMMARY ═════════════════ */
  pdf.addPage();
  let y = sectionHdr(pdf, 'Executive Summary', 'Assessment Overview',
    'High-level scores across all 7 governance domains', 20);

  // Stat cards
  const stats = [
    { n:`${overallPct}%`, lbl:'Overall compliance', col:bRgb, hi:true },
    { n:gaps.length, lbl:'Critical gaps', col:C.red },
    { n:(sections||[]).reduce((s,sec)=>s+(sec.questions||[]).filter(q=>q.risk==='med').length,0), lbl:'Medium-risk Qs', col:C.amber },
    { n:32-gaps.length, lbl:'Adequate controls', col:[29,158,117] },
  ];
  const cW=39, cG=5;
  stats.forEach((s,i) => {
    const cx = ML + i*(cW+cG);
    if (s.hi) {
      pdf.setFillColor(240, 250, 246);
      pdf.setDrawColor(...bRgb);
    } else {
      pdf.setFillColor(...C.white);
      pdf.setDrawColor(...C.egrey);
    }
    pdf.roundedRect(cx, y, cW, 20, 2, 2, 'FD');
    pdf.setFont('helvetica','bold'); pdf.setFontSize(17); pdf.setTextColor(...s.col);
    pdf.text(String(s.n), cx+cW/2, y+12, { align:'center' });
    pdf.setFont('helvetica','normal'); pdf.setFontSize(7.5); pdf.setTextColor(...C.grey);
    pdf.text(s.lbl, cx+cW/2, y+18, { align:'center' });
  });
  y += 28;

  // Domain bars
  pdf.setFont('helvetica','bold'); pdf.setFontSize(11); pdf.setTextColor(...C.dark);
  pdf.text('Score by governance domain', ML, y); y += 7;
  (sections||[]).forEach((sec, i) => {
    const pct = sectionPcts?.[i] || 0;
    pdf.setFont('helvetica','normal'); pdf.setFontSize(8.5); pdf.setTextColor(...C.dark);
    pdf.text(sec.title||'', ML, y+3);
    pdf.setFillColor(...C.lgrey); pdf.rect(78, y-0.5, 90, 5, 'F');
    pdf.setFillColor(...barColor(pct)); pdf.rect(78, y-0.5, 90*(pct/100), 5, 'F');
    pdf.setFont('helvetica','bold'); pdf.setFontSize(8.5); pdf.setTextColor(...C.dark);
    pdf.text(`${pct}%`, MR, y+3, { align:'right' });
    y += 10;
  });
  y += 4;

  // Gaps table
  if (gaps.length > 0) {
    pdf.setFont('helvetica','bold'); pdf.setFontSize(11); pdf.setTextColor(...C.dark);
    pdf.text(`Top ${gaps.length} critical gaps`, ML, y); y += 6;
    pdf.setFillColor(...C.lgrey); pdf.rect(ML, y-2, W, 7, 'F');
    pdf.setFont('helvetica','bold'); pdf.setFontSize(7.5); pdf.setTextColor(...C.grey);
    ['#','Gap','Risk','Impact'].forEach((h,i) => pdf.text(h, [ML,34,153,170][i], y+2));
    y += 8;
    gaps.forEach((g, i) => {
      if (y > 270) { pdf.addPage(); footer(pdf, 2); y = 20; }
      if (i%2===0) { pdf.setFillColor(252,252,250); pdf.rect(ML, y-2, W, 8, 'F'); }
      pdf.setFont('helvetica','bold'); pdf.setFontSize(8); pdf.setTextColor(...C.red);
      pdf.text(String(i+1), ML, y+2);
      pdf.setFont('helvetica','normal'); pdf.setTextColor(...C.dark);
      const t = `Q${g.num}: ${(g.text||'').slice(0,68)}${(g.text||'').length>68?'…':''}`;
      pdf.text(t, 34, y+2);
      pill(pdf, 'High', 150, y+0.5, [163,45,45], [252,235,235]);
      pdf.setFont('helvetica','bold'); pdf.setFontSize(8); pdf.setTextColor(...C.red);
      pdf.text(`−${g.pointsLost} pts`, MR, y+2, { align:'right' });
      y += 9;
    });
  }
  footer(pdf, 2);

  /* ══════ PAGE 3 — ACTION PLAN ════════════════════════ */
  pdf.addPage();
  y = sectionHdr(pdf, 'Remediation', 'Prioritised Action Plan',
    'Top actions to close the highest-risk gaps, ordered by regulatory urgency', 20);

  gaps.forEach((g, i) => {
    const boxH = 30;
    if (y + boxH > 278) { pdf.addPage(); footer(pdf,3); y=20; }
    pdf.setFillColor(...C.white); pdf.setDrawColor(...C.egrey); pdf.setLineWidth(0.3);
    pdf.roundedRect(ML, y, W, boxH, 2, 2, 'FD');
    pdf.setFillColor(...C.green); pdf.circle(27, y+9, 4, 'F');
    pdf.setFont('helvetica','bold'); pdf.setFontSize(8); pdf.setTextColor(...C.white);
    pdf.text(String(i+1), 27, y+10.5, { align:'center' });
    const qTxt = `Q${g.num}: ${(g.text||'').slice(0,62)}${(g.text||'').length>62?'…':''}`;
    pdf.setFont('helvetica','bold'); pdf.setFontSize(9); pdf.setTextColor(...C.dark);
    pdf.text(qTxt, 34, y+7);
    pdf.setFont('helvetica','normal'); pdf.setFontSize(8); pdf.setTextColor(...C.grey);
    const gLines = pdf.splitTextToSize(g.guidance||'', 142);
    pdf.text(gLines.slice(0,2), 34, y+13);
    let tx = 34;
    (g.tags||[]).slice(0,2).forEach(t => {
      const tc = tagColors(t);
      tx = pill(pdf, (t||'').split(' ').slice(0,3).join(' '), tx, y+24, tc.fg, tc.bg);
    });
    y += boxH + 4;
  });
  footer(pdf, 3);

  /* ══════ PAGE 4 — Q&A DETAIL ════════════════════════ */
  pdf.addPage();
  y = sectionHdr(pdf, 'Detail', 'Question-level Responses',
    'Full answer log across all 7 governance domains', 20);
  let pg4 = 4;

  (sections||[]).forEach((sec, si) => {
    if (y > 262) { pdf.addPage(); footer(pdf, pg4++); y=20; }
    const pct = sectionPcts?.[si] || 0;
    const pCol = pct>=80 ? [29,158,117] : pct>=60 ? [239,159,39] : C.red;
    pdf.setFillColor(...C.lgrey); pdf.rect(ML, y-2, W, 8, 'F');
    pdf.setFont('helvetica','bold'); pdf.setFontSize(9); pdf.setTextColor(...C.dark);
    pdf.text(sec.title||'', ML+2, y+3);
    const pts = `${pct}% · ${sectionScores?.[si]||0}/${sectionMaxScores?.[si]||0} pts`;
    pdf.setFontSize(8); pdf.setTextColor(...pCol);
    pdf.text(pts, MR, y+3, { align:'right' });
    y += 11;

    (sec.questions||[]).forEach(q => {
      if (y > 272) { pdf.addPage(); footer(pdf, pg4++); y=20; }
      const ans = answers?.[q.id];
      const sc  = ans !== undefined ? ((q.options||[])[ans]?.score ?? 0) : -1;
      const isPass = sc >= q.weight;
      const isFail = sc === 0 && ans !== undefined;
      const bCol = isPass ? [29,158,117] : isFail ? C.red : C.amber;
      const sym  = ans === undefined ? '–' : isPass ? '✓' : isFail ? '✗' : '~';
      pdf.setFillColor(...bCol); pdf.rect(ML, y-1.5, 2, 6, 'F');
      pdf.setFont('helvetica','normal'); pdf.setFontSize(7.5); pdf.setTextColor(...C.dark);
      const qTxt = `Q${q.num}. ${(q.text||'').slice(0,95)}${(q.text||'').length>95?'…':''}`;
      pdf.text(qTxt, ML+4, y+2.5);
      const optLbl = ans !== undefined ? ((q.options||[])[ans]?.label||'') : 'Not answered';
      pdf.setFont('helvetica','bold'); pdf.setFontSize(7.5); pdf.setTextColor(...bCol);
      pdf.text(`${sym} ${optLbl.slice(0,22)}${optLbl.length>22?'…':''}`, MR, y+2.5, { align:'right' });
      y += 7;
    });
    y += 3;
  });
  footer(pdf, pg4);

  /* ══════ PAGE 5 — ATTESTATION ════════════════════════ */
  pdf.addPage();
  y = sectionHdr(pdf, 'Sign-off', 'Management Attestation',
    'To be completed by the Head of GRC or equivalent responsible officer', 20);

  pdf.setFillColor(...C.white); pdf.setDrawColor(...C.egrey); pdf.setLineWidth(0.3);
  pdf.roundedRect(ML, y, W, 52, 2, 2, 'FD');
  pdf.setFont('helvetica','bold'); pdf.setFontSize(10); pdf.setTextColor(...C.dark);
  pdf.text('Declaration', ML+6, y+8);
  pdf.setFont('helvetica','normal'); pdf.setFontSize(8.5); pdf.setTextColor(...C.grey);
  const decl = 'I, the undersigned, confirm that the information provided in this AI Governance Audit Readiness Scorecard is accurate and complete to the best of my knowledge. This self-assessment was completed in good faith using the GOVERN·AI assessment framework mapped to RBI IT Governance Circular 2023, EU AI Act (Regulation 2024/1689), and India DPDP Act 2023.';
  pdf.text(pdf.splitTextToSize(decl, W-12), ML+6, y+15);
  ['Name & Signature','Designation','Date'].forEach((l,i) => {
    const sx = ML+6 + i*56;
    pdf.setDrawColor(170,170,170); pdf.line(sx, y+42, sx+48, y+42);
    pdf.setFontSize(7.5); pdf.setTextColor(...C.grey); pdf.text(l, sx, y+47);
  });
  y += 60;

  pdf.setFont('helvetica','bold'); pdf.setFontSize(10); pdf.setTextColor(...C.dark);
  pdf.text('Regulatory framework reference', ML, y); y += 7;
  pdf.setFillColor(...C.lgrey); pdf.rect(ML, y-2, W, 7, 'F');
  pdf.setFont('helvetica','bold'); pdf.setFontSize(7.5); pdf.setTextColor(...C.grey);
  ['Framework','Jurisdiction','Key references','Status'].forEach((h,i) => pdf.text(h,[ML,73,95,162][i],y+2));
  y += 8;
  [
    {fw:'RBI IT Governance & Risk',j:'India',r:'IT Circular 2023, ML Model Risk, IS Policy',s:'Active',fg:[24,95,165],bg:[230,241,251]},
    {fw:'EU AI Act',j:'European Union',r:'Art. 4, 9, 10, 13, 14, 50, 62',s:'Enforcement 2025–26',fg:[60,52,137],bg:[238,237,254]},
    {fw:'India DPDP Act 2023',j:'India',r:'S.4, S.8, S.10, S.12, S.16',s:'Active — rules pending',fg:[59,109,17],bg:[234,243,222]},
  ].forEach((r,i) => {
    if(i%2===0){pdf.setFillColor(252,252,250);pdf.rect(ML,y-2,W,9,'F');}
    pdf.setFont('helvetica','bold');pdf.setFontSize(8);pdf.setTextColor(...C.dark);pdf.text(r.fw,ML,y+2);
    pdf.setFont('helvetica','normal');pdf.setTextColor(...C.grey);pdf.text(r.j,73,y+2);pdf.text(r.r,95,y+2);
    pill(pdf,r.s,162,y+0.5,r.fg,r.bg);
    y += 10;
  });
  y += 4;
  pdf.setFillColor(...C.lgrey); pdf.roundedRect(ML,y,W,14,2,2,'F');
  pdf.setFont('helvetica','bold');pdf.setFontSize(8);pdf.setTextColor(...C.dark);pdf.text('About:',ML+5,y+5);
  pdf.setFont('helvetica','normal');pdf.setTextColor(...C.grey);
  pdf.text(pdf.splitTextToSize('GOVERN·AI scorecard — 32 questions, 7 domains, max 200 pts. Repeat quarterly.',W-15),ML+5,y+10);
  footer(pdf, 5);

  /* ══════ DOWNLOAD ════════════════════════════════════ */
  // Synchronous download — stays within Chrome user-gesture context
  const ab   = pdf.output('arraybuffer');
  const blob = new Blob([ab], { type:'application/pdf' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
