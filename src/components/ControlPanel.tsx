import React from 'react';
import { Sparkles, RotateCw, Shuffle, User, BookOpen, AlertOctagon, FileText, Zap, Plus, X } from 'lucide-react';
import type { CoAuthor } from '../utils/grammar';

interface ControlPanelProps {
  domain: 'music' | 'horror' | 'diary' | 'underground' | 'schemer';
  setDomain: (val: 'music' | 'horror' | 'diary' | 'underground' | 'schemer') => void;
  horrorFormat: 'manuscript' | 'screenplay';
  setHorrorFormat: (val: 'manuscript' | 'screenplay') => void;
  diaryFormat: 'logbook' | 'memoir';
  setDiaryFormat: (val: 'logbook' | 'memoir') => void;
  schemerFormat: 'blueprint' | 'pitch';
  setSchemerFormat: (val: 'blueprint' | 'pitch') => void;

  field: string;
  setField: (field: string) => void;
  authorFirst: string;
  setAuthorFirst: (val: string) => void;
  authorLast: string;
  setAuthorLast: (val: string) => void;
  institution: string;
  setInstitution: (val: string) => void;
  
  coauthors: CoAuthor[];
  setCoauthors: React.Dispatch<React.SetStateAction<CoAuthor[]>>;

  madness: number;
  setMadness: (val: number) => void;
  seed: string;
  setSeed: (val: string) => void;
  length: number;
  setLength: (val: number) => void;
  drift: number;
  setDrift: (val: number) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

// Preset research scenarios modeled after established musicological literatures
interface PresetConfig {
  name: string;
  field: string;
  seed: string;
  madness: number;
  drift?: number;
  authorFirst: string;
  authorLast: string;
  inst: string;
  coauthors?: CoAuthor[];
}

const PRESETS: PresetConfig[] = [
  {
    name: "Schubert & Prolongation",
    field: "schenkerian",
    seed: "schubert-prolongation-9",
    madness: 40,
    authorFirst: "Maxwell S.",
    authorLast: "Hargrave",
    inst: "Leuphana University"
  },
  {
    name: "Set Theory & K-Networks",
    field: "posttonal",
    seed: "k-network-analysis-42",
    madness: 45,
    authorFirst: "Maxwell S.",
    authorLast: "Hargrave",
    inst: "Leuphana University"
  },
  {
    name: "Neo-Riemannian Jazz",
    field: "jazzneo",
    seed: "coltrane-tonnetz-7",
    madness: 55,
    authorFirst: "Maxwell S.",
    authorLast: "Hargrave",
    inst: "Leuphana University"
  },
  {
    name: "Ars Nova Isorhythm",
    field: "medieval",
    seed: "vitry-mensuration-3",
    madness: 35,
    authorFirst: "Maxwell S.",
    authorLast: "Hargrave",
    inst: "Leuphana University"
  },
  {
    name: "Spectral Envelope Analysis",
    field: "spectral",
    seed: "grisey-partiels-2026",
    madness: 50,
    authorFirst: "Maxwell S.",
    authorLast: "Hargrave",
    inst: "Leuphana University"
  },
  {
    name: "Algorithmic Composition",
    field: "algorithmic",
    seed: "xenakis-stochastic-5",
    madness: 60,
    authorFirst: "Maxwell S.",
    authorLast: "Hargrave",
    inst: "Leuphana University"
  },
  {
    name: "Voices in the Score",
    field: "voices-in-the-score-7",
    seed: "voices-in-the-score-7",
    madness: 85,
    drift: 92,
    authorFirst: "Maxwell S.",
    authorLast: "Hargrave",
    inst: "Leuphana University"
  },
  // ── Horror Presets ──────────────────────────────────────────────────
  { name: "Cosmic Dread Archive", field: "cosmic", seed: "crawling-void-40", madness: 70, drift: 55, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Gothic Ancestral Decay", field: "gothic", seed: "weeping-lady-41", madness: 45, drift: 25, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Cellular Body Horror", field: "body", seed: "sentient-calcification-42", madness: 75, drift: 40, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Folk Peat-Bog Horror", field: "folk", seed: "straw-man-43", madness: 55, drift: 35, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  // ── Conservative / Dry ──────────────────────────────────────────────
  { name: "Conservative Schenkerian", field: "schenkerian", seed: "conservative-schenker-1", madness: 10, drift: 0, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Dry Set-Theoretic", field: "posttonal", seed: "dry-set-theory-2", madness: 8, drift: 0, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Standard Neo-Riemannian", field: "jazzneo", seed: "standard-neo-riemann-3", madness: 15, drift: 0, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  // ── Interdisciplinary ───────────────────────────────────────────────
  { name: "Cognitive Schenkerian", field: "cognitive", seed: "cog-schenker-4", madness: 35, drift: 15, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Embodied Performance", field: "embodied", seed: "embodied-perf-5", madness: 40, drift: 20, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Mathematical Topology", field: "mathmusic", seed: "topology-music-6", madness: 50, drift: 10, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Political Musicology", field: "politics", seed: "political-music-7", madness: 45, drift: 25, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  // ── Avant-Garde / Speculative ───────────────────────────────────────
  { name: "Quantum Tonnetz", field: "jazzneo", seed: "quantum-tonnetz-8", madness: 75, drift: 60, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Spectral Deconstruction", field: "spectral", seed: "spectral-decon-9", madness: 70, drift: 55, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Post-Human Listening", field: "tech", seed: "post-human-listen-10", madness: 80, drift: 70, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  // ── Historical / Archival ───────────────────────────────────────────
  { name: "Machaut Reception", field: "reception", seed: "machaut-reception-11", madness: 20, drift: 5, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Beethoven Sketch Studies", field: "schenkerian", seed: "beethoven-sketch-12", madness: 25, drift: 10, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Medieval Performance", field: "performance", seed: "medieval-perf-13", madness: 30, drift: 15, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  // ── Critical Theory ─────────────────────────────────────────────────
  { name: "Queer Opera", field: "gender", seed: "queer-opera-14", madness: 50, drift: 40, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Deaf Beethoven", field: "disability", seed: "deaf-beethoven-15", madness: 55, drift: 35, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Decolonial Ethno", field: "ethno", seed: "decolonial-ethno-16", madness: 45, drift: 30, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  // ── Computational / Data-Driven ─────────────────────────────────────
  { name: "AI Music Analysis", field: "tech", seed: "ai-music-analysis-17", madness: 40, drift: 15, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Streaming Algorithms", field: "popular", seed: "streaming-algo-18", madness: 35, drift: 20, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Neural Composition", field: "algorithmic", seed: "neural-comp-19", madness: 60, drift: 45, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  // ── Cross-Cultural / Comparative ────────────────────────────────────
  { name: "Raga Analysis", field: "worldanalysis", seed: "raga-analysis-20", madness: 30, drift: 10, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Gamelan & Tonality", field: "worldanalysis", seed: "gamelan-tonal-21", madness: 35, drift: 20, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Afro-Diasporic Rhythm", field: "ethno", seed: "afro-rhythm-22", madness: 40, drift: 25, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  // ── Unhinged / Extreme ──────────────────────────────────────────────
  { name: "The Score is Alive", field: "schenkerian", seed: "score-is-alive-23", madness: 95, drift: 95, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Cosmic Musicology", field: "algorithmic", seed: "cosmic-music-24", madness: 100, drift: 100, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Paranoid Analysis", field: "posttonal", seed: "paranoid-analysis-25", madness: 90, drift: 88, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  // ── Multi-Author Collaborations ─────────────────────────────────────
  { name: "Cognitive-Performance Nexus", field: "cognitive", seed: "cog-perf-nexus-26", madness: 45, drift: 20, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University", coauthors: [{ first: "Marc", last: "Leman", institution: "Leuphana University" }, { first: "Nicholas", last: "Cook", institution: "Leuphana University" }] },
  { name: "Interdisciplinary Spectral", field: "spectral", seed: "inter-spectral-27", madness: 55, drift: 30, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University", coauthors: [{ first: "Joshua", last: "Fineberg", institution: "Leuphana University" }] },
  { name: "Global Music Theory", field: "worldanalysis", seed: "global-theory-28", madness: 50, drift: 25, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University", coauthors: [{ first: "Timothy", last: "Rice", institution: "Leuphana University" }, { first: "Kay", last: "Shelemay", institution: "Leuphana University" }, { first: "Martin", last: "Clayton", institution: "Leuphana University" }] },
  // ── Popular Music Deep Cuts ─────────────────────────────────────────
  { name: "Radiohead Harmony", field: "popular", seed: "radiohead-harmony-29", madness: 35, drift: 15, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Dilla's Microtiming", field: "performance", seed: "dilla-micro-30", madness: 40, drift: 20, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Björk Production", field: "tech", seed: "bjork-prod-31", madness: 45, drift: 25, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  // ── Film / Game Music ───────────────────────────────────────────────
  { name: "Williams Leitmotifs", field: "film", seed: "williams-leitmotif-32", madness: 30, drift: 10, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Ludomusicology", field: "film", seed: "ludo-music-33", madness: 40, drift: 20, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Horror Film Acoustics", field: "spectral", seed: "horror-acoustic-34", madness: 55, drift: 45, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  // ── Opera / Vocal ───────────────────────────────────────────────────
  { name: "Wagnerian Narrative", field: "opera", seed: "wagner-narrative-35", madness: 40, drift: 20, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
  { name: "Verdi Tessitura", field: "opera", seed: "verdi-tessitura-36", madness: 35, drift: 15, authorFirst: "Maxwell S.", authorLast: "Hargrave", inst: "Leuphana University" },
];

const THEORY_FIELDS = [
  { id: 'schenkerian', label: 'Schenkerian Analysis', icon: '𝄚', desc: 'Ursatz, Kopfton, voice-leading structural layers and diatonic descents.' },
  { id: 'posttonal', label: 'Post-Tonal & Set Theory', icon: '⦃0,1,4⦄', desc: 'Pitch-class sets, interval vector matrices, Forte forms, and K-networks.' },
  { id: 'jazzneo', label: 'Jazz & Neo-Riemannian', icon: '⇄ PLR', desc: 'Tonnetz grids, parsimonious voice-leading triads, and negative harmony.' },
  { id: 'medieval', label: 'Medieval & Mensural', icon: '𝇎', desc: 'Isorhythmic colors/taleae, musica ficta, and prolation canon structures.' },
  { id: 'spectral', label: 'Spectralism & Acoustics', icon: '𝆹𝅥𝅯 ✺', desc: 'Fourier decompositions, psychoacoustic roughness, envelopes, and partials.' },
  { id: 'algorithmic', label: 'Algorithmic & Stochastic', icon: '𝄳 ⚄', desc: 'Markov chains, Xenakis-sieves, cellular automata, and information entropy.' },
  { id: 'ethno', label: 'Ethnomusicology & Field', icon: '𝄠 🗲', desc: 'De-Westernized tuning space, cent lattices, gamelan arrays, and geophony.' },
  { id: 'film', label: 'Film & Ludomusicology', icon: '🎬', desc: 'Leitmotif networks, diegetic boundaries.' },
  { id: 'cognitive', label: 'Cognitive Musicology', icon: '🧠', desc: 'Perception, memory, predictive coding.' },
  { id: 'performance', label: 'Performance Studies', icon: '🎹', desc: 'Tempo rubato, micro-timing, gesture.' },
  { id: 'popular', label: 'Popular Music Studies', icon: '🎸', desc: 'Hooks, production layers, genre hybridity.' },
  { id: 'opera', label: 'Opera & Vocal Studies', icon: '🎭', desc: 'Tessitura, dramatic arc, aria form.' },
  { id: 'gender', label: 'Gender & Queer Theory', icon: '⚧', desc: 'Queer listening, feminist hermeneutics.' },
  { id: 'disability', label: 'Disability Studies', icon: '♿', desc: 'Deaf gain, crip temporality, access.' },
  { id: 'tech', label: 'Music & Technology', icon: '💻', desc: 'AI, machine listening, DAWs, streaming.' },
  { id: 'mathmusic', label: 'Music & Mathematics', icon: '∞', desc: 'Topology, category theory, group actions.' },
  { id: 'politics', label: 'Music & Politics', icon: '✊', desc: 'Hegemony, decoloniality, biopolitics.' },
  { id: 'reception', label: 'Reception History', icon: '📜', desc: 'Canon formation, critical fortunes.' },
  { id: 'embodied', label: 'Embodied Cognition', icon: '🤸', desc: 'Gesture, proprioception, mirror neurons.' },
  { id: 'worldanalysis', label: 'World Music Analysis', icon: '🌍', desc: 'Modal systems, rhythmic cycles, tuning.' },
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  domain,
  setDomain,
  horrorFormat,
  setHorrorFormat,
  diaryFormat,
  setDiaryFormat,
  schemerFormat,
  setSchemerFormat,

  field,
  setField,
  authorFirst,
  setAuthorFirst,
  authorLast,
  setAuthorLast,
  institution,
  setInstitution,
  
  coauthors,
  setCoauthors,

  madness,
  setMadness,
  seed,
  setSeed,
  length,
  setLength,
  drift,
  setDrift,
  onGenerate,
  isGenerating
}) => {
  const handleRandomizeSeed = () => {
    const words = ["ursatz", "forte", "riemann", "machaut", "grisey", "xenakis", "feld", "williams", "adorno", "bach", "beethoven", "schoenberg", "babbitt", "tonnetz", "ficta", "slendro", "overtone", "ludo"];
    const suffix = Math.floor(Math.random() * 1000);
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setSeed(`${randomWord}-${suffix}`);
  };

  const applyPreset = (preset: PresetConfig) => {
    setField(preset.field);
    setSeed(preset.seed);
    setMadness(preset.madness);
    setDrift(preset.drift ?? 0);
    setAuthorFirst(preset.authorFirst);
    setAuthorLast(preset.authorLast);
    setInstitution(preset.inst);
    setCoauthors(preset.coauthors ?? []);
  };

  // Descriptive text based on discourse density levels
  const getMadnessDescription = (val: number) => {
    if (val <= 20) return { label: "Conventional Discourse", style: "text-zinc-700", note: "Standard analytical prose, restrained in register and conventional in its citations." };
    if (val <= 40) return { label: "Elevated Academic Register", style: "text-zinc-800 font-semibold", note: "Denser theoretical vocabulary with frequent recourse to specialized terminology." };
    if (val <= 60) return { label: "Interdisciplinary Framing", style: "text-amber-900 font-semibold", note: "Draws on adjacent fields (philosophy, mathematics, linguistics) to extend the analysis." };
    if (val <= 80) return { label: "Speculative Synthesis", style: "text-orange-900 font-bold", note: "Proposes bold theoretical extensions and synthesizes disparate analytical traditions." };
    return { label: "Avant-Garde Theorization", style: "text-red-950 font-black tracking-tight", note: "Radical reconceptualization of the analytical apparatus; challenges disciplinary boundaries." };
  };

  const madnessDesc = getMadnessDescription(madness);

  // Descriptive text based on discursive drift level
  const getDriftLabel = (val: number) => {
    if (val <= 15) return {
      label: "Disciplined Prose",
      style: "text-zinc-500",
      note: "Strictly coherent academic writing. No conceptual deviation or digression."
    };
    if (val <= 35) return {
      label: "Subtle Drift",
      style: "text-amber-400",
      note: "Occasional unusual metaphors and extended analogies — still recognizably scholarly."
    };
    if (val <= 55) return {
      label: "Notable Digression",
      style: "text-orange-400 font-semibold",
      note: "Cross-field contamination, hidden patterns, paranoid undertones begin to surface."
    };
    if (val <= 75) return {
      label: "Significant Drift",
      style: "text-red-500 font-semibold",
      note: "Self-referential intrusions, digressions about reviewers, first-person confessions."
    };
    return {
      label: "Full Conceptual Breakdown",
      style: "text-red-400 font-black tracking-tight animate-pulse",
      note: "Fragmented discourse, hallucinated citations, cosmic paranoia, voices in the score."
    };
  };

  // Descriptive text based on manuscript length
  const getLengthLabel = (pages: number) => {
    if (pages <= 5) return {
      label: "Short Communication",
      style: "text-zinc-700",
      note: "Concise note suitable for brief analytical observations and preliminary findings."
    };
    if (pages <= 12) return {
      label: "Brief Article",
      style: "text-zinc-800",
      note: "Compact article with focused scope and tight argumentation."
    };
    if (pages <= 25) return {
      label: "Standard Journal Article",
      style: "text-amber-900 font-semibold",
      note: "Full-length article with comprehensive analysis and supporting materials."
    };
    if (pages <= 45) return {
      label: "Extended Article",
      style: "text-amber-800 font-semibold",
      note: "Extended treatment with detailed comparative analysis, archival materials, and cross-referencing."
    };
    if (pages <= 70) return {
      label: "Monograph Chapter",
      style: "text-orange-800 font-bold",
      note: "Book-chapter-length study with substantial analytical depth and extensive bibliography."
    };
    if (pages <= 95) return {
      label: "Full Monograph",
      style: "text-red-900 font-bold",
      note: "Comprehensive scholarly monograph with exhaustive analytical coverage across many sections."
    };
    return {
      label: "Multi-Volume Treatise",
      style: "text-red-950 font-black",
      note: "Sprawling, exhaustive treatise spanning dozens of sections and hundreds of citations."
    };
  };

  return (
    <div className="w-full lg:w-[440px] bg-[#1C1917] text-zinc-200 flex flex-col h-full border-r border-zinc-800 shrink-0 overflow-y-auto font-sans select-none">
      
      {/* Header logo section */}
      <div className="p-6 border-b border-zinc-800 bg-[#161412] flex flex-col gap-1 shrink-0 animate-in fade-in duration-150">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{domain === 'music' ? '🎼' : domain === 'horror' ? '💀' : domain === 'diary' ? '📓' : '📟'}</span>
          <div>
            <h1 className="text-base font-serif font-bold tracking-wide text-[#EFECE6]">
              {domain === 'music' ? 'Manuscript Generator' : domain === 'horror' ? 'Speculative Horror Engine' : domain === 'diary' ? 'Self-Audit Logbook' : 'Underground Dispatch'}
            </h1>
            <p className="text-[10px] text-zinc-500 tracking-tight uppercase">
              {domain === 'music' ? 'Scholarly Article Composition System' : domain === 'horror' ? 'Literary Dread and Screenplay Compiler' : domain === 'diary' ? 'Meta-Process Observational Ledgers' : 'DIY Music Zine & Performance Log'}
            </p>
          </div>
        </div>
        <p className="text-xs text-zinc-400 font-serif leading-relaxed mt-2">
          {domain === 'music' 
            ? 'Compose research manuscripts in music theory and analysis with seeded reproducibility, analytical figures, and full bibliographic apparatus.'
            : domain === 'horror'
            ? 'Generate dense horror literature manuscripts and scene-by-scene screenplays in standard Hollywood fountain layout or classic gothic prose.'
            : domain === 'diary'
            ? 'Format highly clinical, disturbing daily self-audits and compulsive sequencing journals on dotted ivory vellum Rhodia grids.'
            : 'Generate raw, visceral, first-person memoirs of DIY basement concerts, subcultural mutual aid, dubplate setlists, and hardware anomalies.'}
        </p>
      </div>

      {/* Disciplinary Domain Selector Tabs */}
      <div className="grid grid-cols-5 border-b border-zinc-850 bg-[#161412] shrink-0">
        <button
          onClick={() => setDomain('music')}
          className={`py-3 text-[9px] font-serif font-bold tracking-wide border-r border-zinc-850 transition-colors flex items-center justify-center gap-0.5 ${
            domain === 'music' ? 'bg-amber-950/25 text-amber-200 border-b border-amber-800 font-black' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span>🎼 Music</span>
        </button>
        <button
          onClick={() => setDomain('horror')}
          className={`py-3 text-[9px] font-serif font-bold tracking-wide border-r border-zinc-850 transition-colors flex items-center justify-center gap-0.5 ${
            domain === 'horror' ? 'bg-red-950/25 text-red-300 border-b border-red-850 font-black' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span>💀 Horror</span>
        </button>
        <button
          onClick={() => setDomain('diary')}
          className={`py-3 text-[9px] font-serif font-bold tracking-wide border-r border-zinc-850 transition-colors flex items-center justify-center gap-0.5 ${
            domain === 'diary' ? 'bg-zinc-950/35 text-zinc-300 border-b border-zinc-600 font-black' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span>📓 Audits</span>
        </button>
        <button
          onClick={() => setDomain('underground')}
          className={`py-3 text-[9px] font-serif font-bold tracking-wide border-r border-zinc-850 transition-colors flex items-center justify-center gap-0.5 ${
            domain === 'underground' ? 'bg-emerald-950/25 text-emerald-300 border-b border-emerald-800 font-black' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span>📟 Zine</span>
        </button>
        <button
          onClick={() => setDomain('schemer')}
          className={`py-3 text-[9px] font-serif font-bold tracking-wide transition-colors flex items-center justify-center gap-0.5 ${
            domain === 'schemer' ? 'bg-red-950/30 text-red-400 border-b border-red-900 font-black' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span>😈 Schemer</span>
        </button>
      </div>

      <div className="flex-1 p-6 space-y-6">
        
        {/* Horror Format Selector (only visible in horror mode) */}
        {domain === 'horror' && (
          <div className="space-y-2.5 bg-red-950/10 p-3.5 rounded border border-red-900/30 animate-in slide-in-from-top-2 duration-150">
            <label className="block text-[10px] text-red-400 uppercase tracking-wider font-bold">Format Style</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setHorrorFormat('manuscript')}
                className={`px-2.5 py-1.5 rounded text-xs font-serif font-semibold border transition-all ${
                  horrorFormat === 'manuscript' 
                    ? 'bg-red-950/30 border-red-800 text-red-300' 
                    : 'bg-[#262220] border-zinc-800 text-zinc-400 hover:text-zinc-300'
                }`}
              >
                📖 Novel Manuscript
              </button>
              <button
                onClick={() => setHorrorFormat('screenplay')}
                className={`px-2.5 py-1.5 rounded text-xs font-serif font-semibold border transition-all ${
                  horrorFormat === 'screenplay' 
                    ? 'bg-red-950/30 border-red-800 text-red-300' 
                    : 'bg-[#262220] border-zinc-800 text-zinc-400 hover:text-zinc-300'
                }`}
              >
                🎬 Screenplay (Fountain)
              </button>
            </div>
          </div>
        )}

        {/* Self-Audit Format Selector (only visible in diary mode) */}
        {domain === 'diary' && (
          <div className="space-y-2.5 bg-amber-950/10 p-3.5 rounded border border-amber-900/30 animate-in slide-in-from-top-2 duration-150">
            <label className="block text-[10px] text-amber-400 uppercase tracking-wider font-bold">Journal Format</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDiaryFormat('logbook')}
                className={`px-2.5 py-1.5 rounded text-xs font-serif font-semibold border transition-all ${
                  diaryFormat === 'logbook' 
                    ? 'bg-amber-950/30 border-amber-800 text-amber-300' 
                    : 'bg-[#262220] border-zinc-800 text-zinc-400 hover:text-zinc-300'
                }`}
              >
                📓 Obsessive Logbook
              </button>
              <button
                onClick={() => setDiaryFormat('memoir')}
                className={`px-2.5 py-1.5 rounded text-xs font-serif font-semibold border transition-all ${
                  diaryFormat === 'memoir' 
                    ? 'bg-amber-950/30 border-amber-800 text-amber-300' 
                    : 'bg-[#262220] border-zinc-800 text-zinc-400 hover:text-zinc-300'
                }`}
              >
                📖 Visceral Memoir
              </button>
            </div>
          </div>
        )}

        {/* Self-Audit Format Selector (only visible in schemer mode) */}
        {domain === 'schemer' && (
          <div className="space-y-2.5 bg-red-950/10 p-3.5 rounded border border-red-900/30 animate-in slide-in-from-top-2 duration-150">
            <label className="block text-[10px] text-red-400 uppercase tracking-wider font-bold">Blueprints Setup</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSchemerFormat('blueprint')}
                className={`px-2.5 py-1.5 rounded text-xs font-serif font-semibold border transition-all ${
                  schemerFormat === 'blueprint' 
                    ? 'bg-red-950/30 border-red-800 text-red-350' 
                    : 'bg-[#262220] border-zinc-800 text-zinc-400 hover:text-zinc-300'
                }`}
              >
                📜 Rogue Blueprint
              </button>
              <button
                onClick={() => setSchemerFormat('pitch')}
                className={`px-2.5 py-1.5 rounded text-xs font-serif font-semibold border transition-all ${
                  schemerFormat === 'pitch' 
                    ? 'bg-red-950/30 border-red-800 text-red-350' 
                    : 'bg-[#262220] border-zinc-800 text-zinc-400 hover:text-zinc-300'
                }`}
              >
                💼 Shell Corp Pitch
              </button>
            </div>
          </div>
        )}

        {/* Presets Quick Launch (Filtered by Domain) */}
        {(domain !== 'diary' && domain !== 'underground' && domain !== 'schemer') && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {domain === 'music' ? 'Scholarly Presets' : 'Creative Presets'}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {PRESETS
                .filter(p => domain === 'music' ? p.field !== 'voices-in-the-score-7' && !['cosmic', 'gothic', 'body', 'folk'].includes(p.field) : p.field === 'voices-in-the-score-7' || ['cosmic', 'gothic', 'body', 'folk'].includes(p.field))
                .map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyPreset(preset)}
                    className="px-2 py-1 text-left text-[10px] bg-[#262220] hover:bg-[#2D2826] border border-zinc-800 hover:border-amber-900/40 rounded transition-all font-serif text-zinc-300 truncate hover:text-[#EFECE6] shadow-xs"
                    title={preset.name}
                  >
                    {preset.name}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Author Form Fields */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-zinc-400" />
            Primary Author
          </h3>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">First Name</label>
              <input
                type="text"
                value={authorFirst}
                onChange={(e) => setAuthorFirst(e.target.value)}
                placeholder="e.g., Maxwell S."
                className="w-full bg-[#262220] border border-zinc-850 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-900 font-serif"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">Last Name</label>
              <input
                type="text"
                value={authorLast}
                onChange={(e) => setAuthorLast(e.target.value)}
                placeholder="e.g., Hargrave"
                className="w-full bg-[#262220] border border-zinc-850 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-900 font-serif"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">Affiliated Institution</label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="Independent Researcher"
              className="w-full bg-[#262220] border border-zinc-850 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-900 font-serif"
            />
          </div>

          {/* Co-authors — dynamic list */}
          <div className="space-y-2 pt-1">
            {coauthors.map((ca, idx) => (
              <div key={idx} className="space-y-2 border-l-2 border-amber-950/60 pl-3 py-1 relative">
                <button
                  onClick={() => setCoauthors(prev => prev.filter((_, i) => i !== idx))}
                  className="absolute -right-1 top-0 text-zinc-600 hover:text-red-400 transition-colors"
                  title="Remove co-author"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">Co-Author {idx + 1} First</label>
                    <input
                      type="text"
                      value={ca.first}
                      onChange={(e) => setCoauthors(prev => prev.map((c, i) => i === idx ? { ...c, first: e.target.value } : c))}
                      placeholder="e.g., Carl"
                      className="w-full bg-[#262220] border border-zinc-850 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-900 font-serif"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">Last Name</label>
                    <input
                      type="text"
                      value={ca.last}
                      onChange={(e) => setCoauthors(prev => prev.map((c, i) => i === idx ? { ...c, last: e.target.value } : c))}
                      placeholder="e.g., Dahlhaus"
                      className="w-full bg-[#262220] border border-zinc-850 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-900 font-serif"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">Institution</label>
                  <input
                    type="text"
                    value={ca.institution}
                    onChange={(e) => setCoauthors(prev => prev.map((c, i) => i === idx ? { ...c, institution: e.target.value } : c))}
                    placeholder="Independent Researcher"
                    className="w-full bg-[#262220] border border-zinc-850 rounded px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-900 font-serif"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() => setCoauthors(prev => [...prev, { first: '', last: '', institution: '' }])}
              className="text-[11px] text-amber-500/95 hover:text-amber-400 transition-colors flex items-center gap-1 font-medium underline"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Co-Author
            </button>
          </div>
        </div>

        {/* Field / Genre Selector */}
        {(domain !== 'diary' && domain !== 'underground' && domain !== 'schemer') && (
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              {domain === 'music' ? 'Theoretical Field' : 'Horror Subgenre'}
            </h3>
            
            {domain === 'music' ? (
              <div className="grid grid-cols-2 gap-1.5">
                {THEORY_FIELDS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setField(f.id)}
                    className={`p-2 text-left rounded border transition-all ${
                      field === f.id
                        ? 'bg-amber-950/30 border-amber-800 text-amber-200 shadow-[inset_0_1px_1px_rgba(0,0,0,0.3)]'
                        : 'bg-[#262220] border-zinc-850 hover:border-zinc-800 text-zinc-400 hover:text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-1 font-serif text-[11px] font-bold">
                      <span className="text-[11px] text-amber-500 shrink-0">{f.icon}</span>
                      <span className="truncate">{f.label}</span>
                    </div>
                    <p className="text-[8.5px] text-zinc-500 font-sans mt-0.5 leading-tight truncate">
                      {f.desc}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'cosmic', label: 'Cosmic Dread', icon: '🌌', desc: 'Nameless deities, non-Euclidean geometries.' },
                  { id: 'gothic', label: 'Gothic Romance', icon: '🏰', desc: 'Ancestral decay, wet velvet crypts.' },
                  { id: 'body', label: 'Body Horror', icon: '👁️', desc: 'Cellular anomalies, sprouting bones.' },
                  { id: 'folk', label: 'Folk Horror', icon: '🌾', desc: 'Peat bogs, dry wicker kings.' }
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setField(g.id)}
                    className={`p-2.5 text-left rounded border transition-all ${
                      field === g.id
                        ? 'bg-red-950/30 border-red-800 text-red-350 shadow-[inset_0_1px_1px_rgba(0,0,0,0.3)]'
                        : 'bg-[#262220] border-zinc-850 hover:border-zinc-800 text-zinc-400 hover:text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-1 font-serif text-[11px] font-bold">
                      <span className="text-[11px] text-red-500 shrink-0">{g.icon}</span>
                      <span className="truncate">{g.label}</span>
                    </div>
                    <p className="text-[8.5px] text-zinc-500 font-sans mt-0.5 leading-tight truncate">
                      {g.desc}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Discourse Density Slider */}
        <div className="space-y-3 bg-[#221E1C] p-4 rounded border border-zinc-850/70">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
              <AlertOctagon className="w-3.5 h-3.5 text-amber-600" />
              Discourse Density
            </h3>
            <span className="text-xs font-bold font-mono text-amber-500 bg-[#161412] px-1.5 py-0.5 rounded">
              {madness}%
            </span>
          </div>
          
          <input
            type="range"
            min="0"
            max="100"
            value={madness}
            onChange={(e) => setMadness(Number(e.target.value))}
            className="w-full accent-amber-700 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
          />
          
          <div className="space-y-1">
            <div className={`text-xs font-serif ${madnessDesc.style}`}>
              {madnessDesc.label}
            </div>
            <p className="text-[10.5px] text-zinc-400 leading-relaxed font-sans">
              {madnessDesc.note}
            </p>
          </div>
        </div>

        {/* Manuscript Length Slider */}
        <div className="space-y-3 bg-[#221E1C] p-4 rounded border border-zinc-850/70">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
              Manuscript Length
            </h3>
            <span className="text-xs font-bold font-mono text-amber-500 bg-[#161412] px-1.5 py-0.5 rounded">
              {length} pp.
            </span>
          </div>
          
          <input
            type="range"
            min="3"
            max="120"
            step="1"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-amber-700 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
          />
          
          <div className="space-y-1">
            <div className={`text-xs font-serif ${getLengthLabel(length).style}`}>
              {getLengthLabel(length).label}
            </div>
            <p className="text-[10.5px] text-zinc-400 leading-relaxed font-sans">
              {getLengthLabel(length).note}
            </p>
          </div>

          {/* Quick length presets */}
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {[
              { label: '5 pp', value: 5 },
              { label: '15 pp', value: 15 },
              { label: '35 pp', value: 35 },
              { label: '60 pp', value: 60 },
              { label: '100 pp', value: 100 },
            ].map((preset) => (
              <button
                key={preset.value}
                onClick={() => setLength(preset.value)}
                className={`px-1.5 py-1 rounded text-[10px] font-semibold border transition-colors ${
                  Math.abs(length - preset.value) < 4
                    ? 'bg-amber-950/40 border-amber-800 text-amber-200'
                    : 'bg-[#262220] border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Discursive Drift Slider — conceptual / schizophrenic / unhinged dial */}
        <div className={`space-y-3 p-4 rounded border transition-colors ${
          drift > 75 ? 'bg-red-950/20 border-red-900/60' :
          drift > 50 ? 'bg-orange-950/15 border-orange-900/50' :
          drift > 25 ? 'bg-amber-950/10 border-amber-900/40' :
          'bg-[#221E1C] border-zinc-850/70'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-1 ${
              drift > 75 ? 'text-red-400' :
              drift > 50 ? 'text-orange-400' :
              drift > 25 ? 'text-amber-400' :
              'text-zinc-400'
            }`}>
              <Zap className={`w-3.5 h-3.5 ${drift > 60 ? 'animate-pulse' : ''}`} />
              Discursive Drift
            </h3>
            <span className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded ${
              drift > 75 ? 'bg-red-950/50 text-red-300' :
              drift > 50 ? 'bg-orange-950/40 text-orange-300' :
              drift > 25 ? 'bg-amber-950/40 text-amber-300' :
              'bg-[#161412] text-zinc-400'
            }`}>
              {drift}%
            </span>
          </div>
          
          <input
            type="range"
            min="0"
            max="100"
            value={drift}
            onChange={(e) => setDrift(Number(e.target.value))}
            className={`w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer ${
              drift > 75 ? 'accent-red-600' :
              drift > 50 ? 'accent-orange-600' :
              drift > 25 ? 'accent-amber-600' :
              'accent-zinc-500'
            }`}
          />
          
          <div className="space-y-1">
            <div className={`text-xs font-serif ${getDriftLabel(drift).style}`}>
              {getDriftLabel(drift).label}
            </div>
            <p className="text-[10.5px] text-zinc-400 leading-relaxed font-sans">
              {getDriftLabel(drift).note}
            </p>
          </div>

          {/* Quick drift presets */}
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {[
              { label: 'Sane', value: 0 },
              { label: 'Subtle', value: 30 },
              { label: 'Notable', value: 55 },
              { label: 'Unsettling', value: 75 },
              { label: 'Unhinged', value: 100 }
            ].map((preset) => (
              <button
                key={preset.value}
                onClick={() => setDrift(preset.value)}
                className={`px-1.5 py-1 rounded text-[9.5px] font-semibold border transition-colors ${
                  Math.abs(drift - preset.value) < 8
                    ? 'bg-red-950/40 border-red-800 text-red-200'
                    : 'bg-[#262220] border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Seed Input and Seeded Random Controls */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5 text-zinc-400" />
              Academic Seed
            </h3>
            <button
              onClick={handleRandomizeSeed}
              className="text-[10px] text-amber-500 hover:text-amber-400 flex items-center gap-0.5 uppercase font-semibold"
              title="Randomize Seed Word"
            >
              <Shuffle className="w-3 h-3" />
              Randomize
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              value={seed}
              onChange={(e) => setSeed(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              placeholder="Enter seed (e.g. babbitt-42)"
              className="w-full bg-[#262220] border border-zinc-850 rounded px-3 py-2 text-xs font-mono text-amber-500 focus:outline-none focus:border-amber-800 tracking-wide"
            />
            <div className="absolute right-2.5 top-2.5 text-[9.5px] font-mono text-zinc-600 uppercase pointer-events-none">
              LCG-PRNG
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 leading-normal font-serif italic">
            Any string seed guarantees a reproducible academic output. Perfect for verifying reviewer complaints!
          </p>
        </div>

      </div>

      {/* Bottom action drawer */}
      <div className="p-6 border-t border-zinc-800 bg-[#161412] shrink-0">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full py-3.5 px-4 rounded bg-amber-950 text-[#FAF8F4] font-serif font-bold text-sm hover:bg-amber-900 active:bg-amber-950 focus:outline-none transition-all shadow-md flex items-center justify-center gap-2 border border-amber-800 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <Sparkles className="w-4 h-4 text-amber-400 group-hover:animate-spin" />
          <span>{isGenerating ? 'Compiling Manuscript...' : 'Generate Manuscript'}</span>
        </button>
      </div>

    </div>
  );
};
