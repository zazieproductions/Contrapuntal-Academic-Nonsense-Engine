import React, { useState } from 'react';
import { GeneratedHorror } from '../utils/horrorGrammar';
import { Copy, Check, FileText, Download, Code, BookOpen } from 'lucide-react';
import { exportHorrorAsPdf } from '../utils/pdfExport';

interface HorrorPaperViewProps {
  horror: GeneratedHorror;
}

export const HorrorPaperView: React.FC<HorrorPaperViewProps> = ({ horror }) => {
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
      await exportHorrorAsPdf(horror);
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
              <p className="font-serif font-bold text-zinc-800 text-base">Typesetting horror manuscript...</p>
              <p className="text-xs text-zinc-500 mt-1 font-serif italic">Laying out scenes, actions, and dialogs…</p>
            </div>
            <div className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">jsPDF · Courier · A4</div>
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
            Academic Preview
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

      {/* Scroll pane */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-5xl mx-auto w-full">
        
        {activeTab === 'preview' && (
          <div className="space-y-6">
            
            {horror.format === 'screenplay' ? (
              // SCREENPLAY FORMATTING (Courier)
              <div className="bg-[#FDFBF7] border border-zinc-300/60 shadow-md rounded-sm px-8 md:px-24 py-12 md:py-16 text-zinc-900 font-mono leading-relaxed text-[13px]">
                <div className="text-center uppercase font-bold tracking-widest mb-16">
                  {horror.title}
                  <div className="text-[11px] font-normal mt-2 lowercase">
                    written by {horror.author}
                  </div>
                </div>

                <div className="space-y-8">
                  {horror.chaptersOrScenes.map((scene, idx) => (
                    <div key={idx} className="space-y-6">
                      <div className="font-bold text-zinc-900">{scene.title}</div>
                      
                      <div className="space-y-4">
                        {scene.elements.map((el, eIdx) => {
                          if (el.type === 'action') {
                            return (
                              <p key={eIdx} className="text-zinc-850 text-justify whitespace-pre-wrap">
                                {el.content}
                              </p>
                            );
                          }
                          if (el.type === 'dialogue') {
                            return (
                              <div key={eIdx} className="flex flex-col items-center py-1">
                                <span className="font-bold block text-zinc-900 text-center mb-1">{el.speaker}</span>
                                <p className="max-w-[360px] text-zinc-800 text-center leading-relaxed whitespace-pre-wrap">
                                  {el.content}
                                </p>
                              </div>
                            );
                          }
                          if (el.type === 'parenthetical') {
                            return (
                              <div key={eIdx} className="text-center italic text-zinc-500 text-[12px] my-0.5">
                                {el.content}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer copyright */}
                <div className="mt-24 pt-6 border-t border-zinc-200 text-center text-[10px] text-zinc-400">
                  Copyright © {horror.year} {horror.author} · Leuphana University
                </div>
              </div>
            ) : (
              // NOVEL MANUSCRIPT FORMATTING (Times New Roman / Serif)
              <div className="bg-[#FDFBF7] border border-zinc-300/60 shadow-md rounded-sm px-8 md:px-16 py-12 md:py-16 text-zinc-900 font-serif leading-relaxed text-[14px]">
                <div className="text-center mb-16">
                  <h1 className="text-3xl font-serif font-bold tracking-tight text-zinc-900 mb-3">
                    {horror.title}
                  </h1>
                  <p className="text-zinc-600 font-sans text-xs tracking-wider uppercase">
                    A Novel Manuscript by {horror.author}
                  </p>
                </div>

                <div className="space-y-10 text-justify">
                  {horror.chaptersOrScenes.map((chapter, idx) => (
                    <div key={idx} className="space-y-4">
                      <h2 className="text-center font-serif font-bold text-lg text-zinc-900 border-b border-zinc-100 pb-2 mb-6">
                        {chapter.title}
                      </h2>
                      {chapter.elements.map((el, eIdx) => (
                        <p key={eIdx} className="text-zinc-800 text-indent">
                          {el.content}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Footer copyright */}
                <div className="mt-16 pt-6 border-t border-zinc-200 text-center text-[10px] font-sans text-zinc-400">
                  Copyright © {horror.year} {horror.author} · Leuphana University
                </div>
              </div>
            )}

          </div>
        )}

        {activeTab === 'latex' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold font-sans text-zinc-800">LaTeX Source Document (.tex)</h3>
              <button
                onClick={() => handleCopy(horror.rawLaTeX, 'latex')}
                className="px-3 py-1.5 rounded bg-red-950 text-white text-xs font-medium hover:bg-red-900 transition-colors flex items-center gap-1"
              >
                {copiedMap['latex'] ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedMap['latex'] ? 'Copied LaTeX!' : 'Copy Source'}
              </button>
            </div>
            <pre className="bg-[#1e1e1e] text-zinc-200 p-5 rounded-lg overflow-x-auto max-h-[600px] leading-relaxed border border-zinc-800 shadow-inner select-all">
              {horror.rawLaTeX}
            </pre>
          </div>
        )}

        {activeTab === 'markdown' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold font-sans text-zinc-800">Markdown Source Document (.md)</h3>
              <button
                onClick={() => handleCopy(horror.rawMarkdown, 'markdown')}
                className="px-3 py-1.5 rounded bg-red-950 text-white text-xs font-medium hover:bg-red-900 transition-colors flex items-center gap-1"
              >
                {copiedMap['markdown'] ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedMap['markdown'] ? 'Copied Markdown!' : 'Copy Source'}
              </button>
            </div>
            <pre className="bg-[#1e1e1e] text-zinc-200 p-5 rounded-lg overflow-x-auto max-h-[600px] leading-relaxed border border-zinc-800 shadow-inner select-all whitespace-pre-wrap">
              {horror.rawMarkdown}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
};
