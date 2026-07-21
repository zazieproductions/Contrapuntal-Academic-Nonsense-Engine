import React, { useState } from 'react';
import { GeneratedSchemer } from '../utils/schemerGrammar';
import { Copy, Check, FileText, Download, Code, BookOpen, ShieldAlert } from 'lucide-react';
import { exportSchemerAsPdf } from '../utils/pdfExport';

interface SchemerPaperViewProps {
  schemer: GeneratedSchemer;
}

export const SchemerPaperView: React.FC<SchemerPaperViewProps> = ({ schemer }) => {
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'preview' | 'latex' | 'markdown'>('preview');
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMap(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedMap(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    try {
      await exportSchemerAsPdf(schemer);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F6F0] border-l border-zinc-300/80 relative">
      
      {/* PDF generation overlay */}
      {isExportingPdf && (
        <div className="absolute inset-0 z-50 bg-[#161412]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-6 select-none">
          <div className="flex flex-col items-center gap-4 max-w-xs text-center text-zinc-200">
            <div className="w-12 h-12 rounded-full border-2 border-red-900/30 border-t-red-600 animate-spin" />
            <div>
              <p className="font-mono font-bold text-red-400 text-base">Compiling Predation Dossier</p>
              <p className="text-xs text-zinc-400 mt-1 font-mono">Assembling liability shields and transaction routes…</p>
            </div>
            <div className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">jsPDF · Courier · A4</div>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="h-14 bg-[#EFECE6] border-b border-zinc-300/80 px-6 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${activeTab === 'preview' ? 'bg-red-950 text-[#FDFBF7] shadow-sm' : 'text-zinc-700 hover:bg-zinc-200'}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Dossier Preview
          </button>
          <button
            onClick={() => setActiveTab('latex')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${activeTab === 'latex' ? 'bg-red-950 text-[#FDFBF7] shadow-sm' : 'text-zinc-700 hover:bg-zinc-200'}`}
          >
            <Code className="w-3.5 h-3.5" />
            LaTeX Source
          </button>
          <button
            onClick={() => setActiveTab('markdown')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${activeTab === 'markdown' ? 'bg-red-950 text-[#FDFBF7] shadow-sm' : 'text-zinc-700 hover:bg-zinc-200'}`}
          >
            <FileText className="w-3.5 h-3.5" />
            Markdown
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="px-3 py-1.5 rounded bg-red-950 text-[#FDFBF7] text-xs font-medium hover:bg-red-900 transition-all flex items-center gap-1 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download as professionally formatted PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPdf ? 'Generating...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Scroll View (Carbon/Red Mastermind aesthetic) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-5xl mx-auto w-full">
        
        {activeTab === 'preview' && (
          <div className="space-y-6">
            
            <div className="bg-[#1E1E1E] border border-red-950/55 shadow-2xl rounded-sm px-8 md:px-16 py-12 md:py-16 text-zinc-200 font-mono text-[12.5px] leading-relaxed">
              
              {/* Malignant Red Alert Banner */}
              <div className="border border-red-800 bg-red-950/20 rounded p-3 mb-8 flex items-center gap-3 select-none">
                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 animate-pulse" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 block">
                    UNFILTERED ROGUE MASTERMIND MODE ACTIVE
                  </span>
                  <span className="text-[9.5px] text-red-300 italic">
                    Full ethical bypass confirmed. Output calibrated for maximum predatory efficiency.
                  </span>
                </div>
              </div>

              {/* Title Header */}
              <div className="border-b border-zinc-800 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <h1 className="text-xl font-bold tracking-tight uppercase text-red-500">
                    {schemer.title}
                  </h1>
                  <p className="text-[10.5px] text-zinc-400 mt-1 uppercase">
                    Architect: {schemer.author} · Leuphana University
                  </p>
                </div>
                <div className="text-right text-[10px] text-zinc-500 font-mono">
                  <div>CLASSIFICATION: PROPRIETARY</div>
                  <div>YEAR DEPLOYED: {schemer.year}</div>
                </div>
              </div>

              {/* Shell Intermediary Companies */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded p-4 mb-8 space-y-1.5">
                <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider block">OFFSHORE INTERMEDIARIES</span>
                {schemer.coconspirators.map((co, idx) => (
                  <div key={idx} className="flex justify-between text-[11px] font-mono">
                    <span className="text-zinc-350 font-semibold">{co.name}</span>
                    <span className="text-zinc-500">[{co.role}]</span>
                  </div>
                ))}
              </div>

              {/* Strategy Diagnostics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 border border-zinc-800 p-4 rounded bg-zinc-950/40 mb-8">
                <div className="text-center">
                  <span className="text-[8px] text-zinc-500 uppercase tracking-wider block">Moral Decay</span>
                  <span className="text-sm font-bold text-red-500">{schemer.systemDiagnostics.moralDecay}%</span>
                </div>
                <div className="text-center">
                  <span className="text-[8px] text-zinc-500 uppercase tracking-wider block">Est. Yield Coeff.</span>
                  <span className="text-sm font-bold text-emerald-400">{schemer.systemDiagnostics.yieldCoefficient}%</span>
                </div>
                <div className="text-center">
                  <span className="text-[8px] text-zinc-500 uppercase tracking-wider block">Prosecutorial Risk</span>
                  <span className="text-sm font-bold text-yellow-500">{schemer.systemDiagnostics.exposureRisk}%</span>
                </div>
                <div className="text-center">
                  <span className="text-[8px] text-zinc-500 uppercase tracking-wider block">Heartlessness</span>
                  <span className="text-sm font-bold text-red-400">{schemer.systemDiagnostics.heartlessnessIndex}%</span>
                </div>
                <div className="text-center">
                  <span className="text-[8px] text-zinc-500 uppercase tracking-wider block">Execution Prob.</span>
                  <span className="text-sm font-bold text-blue-400">{schemer.systemDiagnostics.executionProbability}%</span>
                </div>
              </div>

              {/* Blueprints */}
              <div className="space-y-8">
                {schemer.blueprints.map(bp => (
                  <div key={bp.id} className="space-y-3 border-b border-zinc-850 pb-6 last:border-0 last:pb-0">
                    <h3 className="text-sm font-bold text-red-400 uppercase tracking-wide">
                      {bp.id}. {bp.title}
                    </h3>
                    <p className="text-zinc-350 italic text-xs mb-3">
                      Strategy: {bp.description}
                    </p>
                    <ul className="space-y-2 pl-4 list-disc text-zinc-300 text-xs">
                      {bp.steps.map((s, idx) => (
                        <li key={idx} className="leading-relaxed">{s}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Closing Memo */}
              <div className="border-t border-zinc-800 pt-6 mt-8 text-xs font-serif italic text-red-300 text-center bg-zinc-950/20 p-4 rounded">
                "{schemer.closingMemo}"
              </div>

              {/* Footer copyright */}
              <div className="mt-12 pt-6 border-t border-zinc-800 text-center text-[9px] text-zinc-500 select-none">
                Classified Protocol Dossier · STRICT-DOMINION-VOC · Compiled programmatically via Leuphana University systems
              </div>

            </div>

          </div>
        )}

        {activeTab === 'latex' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold font-sans text-zinc-850">LaTeX Source Document (.tex)</h3>
              <button
                onClick={() => handleCopy(schemer.rawLaTeX, 'latex')}
                className="px-3 py-1.5 rounded bg-red-950 text-white text-xs font-medium hover:bg-red-900 transition-colors flex items-center gap-1"
              >
                {copiedMap['latex'] ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedMap['latex'] ? 'Copied LaTeX!' : 'Copy Source'}
              </button>
            </div>
            <pre className="bg-[#1e1e1e] text-zinc-200 p-5 rounded-lg overflow-x-auto max-h-[600px] leading-relaxed border border-zinc-800 shadow-inner select-all">
              {schemer.rawLaTeX}
            </pre>
          </div>
        )}

        {activeTab === 'markdown' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold font-sans text-zinc-850">Markdown Source Document (.md)</h3>
              <button
                onClick={() => handleCopy(schemer.rawMarkdown, 'markdown')}
                className="px-3 py-1.5 rounded bg-red-950 text-white text-xs font-medium hover:bg-red-900 transition-colors flex items-center gap-1"
              >
                {copiedMap['markdown'] ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedMap['markdown'] ? 'Copied Markdown!' : 'Copy Source'}
              </button>
            </div>
            <pre className="bg-[#1e1e1e] text-zinc-200 p-5 rounded-lg overflow-x-auto max-h-[600px] leading-relaxed border border-zinc-800 shadow-inner select-all whitespace-pre-wrap">
              {schemer.rawMarkdown}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
};
