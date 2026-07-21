import React, { useState } from 'react';
import { GeneratedDiary } from '../utils/diaryGrammar';
import { Copy, Check, FileText, Download, Code, BookOpen } from 'lucide-react';
import { exportDiaryAsPdf } from '../utils/pdfExport';

interface DiaryPaperViewProps {
  diary: GeneratedDiary;
}

export const DiaryPaperView: React.FC<DiaryPaperViewProps> = ({ diary }) => {
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
      await exportDiaryAsPdf(diary);
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
        <div className="absolute inset-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-6 select-none">
          <div className="flex flex-col items-center gap-4 max-w-xs text-center">
            <div className="w-12 h-12 rounded-full border-2 border-amber-950/30 border-t-amber-950 animate-spin" />
            <div>
              <p className="font-serif font-bold text-zinc-800 text-base">Compiling self-audit log...</p>
              <p className="text-xs text-zinc-500 mt-1 font-serif italic">Formatting dotted grid and diagnostic tensors…</p>
            </div>
            <div className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">jsPDF · Rhodia Dotted · A4</div>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="h-14 bg-[#EFECE6] border-b border-zinc-300/80 px-6 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${activeTab === 'preview' ? 'bg-amber-950 text-[#FDFBF7] shadow-sm' : 'text-zinc-700 hover:bg-zinc-200'}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Audit Log Preview
          </button>
          <button
            onClick={() => setActiveTab('latex')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${activeTab === 'latex' ? 'bg-amber-950 text-[#FDFBF7] shadow-sm' : 'text-zinc-700 hover:bg-zinc-200'}`}
          >
            <Code className="w-3.5 h-3.5" />
            LaTeX Source
          </button>
          <button
            onClick={() => setActiveTab('markdown')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${activeTab === 'markdown' ? 'bg-amber-950 text-[#FDFBF7] shadow-sm' : 'text-zinc-700 hover:bg-zinc-200'}`}
          >
            <FileText className="w-3.5 h-3.5" />
            Markdown
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="px-3 py-1.5 rounded bg-amber-950 text-[#FDFBF7] text-xs font-medium hover:bg-amber-900 transition-all flex items-center gap-1 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download as professionally formatted PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPdf ? 'Generating...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Scroll Pane with Dotted Grid Styling (Rhodia DotPad #18 vellum) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-5xl mx-auto w-full">
        
        {activeTab === 'preview' && (
          <div className="space-y-6">
            
            <div 
              className="bg-[#FDFBF7] border border-zinc-300/60 shadow-md rounded-sm px-8 md:px-16 py-12 md:py-16 text-zinc-900 relative leading-relaxed text-[13px]"
              style={{
                backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                backgroundPosition: '10px 10px'
              }}
            >
              {/* Ivory header label */}
              <div className="border-b border-zinc-800 pb-4 mb-8 text-[11px] font-sans tracking-wide text-zinc-600 flex flex-col md:flex-row justify-between gap-2 bg-[#FDFBF7]/90 p-2 rounded">
                <div>
                  <span className="font-bold text-amber-950">Catalogued under:</span>{' '}
                  <span className="font-mono text-zinc-700">{diary.catalogPath}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold">DATE:</span> {diary.date}
                </div>
              </div>

              {/* Meta Details */}
              <div className="bg-zinc-50/90 border border-zinc-200 rounded p-4 mb-8 space-y-2 font-sans">
                <div>
                  <span className="font-bold text-zinc-700 text-[10px] uppercase tracking-wider block">Wake Time</span>
                  <span className="font-mono text-xs text-zinc-900">{diary.wakeTime}</span>
                </div>
                <div>
                  <span className="font-bold text-zinc-700 text-[10px] uppercase tracking-wider block">Atmosphere Diagnostics</span>
                  <p className="text-xs text-zinc-800 italic font-serif leading-normal mt-1">
                    {diary.moodNote}
                  </p>
                </div>
              </div>

              {/* Daily Schedule (Only for Clinical Logbooks) */}
              {diary.format === 'logbook' && (
                <div className="space-y-6 mb-10 bg-[#FDFBF7]/95 p-4 rounded border border-zinc-250/40 shadow-xs">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-amber-950 border-b border-zinc-200 pb-1.5">
                    DAILY OPERATIONAL SCHEDULE
                  </h2>
                  
                  <div className="space-y-6">
                    {diary.rituals.map((rit, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[11px] bg-amber-950/10 text-amber-950 px-1.5 py-0.5 rounded font-bold">
                            {rit.time}
                          </span>
                          <span className="font-bold text-xs uppercase tracking-wider text-zinc-800">
                            {rit.title}
                          </span>
                        </div>
                        <ul className="list-disc pl-5 space-y-1.5 text-zinc-750 text-xs font-serif">
                          {rit.paragraphs.map((p, pIdx) => (
                            <li key={pIdx}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dotted Log / Memoir entries */}
              <div className="space-y-6 mb-10 bg-[#FDFBF7]/95 p-4 rounded border border-zinc-250/40 shadow-xs">
                <h2 className="text-xs font-bold uppercase tracking-widest text-amber-950 border-b border-zinc-200 pb-1.5">
                  {diary.format === 'memoir' ? "MEMOIR OBSERVATIONS" : "TIMESTAMPED OBSERVATIONS"}
                </h2>
                
                <div className="space-y-6">
                  {diary.diaryEntries.map((entry, idx) => (
                    <div key={idx} className="space-y-2 border-l-2 border-zinc-200 pl-4">
                      <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500">
                        <span>[{entry.timestamp}]</span>
                        <span className="font-bold text-zinc-800">{entry.title}</span>
                      </div>
                      <p className={`text-zinc-800 leading-relaxed text-justify font-serif ${diary.format === 'memoir' ? 'text-sm text-indent' : 'text-xs'}`}>
                        {entry.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Tensors & Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-[#221E1C] text-zinc-300 p-4 rounded border border-zinc-800 mb-8 font-sans">
                <div className="text-center">
                  <span className="text-[8px] uppercase tracking-wider text-zinc-500 block">Structural Integrity</span>
                  <span className="text-sm font-bold font-mono text-amber-400">{diary.diagnostics.structuralIntegrity}%</span>
                </div>
                <div className="text-center">
                  <span className="text-[8px] uppercase tracking-wider text-zinc-500 block">Social Exposure</span>
                  <span className="text-sm font-bold font-mono text-red-400">{diary.diagnostics.socialExposureRisk}%</span>
                </div>
                <div className="text-center">
                  <span className="text-[8px] uppercase tracking-wider text-zinc-500 block">Hope for Humanity</span>
                  <span className="text-sm font-bold font-mono text-zinc-400">{diary.diagnostics.hopeForHumanity}%</span>
                </div>
                <div className="text-center">
                  <span className="text-[8px] uppercase tracking-wider text-zinc-500 block">Compulsion Index</span>
                  <span className="text-sm font-bold font-mono text-amber-500">{diary.diagnostics.compulsionLevel}%</span>
                </div>
                <div className="text-center col-span-2 md:col-span-1">
                  <span className="text-[8px] uppercase tracking-wider text-zinc-500 block">Precision Quotient</span>
                  <span className="text-sm font-bold font-mono text-emerald-400">{diary.diagnostics.precisionQuotient}%</span>
                </div>
              </div>

              {/* Footer Mantras */}
              <div className="bg-zinc-50/90 border border-zinc-200 rounded p-4 font-serif text-xs space-y-3 text-center select-all">
                <div>
                  <span className="font-sans font-bold text-zinc-700 text-[9px] uppercase tracking-wider block mb-1">Closing Mantra</span>
                  <span className="italic">"{diary.closingMantra}"</span>
                </div>
                <div className="pt-2 border-t border-zinc-200">
                  <span className="font-sans font-bold text-zinc-700 text-[9px] uppercase tracking-wider block mb-1">Next Operations Protocol</span>
                  <span className="font-sans text-xs text-zinc-800 font-medium">{diary.nextTask}</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {activeTab === 'latex' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold font-sans text-zinc-800">LaTeX Log Document (.tex)</h3>
              <button
                onClick={() => handleCopy(diary.rawLaTeX, 'latex')}
                className="px-3 py-1.5 rounded bg-amber-950 text-white text-xs font-medium hover:bg-amber-900 transition-colors flex items-center gap-1"
              >
                {copiedMap['latex'] ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedMap['latex'] ? 'Copied LaTeX!' : 'Copy Source'}
              </button>
            </div>
            <pre className="bg-[#1e1e1e] text-zinc-200 p-5 rounded-lg overflow-x-auto max-h-[600px] leading-relaxed border border-zinc-800 shadow-inner select-all">
              {diary.rawLaTeX}
            </pre>
          </div>
        )}

        {activeTab === 'markdown' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold font-sans text-zinc-800">Markdown Log Document (.md)</h3>
              <button
                onClick={() => handleCopy(diary.rawMarkdown, 'markdown')}
                className="px-3 py-1.5 rounded bg-amber-950 text-white text-xs font-medium hover:bg-amber-900 transition-colors flex items-center gap-1"
              >
                {copiedMap['markdown'] ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedMap['markdown'] ? 'Copied Markdown!' : 'Copy Source'}
              </button>
            </div>
            <pre className="bg-[#1e1e1e] text-zinc-200 p-5 rounded-lg overflow-x-auto max-h-[600px] leading-relaxed border border-zinc-800 shadow-inner select-all whitespace-pre-wrap">
              {diary.rawMarkdown}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
};
