import React, { useEffect, useState } from 'react';

function getBandColors(overallPct) {
  if (overallPct >= 80) return { stroke: '#1D9E75', bg: 'rgba(29,158,117,0.12)', label: 'text-green-400' };
  if (overallPct >= 60) return { stroke: '#EF9F27', bg: 'rgba(239,159,39,0.12)', label: 'text-amber-400' };
  if (overallPct >= 40) return { stroke: '#E85D24', bg: 'rgba(232,93,36,0.12)', label: 'text-orange-400' };
  return { stroke: '#E24B4A', bg: 'rgba(226,75,74,0.12)', label: 'text-red-400' };
}

export default function ScoreGauge({ overallPct, overallScore, maxScore, scoreBand }) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(overallPct), 100);
    return () => clearTimeout(timer);
  }, [overallPct]);

  const colors = getBandColors(overallPct);

  // SVG arc parameters
  const cx = 100, cy = 100, r = 80;
  const sweep = 180;
  const fillAngle = sweep * (animated / 100);

  const toRad = (deg) => (deg * Math.PI) / 180;
  const arcX = (angle) => cx + r * Math.cos(toRad(angle));
  const arcY = (angle) => cy + r * Math.sin(toRad(angle));

  // Background arc (full half-circle)
  const bgStart = { x: arcX(180), y: arcY(180) };
  const bgEnd = { x: arcX(0), y: arcY(0) };
  const bgPath = `M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 0 1 ${bgEnd.x} ${bgEnd.y}`;

  // Filled arc — endpoint sweeps clockwise (increasing angle, through the TOP)
  const fillEndAngle = 180 + fillAngle;
  const fillEnd = { x: arcX(fillEndAngle), y: arcY(fillEndAngle) };
  const largeArc = fillAngle > 180 ? 1 : 0;
  const fillPath = `M ${bgStart.x} ${bgStart.y} A ${r} ${r} 0 ${largeArc} 1 ${fillEnd.x} ${fillEnd.y}`;

  return (
    <div className="flex flex-col items-center mt-6">
      {/* viewBox: x=0, y=10, w=200, h=105 — arc top is y=20, gives 10px headroom */}
      <svg viewBox="0 10 200 105" className="w-80 h-52 drop-shadow-lg">
        {/* Background arc */}
        <path
          d={bgPath}
          fill="none"
          stroke="#1e293b"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d={fillPath}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="14"
          strokeLinecap="round"
          style={{ transition: 'all 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
        {/* Score text — sits in the flat opening of the semicircle */}
        <text x="100" y="112" textAnchor="middle" fontSize="30" fontWeight="800" fill="white">
          {overallPct}%
        </text>
      </svg>

      {/* Band label */}
      <div
        className="mt-2 px-5 py-2 rounded-full font-bold text-sm border"
        style={{
          background: colors.bg,
          borderColor: colors.stroke,
          color: colors.stroke,
        }}
      >
        {scoreBand?.label ?? 'Calculating…'}
      </div>

      {/* Score subtext */}
      <p className="mt-3 text-slate-400 text-sm">
        <span className="text-white font-semibold">{overallScore}</span> / {maxScore} points
      </p>

      {/* Headline */}
      {scoreBand?.headline && (
        <p className="mt-2 text-center text-sm text-slate-400 max-w-sm leading-relaxed">
          {scoreBand.headline}
        </p>
      )}
    </div>
  );
}
