import React from 'react';
import { SeededRandom } from './seedRandom';

interface DiagramProps {
  type: 'schenkerian' | 'posttonal' | 'jazzneo' | 'medieval' | 'spectral' | 'algorithmic' | 'ethno' | 'film';
  seed: string;
}

export const AcademicDiagram: React.FC<DiagramProps> = ({ type, seed }) => {
  const random = new SeededRandom(seed || "diagram-seed-42");

  // Render different SVGs based on type
  switch (type) {
    case 'schenkerian': {
      // Draw a Schenkerian Voice Leading Graph
      const note1Y = random.nextInt(40, 70);
      const note2Y = random.nextInt(50, 80);
      const note3Y = random.nextInt(60, 90);
      return (
        <div className="my-6 flex flex-col items-center bg-[#FDFBF7] p-4 border border-zinc-200 rounded shadow-sm font-serif">
          <svg width="100%" height="160" viewBox="0 0 500 160" className="max-w-xl text-zinc-900">
            {/* Staff lines */}
            <line x1="20" y1="40" x2="480" y2="40" stroke="currentColor" strokeWidth="1" />
            <line x1="20" y1="55" x2="480" y2="55" stroke="currentColor" strokeWidth="1" />
            <line x1="20" y1="70" x2="480" y2="70" stroke="currentColor" strokeWidth="1" />
            <line x1="20" y1="85" x2="480" y2="85" stroke="currentColor" strokeWidth="1" />
            <line x1="20" y1="100" x2="480" y2="100" stroke="currentColor" strokeWidth="1" />

            {/* Treble clef placeholder */}
            <g transform="translate(25, 30) scale(0.8)">
              <path d="M10,80 C20,80 30,70 30,50 C30,20 10,10 10,5 C10,0 5,0 5,5 C5,20 25,30 25,50 C25,70 15,85 5,80 Z" fill="currentColor" />
              <circle cx="10" cy="85" r="3" fill="currentColor" />
            </g>

            {/* Slur curves */}
            <path d={`M 80 ${note1Y} Q 220 ${note1Y - 35} 360 ${note2Y}`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,4" />
            <path d={`M 220 ${note2Y} Q 350 ${note2Y + 35} 440 ${note3Y}`} fill="none" stroke="currentColor" strokeWidth="1.5" />

            {/* Stems and structural Kopfton indicator */}
            {/* Note 1: Kopfton */}
            <line x1="80" y1={note1Y} x2="80" y2="130" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="80" cy={note1Y} r="6" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="80" cy={note1Y} r="3" fill="currentColor" />
            <text x="75" y={note1Y - 15} className="text-xs font-semibold font-serif">
              {random.pick(["\\hat{5}", "\\hat{3}", "\\hat{8}"])}
            </text>

            {/* Note 2: Middleground neighbor */}
            <line x1="220" y1={note2Y} x2="220" y2="130" stroke="currentColor" strokeWidth="1" />
            <circle cx="220" cy={note2Y} r="5" fill="currentColor" />
            <text x="215" y={note2Y - 12} className="text-xs italic font-serif">N.N.</text>

            {/* Note 3: Structural descent */}
            <line x1="360" y1={note2Y} x2="360" y2="130" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="360" cy={note2Y} r="5" fill="currentColor" />
            <text x="355" y={note2Y - 12} className="text-xs font-serif">{random.pick(["\\hat{2}", "\\hat{4}"])}</text>

            {/* Note 4: Tonic resolution */}
            <line x1="440" y1={note3Y} x2="440" y2="130" stroke="currentColor" strokeWidth="2" />
            <circle cx="440" cy={note3Y} r="6" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="440" cy={note3Y} r="3" fill="currentColor" />
            <text x="435" y={note3Y - 15} className="text-xs font-semibold font-serif">\\hat{1}</text>

            {/* Bass line notes */}
            <circle cx="80" cy="115" r="4" fill="currentColor" />
            <circle cx="220" cy="120" r="4" fill="currentColor" />
            <circle cx="360" cy="125" r="4" fill="currentColor" />
            <circle cx="440" cy="115" r="4" fill="currentColor" />
            <path d="M 80 115 L 220 120 L 360 125 L 440 115" fill="none" stroke="currentColor" strokeWidth="1.5" />

            {/* Harmonic Analysis Text */}
            <text x="75" y="150" className="text-xs font-bold font-serif">I</text>
            <text x="215" y="150" className="text-xs font-serif">IV (sub)</text>
            <text x="355" y="150" className="text-xs font-bold font-serif">V^7</text>
            <text x="435" y="150" className="text-xs font-bold font-serif">I</text>
          </svg>
          <div className="mt-2 text-center text-xs text-zinc-500 italic font-serif">
            Figure 1: Voice-leading graph showing structural levels, Kopfton prolongation, and fundamental {random.pick(["Urlinie", "Anstieg", "Zug"])} deselect vectors.
          </div>
        </div>
      );
    }

    case 'posttonal': {
      // Clock face diagram of Pitch-Class Sets with symmetry mappings
      const pcSet = random.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).slice(0, random.nextInt(4, 7));
      const circleR = 60;
      const cx = 120;
      const cy = 80;

      const getCoords = (val: number) => {
        const angle = (val * 30 - 90) * (Math.PI / 180);
        return {
          x: cx + circleR * Math.cos(angle),
          y: cy + circleR * Math.sin(angle)
        };
      };

      return (
        <div className="my-6 flex flex-col items-center bg-[#FDFBF7] p-4 border border-zinc-200 rounded shadow-sm font-serif">
          <svg width="100%" height="160" viewBox="0 0 500 160" className="max-w-xl text-zinc-900">
            {/* Circle face */}
            <circle cx={cx} cy={cy} r={circleR} fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />

            {/* Clock ticks */}
            {Array.from({ length: 12 }).map((_, i) => {
              const { x, y } = getCoords(i);
              const isPart = pcSet.includes(i);
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={isPart ? 4 : 2} fill={isPart ? "#800020" : "currentColor"} />
                  <text x={x + (x > cx ? 6 : -10)} y={y + (y > cy ? 4 : -4)} className="text-[9px] font-sans font-semibold">
                    {i}
                  </text>
                </g>
              );
            })}

            {/* Polygon connecting the active pitch class set */}
            {pcSet.length > 1 && (
              <polygon
                points={pcSet.map(v => {
                  const { x, y } = getCoords(v);
                  return `${x},${y}`;
                }).join(' ')}
                fill="rgba(128, 0, 32, 0.08)"
                stroke="#800020"
                strokeWidth="1.5"
              />
            )}

            {/* Symmetry inversion axis */}
            <line x1={cx - 75} y1={cy} x2={cx + 75} y2={cy} stroke="#7f1d1d" strokeWidth="1" strokeDasharray="4,4" />
            <text x={cx + 20} y={cy - 5} className="text-[9px] fill-red-800 font-mono">Axis of I_6 Inversion</text>

            {/* Math / Network Graph Details on the Right */}
            <g transform="translate(260, 30)" className="font-sans">
              <rect x="0" y="0" width="210" height="100" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" rx="4" />
              <text x="10" y="20" className="text-[11px] font-bold fill-zinc-900">Pitch-Class Set Properties</text>
              <text x="10" y="40" className="text-[10px] font-mono">Cardinality: {pcSet.length}</text>
              <text x="10" y="55" className="text-[10px] font-mono">Forte Number: {random.pick(["5-35", "6-Z17", "4-19", "7-21"])}</text>
              <text x="10" y="70" className="text-[10px] font-mono">Prime Form: [{pcSet.sort((a,b) => a-b).map(n => n - pcSet[0]).map(n => n < 0 ? n+12 : n).join('')}]</text>
              <text x="10" y="85" className="text-[10px] font-mono">IC Vector: &lt;{random.nextInt(1,4)},{random.nextInt(0,3)},{random.nextInt(1,5)},{random.nextInt(2,4)},{random.nextInt(0,4)},{random.nextInt(1,2)}&gt;</text>
            </g>
          </svg>
          <div className="mt-2 text-center text-xs text-zinc-500 italic font-serif">
            Figure 2: Clock-face aggregate map showing Pitch-Class Set symmetry invariants and Z-relation vector alignments under a {random.pick(["Tn/In", "K-network", "Forte-index"])} mapping.
          </div>
        </div>
      );
    }

    case 'jazzneo': {
      // Neo-Riemannian Tonnetz Grid
      const triads = ["C+", "Am", "F+", "Dm", "Bb+", "Gm", "Eb+", "Cm", "Ab+", "Fm", "Db+", "Bbm"];
      return (
        <div className="my-6 flex flex-col items-center bg-[#FDFBF7] p-4 border border-zinc-200 rounded shadow-sm font-serif">
          <svg width="100%" height="160" viewBox="0 0 500 160" className="max-w-xl text-zinc-900">
            {/* Draw Triangular Nodes */}
            {/* Node lattice rows */}
            {Array.from({ length: 3 }).map((_, r) => {
              const y = 35 + r * 45;
              return (
                <g key={r}>
                  {/* Lines linking nodes */}
                  <line x1="50" y1={y} x2="450" y2={y} stroke="currentColor" strokeWidth="0.5" />
                  {r < 2 && Array.from({ length: 8 }).map((_, c) => {
                    const x = 60 + c * 50;
                    return (
                      <g key={c}>
                        <line x1={x} y1={y} x2={x + 25} y2={y + 45} stroke="currentColor" strokeWidth="0.5" />
                        <line x1={x + 50} y1={y} x2={x + 25} y2={y + 45} stroke="currentColor" strokeWidth="0.5" />
                      </g>
                    );
                  })}

                  {/* Triad Text Badges */}
                  {Array.from({ length: 7 }).map((_, c) => {
                    const x = 60 + c * 55 + (r * 25);
                    const label = triads[(r * 4 + c) % triads.length];
                    const isP = r === 1 && c === 2;
                    const isL = r === 1 && c === 3;
                    return (
                      <g key={c} transform={`translate(${x}, ${y})`}>
                        <circle cx="0" cy="0" r="14" fill={isP ? "#800020" : isL ? "#a3a3a3" : "white"} stroke="currentColor" strokeWidth="1" />
                        <text x="0" y="4" textAnchor="middle" className={`text-[9px] font-sans font-bold ${isP ? "fill-white" : "fill-zinc-900"}`}>
                          {label}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* Transformation Path Labels */}
            <path d="M 200 80 L 255 80" fill="none" stroke="#800020" strokeWidth="2" />
            <text x="227" y="73" textAnchor="middle" className="text-[10px] fill-red-900 font-bold">P</text>

            <path d="M 255 80 L 280 125" fill="none" stroke="#1e3a8a" strokeWidth="2" />
            <text x="278" y="105" textAnchor="middle" className="text-[10px] fill-blue-900 font-bold">L</text>

            <path d="M 280 125 L 335 125" fill="none" stroke="#0f766e" strokeWidth="2" />
            <text x="307" y="120" textAnchor="middle" className="text-[10px] fill-teal-950 font-bold">R</text>

            {/* Key info label on right */}
            <g transform="translate(400, 20)" className="text-[9px] font-sans">
              <text x="0" y="15" className="font-bold">Transformation Keys:</text>
              <text x="0" y="30" className="fill-red-800 font-bold">P: Parallel (C+ ↔ Cm)</text>
              <text x="0" y="45" className="fill-blue-800 font-bold">L: Leading-tone (C+ ↔ Em)</text>
              <text x="0" y="60" className="fill-teal-900 font-bold">R: Relative (C+ ↔ Am)</text>
            </g>
          </svg>
          <div className="mt-2 text-center text-xs text-zinc-500 italic font-serif">
            Figure 3: Parsimonious voice-leading pathways mapping {random.pick(["L-triad", "hexatonic space", "PLR transformation"])} cycles in two-dimensional coordinate space.
          </div>
        </div>
      );
    }

    case 'medieval': {
      // Medieval Mensuration Circles or Isorhythmic color-talea alignment
      const taleaLength = random.nextInt(3, 6);
      const colorLength = random.nextInt(4, 7);

      return (
        <div className="my-6 flex flex-col items-center bg-[#FDFBF7] p-4 border border-zinc-200 rounded shadow-sm font-serif">
          <svg width="100%" height="160" viewBox="0 0 500 160" className="max-w-xl text-zinc-900">
            {/* Tempus Perfectum Circle indicator */}
            <g transform="translate(80, 80)">
              <circle cx="0" cy="0" r="50" fill="none" stroke="currentColor" strokeWidth="1.5" />
              {/* Dot inside indicating perfection */}
              <circle cx="0" cy="0" r="6" fill="currentColor" />
              <circle cx="0" cy="0" r="12" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
              <text x="-35" y="-55" className="text-[10px] font-bold font-serif">Tempus Perfectum cum Prolatio Maior</text>
              <text x="0" y="35" textAnchor="middle" className="text-[9px] italic">Ratio 3:2</text>
            </g>

            {/* Talea vs Color Grid representation */}
            <g transform="translate(190, 25)" className="font-sans">
              <text x="0" y="15" className="text-[11px] font-bold">Isorhythmic Friction Graph (Talea vs. Color)</text>

              {/* Talea blocks (Rhythm pattern, length e.g. 4) */}
              <text x="0" y="35" className="text-[9px] font-semibold text-zinc-500">Talea Loop (Rhythm: {taleaLength} bars)</text>
              {Array.from({ length: 12 }).map((_, i) => {
                const cycle = i % taleaLength;
                return (
                  <rect
                    key={i}
                    x={i * 22}
                    y="40"
                    width="18"
                    height="15"
                    fill={`rgba(128, 0, 32, ${0.1 + (cycle / taleaLength) * 0.4})`}
                    stroke="#800020"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Color blocks (Pitch pattern, length e.g. 5) */}
              <text x="0" y="75" className="text-[9px] font-semibold text-zinc-500">Color Loop (Pitches: {colorLength} tones)</text>
              {Array.from({ length: 12 }).map((_, i) => {
                const cycle = i % colorLength;
                return (
                  <rect
                    key={i}
                    x={i * 22}
                    y="80"
                    width="18"
                    height="15"
                    fill={`rgba(30, 58, 138, ${0.1 + (cycle / colorLength) * 0.4})`}
                    stroke="#1e3a8a"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Sync alignments marker */}
              <line x1="0" y1="105" x2="264" y2="105" stroke="currentColor" strokeWidth="1" />
              {Array.from({ length: 13 }).map((_, i) => {
                const isSync = i > 0 && (i % taleaLength === 0) && (i % colorLength === 0);
                return (
                  <g key={i}>
                    <line x1={i * 22} y1="102" x2={i * 22} y2="108" stroke="currentColor" strokeWidth="1" />
                    {isSync && (
                      <circle cx={i * 22} cy="105" r="3" fill="#800020" />
                    )}
                  </g>
                );
              })}
              <text x="0" y="120" className="text-[8px] italic text-red-900">Red dots signify total cycle recurrence points (Least Common Multiple = {taleaLength * colorLength} measures)</text>
            </g>
          </svg>
          <div className="mt-2 text-center text-xs text-zinc-500 italic font-serif">
            Figure 4: Mensuration ratios and color-talea phase cycles illustrating modal mutation in early Trecento cantus-firmus tenors.
          </div>
        </div>
      );
    }

    case 'spectral': {
      // Spectral frequency partials and inharmonicity curves
      const partialCount = random.nextInt(8, 13);
      const baseFreq = random.nextInt(110, 220);
      return (
        <div className="my-6 flex flex-col items-center bg-[#FDFBF7] p-4 border border-zinc-200 rounded shadow-sm font-serif">
          <svg width="100%" height="160" viewBox="0 0 500 160" className="max-w-xl text-zinc-900">
            {/* Spectrum axes */}
            <line x1="40" y1="120" x2="460" y2="120" stroke="currentColor" strokeWidth="1.5" />
            <line x1="40" y1="20" x2="40" y2="120" stroke="currentColor" strokeWidth="1.5" />
            <text x="430" y="132" className="text-[8px] font-sans font-bold">Frequency (Hz)</text>
            <text x="15" y="15" transform="rotate(-90 15 15)" className="text-[8px] font-sans font-bold">Amplitude</text>

            {/* Draw Partials */}
            {Array.from({ length: partialCount }).map((_, i) => {
              const num = i + 1;
              // Inharmonic factor
              const inh = 1 + 0.005 * num * num;
              const hz = baseFreq * num * inh;
              const x = 40 + (hz / (baseFreq * 12)) * 380;
              const amp = Math.max(10, 90 - i * 7 - random.nextInt(0, 10));
              const isOdd = num % 2 !== 0;

              return (
                <g key={i}>
                  {/* Partial bar */}
                  <line x1={x} y1="120" x2={x} y2={120 - amp} stroke={isOdd ? "#800020" : "#1e3a8a"} strokeWidth="2" />
                  {/* Frequency text */}
                  <text x={x} y={115 - amp} textAnchor="middle" className="text-[7px] font-mono fill-zinc-600">
                    {Math.round(hz)}
                  </text>
                  {/* Harmonic label */}
                  <text x={x} y="130" textAnchor="middle" className="text-[8px] font-serif italic">
                    f_{num}
                  </text>
                </g>
              );
            })}

            {/* Critical band filter curve */}
            <path
              d={`M 40 90 Q 120 30 220 60 T 460 110`}
              fill="none"
              stroke="#0f766e"
              strokeWidth="1.5"
              strokeDasharray="3,3"
            />
            <text x="180" y="45" className="text-[8px] font-sans fill-teal-800">Psychoacoustic Auditory Threshold Mask</text>
          </svg>
          <div className="mt-2 text-center text-xs text-zinc-500 italic font-serif">
            Figure 5: FFT frequency slice displaying computed {random.pick(["inharmonicity", "critical band roughness", "Fourier transform"])} profiles and spectral envelopes.
          </div>
        </div>
      );
    }

    case 'algorithmic': {
      // Cellular automata and Markov state graph
      return (
        <div className="my-6 flex flex-col items-center bg-[#FDFBF7] p-4 border border-zinc-200 rounded shadow-sm font-serif">
          <svg width="100%" height="160" viewBox="0 0 500 160" className="max-w-xl text-zinc-900">
            {/* Left Side: Cellular Automaton Grid */}
            <g transform="translate(30, 25)" className="font-sans">
              <text x="0" y="-8" className="text-[10px] font-bold">Cellular Automata (Rule {random.pick([30, 90, 110, 150])})</text>
              {Array.from({ length: 8 }).map((_, r) => {
                return Array.from({ length: 14 }).map((_, c) => {
                  // Seeded random fill to simulate cellular automation evolution
                  const stateHash = (r * 7 + c * 3 + seed.length) % 5;
                  const isActive = stateHash === 1 || stateHash === 3;
                  return (
                    <rect
                      key={`${r}-${c}`}
                      x={c * 12}
                      y={r * 12}
                      width="10"
                      height="10"
                      fill={isActive ? "#800020" : "#f4f4f5"}
                      stroke="#e4e4e7"
                      strokeWidth="0.5"
                    />
                  );
                });
              })}
            </g>

            {/* Right Side: Markov Chain State nodes */}
            <g transform="translate(280, 40)" className="font-sans">
              <text x="0" y="-15" className="text-[10px] font-bold">Generative Pitch State Transitions</text>

              {/* State A */}
              <circle cx="30" cy="50" r="20" fill="#1e3a8a" />
              <text x="30" y="54" textAnchor="middle" className="text-[10px] font-bold fill-white">State A</text>

              {/* State B */}
              <circle cx="140" cy="50" r="20" fill="#800020" />
              <text x="140" y="54" textAnchor="middle" className="text-[10px] font-bold fill-white">State B</text>

              {/* Directional arrows */}
              <path d="M 52 42 Q 85 30 118 42" fill="none" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrow)" />
              <text x="85" y="28" textAnchor="middle" className="text-[8px] font-mono fill-blue-900">p = 0.68</text>

              <path d="M 118 58 Q 85 70 52 58" fill="none" stroke="currentColor" strokeWidth="1" />
              <text x="85" y="80" textAnchor="middle" className="text-[8px] font-mono fill-red-900">p = 0.32</text>

              {/* Self transition loops */}
              <path d="M 15 40 C 5 20 0 60 15 60" fill="none" stroke="currentColor" strokeWidth="1" />
              <text x="-5" y="48" className="text-[7px] font-mono">0.2</text>

              <path d="M 155 40 C 165 20 170 60 155 60" fill="none" stroke="currentColor" strokeWidth="1" />
              <text x="172" y="48" className="text-[7px] font-mono">0.88</text>
            </g>
          </svg>
          <div className="mt-2 text-center text-xs text-zinc-500 italic font-serif">
            Figure 6: Stochastic sieve mapping state boundaries and rule matrix parameters for cellular voice generation.
          </div>
        </div>
      );
    }

    case 'ethno': {
      // Ethnomusicology World/Cent lattice map
      return (
        <div className="my-6 flex flex-col items-center bg-[#FDFBF7] p-4 border border-zinc-200 rounded shadow-sm font-serif">
          <svg width="100%" height="160" viewBox="0 0 500 160" className="max-w-xl text-zinc-900">
            {/* Cent deviations scale */}
            <line x1="50" y1="80" x2="450" y2="80" stroke="currentColor" strokeWidth="1.5" />
            <text x="50" y="70" textAnchor="middle" className="text-[8px] font-mono">0 Cents</text>
            <text x="150" y="70" textAnchor="middle" className="text-[8px] font-mono">300 Cents</text>
            <text x="250" y="70" textAnchor="middle" className="text-[8px] font-mono">600 Cents</text>
            <text x="350" y="70" textAnchor="middle" className="text-[8px] font-mono">900 Cents</text>
            <text x="450" y="70" textAnchor="middle" className="text-[8px] font-mono">1200 Cents</text>

            {/* Ticks */}
            {[0, 300, 600, 900, 1200].map((_, i) => {
              const x = 50 + i * 100;
              return <line key={i} x1={x} y1="75" x2={x} y2="85" stroke="currentColor" strokeWidth="1.5" />;
            })}

            {/* Equal Tempered notes comparison */}
            {Array.from({ length: 13 }).map((_, i) => {
              const x = 50 + i * (400 / 12);
              return (
                <circle key={i} cx={x} cy="80" r="2" fill="#a1a1aa" />
              );
            })}

            {/* Non-Tempered scale mapping (Gamelan Slendro/Pelog or Turkish maqam) */}
            {/* Slendro */}
            <path d="M 50 110 L 120 110 L 210 110 L 290 110 L 380 110 L 450 110" fill="none" stroke="#800020" strokeWidth="1" strokeDasharray="2,2" />
            <text x="35" y="113" className="text-[9px] font-bold fill-red-900 font-serif">Slendro</text>
            {[50, 120, 210, 290, 380, 450].map((x, i) => {
              return (
                <g key={i}>
                  <circle cx={x} cy="110" r="5" fill="#800020" />
                  <text x={x} y="125" textAnchor="middle" className="text-[8px] font-mono fill-red-850">{Math.round((x-50)*3)} C</text>
                </g>
              );
            })}

            {/* Maqam Rast deviations */}
            <path d="M 50 40 Q 200 30 450 40" fill="none" stroke="#1e3a8a" strokeWidth="1" />
            <text x="30" y="43" className="text-[9px] font-bold fill-blue-900 font-serif">Maqam</text>
            {[50, 114, 180, 250, 315, 384, 450].map((x, i) => {
              return (
                <g key={i}>
                  <circle cx={x} cy="40" r="4" fill="#1e3a8a" />
                  <text x={x} y="32" textAnchor="middle" className="text-[8px] font-mono fill-blue-950">-{random.pick([15, 20, 24])}c</text>
                </g>
              );
            })}
          </svg>
          <div className="mt-2 text-center text-xs text-zinc-500 italic font-serif">
            Figure 7: Comparative Cent deviation matrix measuring local tunings against standard Western equal-temperament grid.
          </div>
        </div>
      );
    }

    case 'film': {
      // Film Leitmotif Directed Graph network
      return (
        <div className="my-6 flex flex-col items-center bg-[#FDFBF7] p-4 border border-zinc-200 rounded shadow-sm font-serif">
          <svg width="100%" height="160" viewBox="0 0 500 160" className="max-w-xl text-zinc-900">
            {/* Character nodes */}
            {/* Hero */}
            <circle cx="80" cy="80" r="25" fill="#1e3a8a" />
            <text x="80" y="83" textAnchor="middle" className="text-[9px] font-sans font-bold fill-white">Leitmotif [A]</text>
            <text x="80" y="120" textAnchor="middle" className="text-[8px] italic font-serif">Hero Theme</text>

            {/* Villain */}
            <circle cx="420" cy="80" r="25" fill="#800020" />
            <text x="420" y="83" textAnchor="middle" className="text-[9px] font-sans font-bold fill-white">Leitmotif [B]</text>
            <text x="420" y="120" textAnchor="middle" className="text-[8px] italic font-serif">Antagonist</text>

            {/* Narrative Force / Destiny */}
            <circle cx="250" cy="50" r="20" fill="#0f766e" />
            <text x="250" y="53" textAnchor="middle" className="text-[8px] font-sans font-bold fill-white">Matrix [C]</text>
            <text x="250" y="85" textAnchor="middle" className="text-[8px] italic font-serif">Love/Destiny</text>

            {/* Connective relationship paths */}
            {/* Path A -> B */}
            <path d="M 105 80 Q 250 110 395 80" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4,4" />
            <text x="250" y="112" textAnchor="middle" className="text-[8px] fill-red-800 font-mono">Diegetic Permeability Counterpoint (Tritone)</text>

            {/* Path A -> C */}
            <path d="M 98 62 L 232 45" fill="none" stroke="currentColor" strokeWidth="1" />
            <text x="160" y="45" textAnchor="middle" className="text-[7px] font-mono fill-zinc-500">Symmetric Transposition</text>

            {/* Path B -> C */}
            <path d="M 402 62 L 268 45" fill="none" stroke="currentColor" strokeWidth="1" />
            <text x="340" y="45" textAnchor="middle" className="text-[7px] font-mono fill-zinc-500">Inversional Mirror</text>

            {/* Screen Boundary lines */}
            <line x1="190" y1="10" x2="190" y2="150" stroke="#a1a1aa" strokeWidth="0.75" strokeDasharray="5,5" />
            <line x1="310" y1="10" x2="310" y2="150" stroke="#a1a1aa" strokeWidth="0.75" strokeDasharray="5,5" />
            <text x="140" y="20" className="text-[7px] font-mono text-zinc-400">Diegetic</text>
            <text x="210" y="20" className="text-[7px] font-mono text-zinc-400">Trans-Diegetic</text>
            <text x="330" y="20" className="text-[7px] font-mono text-zinc-400">Non-Diegetic</text>
          </svg>
          <div className="mt-2 text-center text-xs text-zinc-500 italic font-serif">
            Figure 8: Network topology detailing leitmotivic nodes, chromatic transformations, and diegetic boundary vectors.
          </div>
        </div>
      );
    }

    default:
      return null;
  }
};
