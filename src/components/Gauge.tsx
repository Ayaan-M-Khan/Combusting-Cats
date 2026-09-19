import React from 'react';

interface GaugeProps {
  percentage: number; // 0 to 100
  kittenCount: number;
  deckSize: number;
}

export const Gauge: React.FC<GaugeProps> = ({ percentage, kittenCount: _kittenCount, deckSize: _deckSize }) => {
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)));

  // Needle angle from -90 deg (0%) to +90 deg (100%)
  const needleAngle = -90 + (clamped / 100) * 180;

  // Color determination
  let colorBadge = '#16a34a'; // Green (0-15%)
  if (clamped > 35) {
    colorBadge = '#dc2626'; // Bright Red (>35%)
  } else if (clamped > 15) {
    colorBadge = '#f97316'; // Orange (16-35%)
  }

  return (
    <div className="relative flex items-center select-none">
      {/* Digital Percentage Display Pill on left (matches screenshot) */}
      <div className="bg-[#ede7df] border-[3px] border-[#382315] rounded-xl px-2.5 py-1.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.35),0_3px_0_rgba(0,0,0,0.4)] mr-[-14px] z-10">
        <div
          className="font-bangers text-lg sm:text-2xl tracking-wider leading-none drop-shadow-[0_1px_0_#fff]"
          style={{ color: colorBadge }}
        >
          {clamped}%
        </div>
      </div>

      {/* Speedometer Gauge Body */}
      <div className="relative flex flex-col items-center">
        {/* Arc Banner on top */}
        <div className="absolute -top-3 z-20 bg-white border-2 border-[#1f2937] px-2 py-0.5 rounded-full shadow-[0_2px_0_rgba(0,0,0,0.3)]">
          <span className="font-bangers text-[10px] sm:text-xs text-red-600 tracking-wider whitespace-nowrap">
            CHANCE OF KITTEN
          </span>
        </div>

        {/* Gauge Outer Dial */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-[#f8fafc] to-[#cbd5e1] border-4 border-[#334155] shadow-[0_8px_12px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.8)] relative flex items-center justify-center p-1">
          {/* Inner dial face */}
          <div className="w-full h-full rounded-full bg-white relative overflow-hidden flex items-center justify-center border-2 border-slate-300">
            {/* SVG Arc for Speedometer */}
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="10"
              />
              {/* Green Arc (0-15%) */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="#22c55e"
                strokeWidth="10"
                strokeDasharray="34 226"
                strokeDashoffset="0"
              />
              {/* Orange Arc (16-35%) */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="#f97316"
                strokeWidth="10"
                strokeDasharray="45 226"
                strokeDashoffset="-34"
              />
              {/* Red Arc (>35%) */}
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="none"
                stroke="#ef4444"
                strokeWidth="10"
                strokeDasharray="60 226"
                strokeDashoffset="-79"
              />
            </svg>

            {/* Dial Scale Tick Numbers */}
            <span className="absolute bottom-2 left-4 font-bangers text-[10px] text-slate-500">0</span>
            <span className="absolute bottom-2 right-4 font-bangers text-[10px] text-slate-500">100</span>

            {/* Gauge Needle */}
            <div
              className="absolute w-full h-full flex items-center justify-center transition-transform duration-500 ease-out"
              style={{
                transform: `rotate(${needleAngle}deg)`,
              }}
            >
              {/* Needle pointer */}
              <div className="absolute top-3 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[38px] border-b-red-600 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                {/* Needle hole accent */}
                <div className="absolute -left-[3px] top-4 w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>

            {/* Needle center cap */}
            <div className="w-5 h-5 rounded-full bg-gradient-to-b from-stone-200 to-stone-400 border-2 border-stone-800 shadow-md z-10 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
            </div>
          </div>
        </div>

        {/* Red Cable connector coming out of the gauge bottom to the draw deck */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-3 bg-red-700 rounded-b border border-red-950 z-10" />
      </div>
    </div>
  );
};
