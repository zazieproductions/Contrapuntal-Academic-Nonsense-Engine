import React, { useState } from 'react';
import { GeneratedUnderground } from '../utils/undergroundGrammar';
import { Copy, Check, FileText, Download, Code, BookOpen } from 'lucide-react';
import { exportUndergroundAsPdf } from '../utils/pdfExport';

interface UndergroundPaperViewProps {
  underground: GeneratedUnderground;
}

export const UndergroundPaperView: React.FC<UndergroundPaperViewProps> = ({ underground }) => {
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
      await exportUndergroundAsPdf(underground);
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
              <p className="font-serif font-bold text-zinc-800 text-base">Typesetting DIY zine…</p>
              <p className="text-xs text-zinc-500 mt-1 font-serif italic">Sizing margins, logs, and manifesto layers…</p>
            </div>
            <div className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">jsPDF · Helvetica · A4</div>
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
            Zine Preview
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

      {/* Main Content Scroll Pane */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-5xl mx-auto w-full">
        
        {activeTab === 'preview' && (
          <div className="space-y-6">
            
            <div className="bg-[#FDFBF7] border-2 border-zinc-900 shadow-md rounded-sm px-8 md:px-16 py-12 md:py-16 text-zinc-900 relative leading-relaxed text-[13.5px]">
              
              {/* Photocopy border accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-zinc-900" />
              
              {/* Title Block (Zine-like high contrast) */}
              <div className="border-b border-zinc-900 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <span className="text-[10px] font-mono bg-zinc-900 text-white px-2 py-0.5 rounded uppercase tracking-widest mb-2 inline-block">
                    diy underground dispatch
                  </span>
                  <h1 className="text-2xl font-mono font-black tracking-tighter uppercase leading-none mt-1">
                    {underground.title}
                  </h1>
                </div>
                <div className="font-mono text-xs text-zinc-500 text-right">
                  <div>DATE: {underground.date}</div>
                  <div className="font-bold text-zinc-800">{underground.location}</div>
                </div>
              </div>

              {/* Main body prose in high contrast sans-serif/mono hybrid */}
              <div className="space-y-6 font-sans text-zinc-800">
                
                {/* Paragraph 1: Venue & Eviction Payout info */}
                <p className="leading-relaxed text-justify">
                  I played a benefit for a displaced queer collective in the city. Entry was pay-what-you-can {underground.financials.ticketRange}. We raised <strong className="text-zinc-950 font-bold">${underground.financials.totalRaised}</strong>. After venue costs (${underground.financials.venueCost}), security (${underground.financials.securityCost}), insurance rider (${underground.financials.insuranceCost}), and a ${underground.financials.cleaningCost} cleaning fee, <strong>${underground.financials.netPayout}</strong> went straight to {underground.financials.beneficiary}.
                </p>

                {/* Dubplate specifications block */}
                <div className="my-6 p-4 bg-zinc-50 border border-zinc-300/60 rounded-sm relative">
                  <div className="absolute top-2 right-3 text-[9px] font-mono text-zinc-400 uppercase tracking-wider">Foam Tote Ledger</div>
                  <h3 className="font-mono font-bold text-xs text-zinc-900 uppercase tracking-wider mb-2">
                    Dubplate Manifest
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs font-mono text-zinc-700">
                    {underground.gearAndDubplates.plates.map((plate, idx) => (
                      <li key={idx}>{plate}</li>
                    ))}
                  </ul>
                </div>

                {/* Paragraph 2: The performance peak */}
                <p className="leading-relaxed text-justify">
                  My set ran {underground.performance.duration} minutes. The peak moment was minute {underground.performance.peakMinute}, when I {underground.performance.peakAction}. Nobody filmed it. {underground.performance.eyewitnessCount} people told me about it the next day anyway, with the kind of detail you can’t get from a screen: where they were standing, what it felt like in their sternum, the exact lyric fragment that landed.
                </p>

                {/* Manifesto Separation Callout */}
                <blockquote className="border-l-4 border-zinc-900 pl-4 my-8 py-1 font-serif italic text-zinc-900 text-base leading-relaxed">
                  "That’s the memo, honestly."
                </blockquote>

                {/* Paragraph 3: Definition of Underground */}
                <p className="leading-relaxed text-justify">
                  The mainstream will keep chasing {underground.philosophy.mainstreamChasing}. But the underground is not an aesthetic. It’s a labor practice. A consent practice. A mutual-aid practice. A memory practice. It’s people choosing lower throughput, higher fidelity, tighter community, louder truth.
                </p>

                {/* Paragraph 4: Internet vs Room */}
                <p className="leading-relaxed text-justify">
                  If you came up on the internet, that’s fine. I did too. I met half my favorite collaborators through a Discord server called <span className="font-mono bg-zinc-100 px-1.5 py-0.2 rounded border border-zinc-200 text-zinc-800">{underground.philosophy.discordServer}</span> that I joined on {underground.philosophy.discordDate}. But the internet is where we find each other. The room is where we become real.
                </p>

                {/* Bold closing memo */}
                <div className="bg-zinc-900 text-zinc-100 p-5 rounded-sm mt-8 font-mono leading-relaxed text-xs relative overflow-hidden">
                  <div className="absolute top-2 right-3 opacity-10 select-none font-mono text-[40px] font-bold">NO-PHONE</div>
                  <h3 className="font-bold uppercase tracking-widest mb-2 border-b border-zinc-750 pb-1 text-amber-400">
                    Memo to the listener
                  </h3>
                  <p className="text-justify">
                    {underground.closingMemo}
                  </p>
                </div>

              </div>

              {/* Footer accent */}
              <div className="mt-16 pt-6 border-t border-zinc-200 text-center font-mono text-[9px] text-zinc-400 select-none">
                Dispatch Compiled by {underground.gearAndDubplates.toteType} · Maxwell S. Hargrave · Leuphana University
              </div>

            </div>

          </div>
        )}

        {activeTab === 'latex' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold font-sans text-zinc-800">LaTeX Source Document (.tex)</h3>
              <button
                onClick={() => handleCopy(underground.rawLaTeX, 'latex')}
                className="px-3 py-1.5 rounded bg-amber-950 text-white text-xs font-medium hover:bg-amber-900 transition-colors flex items-center gap-1"
              >
                {copiedMap['latex'] ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedMap['latex'] ? 'Copied LaTeX!' : 'Copy Source'}
              </button>
            </div>
            <pre className="bg-[#1e1e1e] text-zinc-200 p-5 rounded-lg overflow-x-auto max-h-[600px] leading-relaxed border border-zinc-800 shadow-inner select-all">
              {underground.rawLaTeX}
            </pre>
          </div>
        )}

        {activeTab === 'markdown' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold font-sans text-zinc-800">Markdown Source Document (.md)</h3>
              <button
                onClick={() => handleCopy(underground.rawMarkdown, 'markdown')}
                className="px-3 py-1.5 rounded bg-amber-950 text-white text-xs font-medium hover:bg-amber-900 transition-colors flex items-center gap-1"
              >
                {copiedMap['markdown'] ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedMap['markdown'] ? 'Copied Markdown!' : 'Copy Source'}
              </button>
            </div>
            <pre className="bg-[#1e1e1e] text-zinc-200 p-5 rounded-lg overflow-x-auto max-h-[600px] leading-relaxed border border-zinc-800 shadow-inner select-all whitespace-pre-wrap">
              {underground.rawMarkdown}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
};
