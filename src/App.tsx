import { useState, useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { PaperView } from './components/PaperView';
import { HorrorPaperView } from './components/HorrorPaperView';
import { DiaryPaperView } from './components/DiaryPaperView';
import { UndergroundPaperView } from './components/UndergroundPaperView';
import { generatePaper, GeneratedPaper, CoAuthor } from './utils/grammar';
import { generateHorror, GeneratedHorror } from './utils/horrorGrammar';
import { generateDiary, GeneratedDiary } from './utils/diaryGrammar';
import { generateUnderground, GeneratedUnderground } from './utils/undergroundGrammar';
import { generateSchemer, GeneratedSchemer } from './utils/schemerGrammar';
import { SchemerPaperView } from './components/SchemerPaperView';
import { GraduationCap, Music, AlertCircle } from 'lucide-react';

const LOADING_MESSAGES = [
  "Resolving structural voice-leading graphs...",
  "Computing pitch-class set cardinalities...",
  "Generating interval-class vectors...",
  "Rendering analytical figures and diagrams...",
  "Compiling bibliographic references...",
  "Formatting LaTeX equations...",
  "Indexing cross-references...",
  "Typesetting final manuscript...",
  "Running consistency checks on analytical claims...",
  "Preparing peer-review correspondence..."
];

export default function App() {
  // Generator State
  const [domain, setDomain] = useState<'music' | 'horror' | 'diary' | 'underground' | 'schemer'>('music');
  const [horrorFormat, setHorrorFormat] = useState<'manuscript' | 'screenplay'>('manuscript');
  const [diaryFormat, setDiaryFormat] = useState<'logbook' | 'memoir'>('logbook');
  const [schemerFormat, setSchemerFormat] = useState<'blueprint' | 'pitch'>('blueprint');

  const [field, setField] = useState('schenkerian');
  const [authorFirst, setAuthorFirst] = useState('Maxwell S.');
  const [authorLast, setAuthorLast] = useState('Hargrave');
  const [institution, setInstitution] = useState('Leuphana University');
  
  const [coauthors, setCoauthors] = useState<CoAuthor[]>([]);

  const [madness, setMadness] = useState(42);
  const [seed, setSeed] = useState('ursatz-42');
  const [length, setLength] = useState(15);
  const [drift, setDrift] = useState(0);

  // App state
  const [paper, setPaper] = useState<GeneratedPaper | null>(null);
  const [horrorPayload, setHorrorPayload] = useState<GeneratedHorror | null>(null);
  const [diaryPayload, setDiaryPayload] = useState<GeneratedDiary | null>(null);
  const [undergroundPayload, setUndergroundPayload] = useState<GeneratedUnderground | null>(null);
  const [schemerPayload, setSchemerPayload] = useState<GeneratedSchemer | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  // Toggle domain changes smoothly
  useEffect(() => {
    if (domain === 'horror') {
      const activeField = ['cosmic', 'gothic', 'body', 'folk'].includes(field) ? field : 'cosmic';
      setField(activeField);
      const initialHorror = generateHorror(
        activeField,
        horrorFormat,
        seed,
        madness,
        `${authorFirst} ${authorLast}`,
        coauthors.map(c => ({ name: `${c.first} ${c.last}`, institution: c.institution })),
        length,
        drift
      );
      setHorrorPayload(initialHorror);
    } else if (domain === 'diary') {
      const initialDiary = generateDiary(
        seed,
        madness,
        drift,
        `${authorFirst} ${authorLast}`,
        length,
        diaryFormat
      );
      setDiaryPayload(initialDiary);
    } else if (domain === 'underground') {
      const initialUnderground = generateUnderground(
        seed,
        madness,
        drift,
        `${authorFirst} ${authorLast}`,
        length
      );
      setUndergroundPayload(initialUnderground);
    } else if (domain === 'schemer') {
      const initialSchemer = generateSchemer(
        seed,
        madness,
        drift,
        `${authorFirst} ${authorLast}`,
        length,
        schemerFormat
      );
      setSchemerPayload(initialSchemer);
    } else {
      const activeField = !['cosmic', 'gothic', 'body', 'folk'].includes(field) ? field : 'schenkerian';
      setField(activeField);
      const initialPaper = generatePaper(
        activeField,
        seed,
        madness,
        authorFirst,
        authorLast,
        institution,
        coauthors,
        length,
        drift
      );
      setPaper(initialPaper);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain, diaryFormat, horrorFormat, schemerFormat]);

  // Load an initial paper on mount
  useEffect(() => {
    const initialPaper = generatePaper(
      field,
      seed,
      madness,
      authorFirst,
      authorLast,
      institution,
      coauthors,
      length,
      drift
    );
    setPaper(initialPaper);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Paper / Story Generation with custom loading sequence
  const handleGenerate = () => {
    setIsGenerating(true);
    setLoadingMsgIndex(0);

    const horrorMsgs = [
      "Tethering dimensional coordinates...",
      "Suturing flesh tissues...",
      "Grafting cellular anomalies...",
      "Decaying ancestral topiary gardens...",
      "Whispering between the candle wax layers...",
      "Sinking dry straw bodies into peat bog chambers...",
      "Calculating shadow curvature indices...",
      "Formulating non-Euclidean geometries..."
    ];

    const diaryMsgs = [
      "Recalibrating ocular alignment metrics...",
      "Halving almonds vertically...",
      "Sanitizing braided audio interferences...",
      "Compiling Chicago Manual of Style compliance heuristics...",
      "Sieving sub-transient expectancies...",
      "Anchoring Fabfilter EQ node constraints...",
      "Fleshing out redundant archival logs..."
    ];

    const undergroundMsgs = [
      "Packing dubplates into foam tote...",
      "Itemizing warehouse rental and cleaning balances...",
      "Calibrating sub frequencies on the mono stack...",
      "Stretching kick cuts across 8-beat bars...",
      "Verifying Eastern Market Discord server tags...",
      "Asserting mutual-aid consent frameworks..."
    ];

    const schemerMsgs = [
      "Establishing proxy routes in Switzerland...",
      "Mating EULA drafts with hidden debt clauses...",
      "Scraping national public grief registries...",
      "Lowballing property value tensors...",
      "Erecting anti-government sat-shield landing pages...",
      "Laundering transactional outputs via split-off mixers..."
    ];

    const activeMsgs = domain === 'horror' ? horrorMsgs : 
                       domain === 'diary' ? diaryMsgs : 
                       domain === 'underground' ? undergroundMsgs : 
                       domain === 'schemer' ? schemerMsgs : 
                       LOADING_MESSAGES;

    // Cycle through loading messages
    const messageInterval = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % activeMsgs.length);
    }, 650);

    // Scale generation time with manuscript length
    const generationTime = Math.min(6500, 1800 + length * 40);

    setTimeout(() => {
      clearInterval(messageInterval);
      
      if (domain === 'horror') {
        const newHorror = generateHorror(
          field,
          horrorFormat,
          seed,
          madness,
          `${authorFirst} ${authorLast}`,
          coauthors.map(c => ({ name: `${c.first} ${c.last}`, institution: c.institution })),
          length,
          drift
        );
        setHorrorPayload(newHorror);
      } else if (domain === 'diary') {
        const newDiary = generateDiary(
          seed,
          madness,
          drift,
          `${authorFirst} ${authorLast}`,
          length,
          diaryFormat
        );
        setDiaryPayload(newDiary);
      } else if (domain === 'underground') {
        const newUnderground = generateUnderground(
          seed,
          madness,
          drift,
          `${authorFirst} ${authorLast}`,
          length
        );
        setUndergroundPayload(newUnderground);
      } else if (domain === 'schemer') {
        const newSchemer = generateSchemer(
          seed,
          madness,
          drift,
          `${authorFirst} ${authorLast}`,
          length,
          schemerFormat
        );
        setSchemerPayload(newSchemer);
      } else {
        const newPaper = generatePaper(
          field,
          seed,
          madness,
          authorFirst,
          authorLast,
          institution,
          coauthors,
          length,
          drift
        );
        setPaper(newPaper);
      }
      setIsGenerating(false);
    }, generationTime);
  };

  return (
    <div className="flex flex-col h-screen bg-[#161412] text-zinc-100 overflow-hidden">
      
      {/* Subtle Screen Border Overlay / Print Hidden Header */}
      <header className="bg-[#1C1917] border-b border-zinc-800 px-6 py-3 flex items-center justify-between shrink-0 select-none print:hidden transition-colors duration-150">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded border flex items-center justify-center transition-colors ${
            domain === 'horror' ? 'bg-red-950/80 border-red-900/40' : 
            domain === 'diary' ? 'bg-zinc-900 border-zinc-850' : 
            domain === 'schemer' ? 'bg-red-950/45 border-red-800/45' :
            'bg-amber-950 border-amber-800'
          }`}>
            <Music className={`w-4.5 h-4.5 ${
              domain === 'horror' ? 'text-red-400' : 
              domain === 'diary' ? 'text-zinc-400' : 
              domain === 'schemer' ? 'text-red-500' :
              'text-amber-400'
            }`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest font-sans text-zinc-300">
                {domain === 'music' ? 'Journal of Music Theory' : 
                 domain === 'horror' ? 'Leuphana Speculative Horror Press' : 
                 domain === 'diary' ? 'Obsessive self-auditing ledger' :
                 'Malignant schemer operations ledger'}
              </span>
            </div>
            <p className="text-[10.5px] text-zinc-500 font-serif italic">
              {domain === 'music' ? 'A Quarterly Publication of Scholarly Research in Music Theory and Analysis' : 
               domain === 'horror' ? 'Publishing critical studies in supernatural fiction and production screenplays' : 
               domain === 'diary' ? 'Meticulous, subthreshold ritual matrices of a misaligned dimension' :
               'Leaked structural blueprints for quiet, highly predatory wealth extraction'}
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 text-[11px] text-zinc-400 font-sans">
          <div className="flex items-center gap-1">
            <GraduationCap className={`w-3.5 h-3.5 ${
              domain === 'horror' ? 'text-red-500' : 
              domain === 'diary' ? 'text-zinc-400' : 
              domain === 'schemer' ? 'text-red-600' :
              'text-amber-500'
            }`} />
            <span>{domain === 'music' ? 'Peer-Reviewed' : domain === 'horror' ? 'Juried Anthology' : domain === 'diary' ? 'Internal Use Only' : 'Classified Access'}</span>
          </div>
          <span className="text-zinc-700">|</span>
          <span>{domain === 'music' ? 'ISSN 0022-2909' : domain === 'horror' ? 'ISAN 0012-9830' : domain === 'diary' ? 'VERIDICAL RITE 111-VIRGA' : 'SEC-REG 402-A'}</span>
        </div>
      </header>

      {/* Core App Body (Sidebar + Paper/Horror Preview Pane) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Control Panel (Print hidden) */}
        <div className="print:hidden shrink-0">
          <ControlPanel
            domain={domain}
            setDomain={setDomain}
            horrorFormat={horrorFormat}
            setHorrorFormat={setHorrorFormat}
            diaryFormat={diaryFormat}
            setDiaryFormat={setDiaryFormat}
            schemerFormat={schemerFormat}
            setSchemerFormat={setSchemerFormat}
            field={field}
            setField={setField}
            authorFirst={authorFirst}
            setAuthorFirst={setAuthorFirst}
            authorLast={authorLast}
            setAuthorLast={setAuthorLast}
            institution={institution}
            setInstitution={setInstitution}
            coauthors={coauthors}
            setCoauthors={setCoauthors}
            madness={madness}
            setMadness={setMadness}
            seed={seed}
            setSeed={setSeed}
            length={length}
            setLength={setLength}
            drift={drift}
            setDrift={setDrift}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>

        {/* Paper / Horror / Diary Preview Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative print:overflow-visible print:h-auto">
          {domain === 'horror' ? (
            horrorPayload ? (
              <HorrorPaperView horror={horrorPayload} />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-[#F8F6F0] p-6 text-center">
                <div className="space-y-4 max-w-sm">
                  <AlertCircle className="w-12 h-12 text-red-950 mx-auto" />
                  <h3 className="font-serif font-bold text-zinc-800 font-serif">No Script Loaded</h3>
                </div>
              </div>
            )
          ) : domain === 'diary' ? (
            diaryPayload ? (
              <DiaryPaperView diary={diaryPayload} />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-[#F8F6F0] p-6 text-center">
                <div className="space-y-4 max-w-sm">
                  <AlertCircle className="w-12 h-12 text-zinc-500 mx-auto" />
                  <h3 className="font-serif font-bold text-zinc-800 font-serif">No Log Loaded</h3>
                </div>
              </div>
            )
          ) : domain === 'underground' ? (
            undergroundPayload ? (
              <UndergroundPaperView underground={undergroundPayload} />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-[#F8F6F0] p-6 text-center">
                <div className="space-y-4 max-w-sm">
                  <AlertCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h3 className="font-serif font-bold text-zinc-800 font-serif">No Dispatch Loaded</h3>
                </div>
              </div>
            )
          ) : domain === 'schemer' ? (
            schemerPayload ? (
              <SchemerPaperView schemer={schemerPayload} />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-[#F8F6F0] p-6 text-center">
                <div className="space-y-4 max-w-sm">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                  <h3 className="font-serif font-bold text-zinc-800 font-serif">No Dossier Loaded</h3>
                </div>
              </div>
            )
          ) : (
            paper ? (
              <PaperView paper={paper} seed={seed} />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-[#F8F6F0] p-6 text-center">
                <div className="space-y-4 max-w-sm">
                  <AlertCircle className="w-12 h-12 text-amber-950 mx-auto" />
                  <h3 className="font-serif font-bold text-zinc-800">No Document Loaded</h3>
                </div>
              </div>
            )
          )}

          {/* Loading Screen Overlay */}
          {isGenerating && (
            <div className="absolute inset-0 bg-[#161412]/95 flex flex-col items-center justify-center p-8 z-50 font-sans animate-in fade-in duration-200">
              <div className="max-w-md w-full text-center space-y-6">
                
                {/* Spinner Animation */}
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className={`absolute inset-0 rounded-full border-2 border-dashed animate-spin duration-10000 ${domain === 'horror' ? 'border-red-600/40' : 'border-amber-600/40'}`}></div>
                  <div className="absolute inset-2 rounded-full border border-zinc-800 animate-ping"></div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border shadow-lg ${domain === 'horror' ? 'bg-red-950 border-red-500/50' : 'bg-amber-950 border-amber-500/50'}`}>
                    <GraduationCap className={`w-6 h-6 ${domain === 'horror' ? 'text-red-400' : 'text-amber-400'}`} />
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-lg font-serif font-bold tracking-wide text-[#EFECE6]">
                    {domain === 'horror' ? 'Compiling Horror Manuscript...' : 'Compiling Academic Manuscript...'}
                  </h2>
                  
                  {/* Progress indicator */}
                  <div className="h-1.5 w-48 mx-auto bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 rounded-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-red-600 via-red-400 to-red-600 w-full origin-left"></div>
                  </div>
                </div>

                {/* Witty Milestones Text */}
                <div className="p-4 bg-[#221E1C] rounded border border-zinc-800/60 min-h-[76px] flex items-center justify-center shadow-inner">
                  <p className="text-xs font-serif font-medium italic text-red-200/85 leading-relaxed animate-pulse">
                    {(domain === 'horror' 
                      ? [
                          "Tethering dimensional coordinates...",
                          "Suturing flesh tissues...",
                          "Grafting cellular anomalies...",
                          "Decaying ancestral topiary gardens...",
                          "Whispering between the candle wax layers...",
                          "Sinking dry straw bodies into peat bog chambers...",
                          "Calculating shadow curvature indices...",
                          "Formulating non-Euclidean geometries..."
                        ] 
                      : LOADING_MESSAGES)[loadingMsgIndex]}
                  </p>
                </div>

                <div className="text-[10px] text-zinc-600 tracking-widest uppercase font-bold">
                  {domain === 'horror' ? 'Drafting Speculative Literary Work' : 'Preparing Manuscript for Publication'}
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
