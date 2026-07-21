import React, { useState } from 'react';
import { GeneratedPaper } from '../utils/grammar';
import { AcademicDiagram } from '../utils/diagrams';
import { Copy, Check, FileText, Download, MessageSquare, Bookmark, Quote, Code } from 'lucide-react';
import { exportPaperAsPdf } from '../utils/pdfExport';

interface PaperViewProps {
  paper: GeneratedPaper;
  seed: string;
}

export const PaperView: React.FC<PaperViewProps> = ({ paper, seed }) => {
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'preview' | 'latex' | 'markdown'>('preview');
  const [showCiteModal, setShowCiteModal] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMap(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedMap(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  // Translate standard LaTeX math structures into beautiful readable Unicode/HTML expressions
  const formatEquation = (latex: string): string => {
    let html = latex;
    const replacements: [RegExp, string][] = [
      [/\\hat\{5\}/g, '5̂'],
      [/\\hat\{4\}/g, '4̂'],
      [/\\hat\{3\}/g, '3̂'],
      [/\\hat\{2\}/g, '2̂'],
      [/\\hat\{1\}/g, '1̂'],
      [/\\hat\{8\}/g, '8̂'],
      [/\\hat\{6\}/g, '6̂'],
      [/\\hat\{7\}/g, '7̂'],
      [/\\quad \\text\{prolonged via \}/g, '  [prolonged via] '],
      [/\\to/g, ' → '],
      [/\\mathcal\{U\}/g, '𝒰'],
      [/\\mathcal\{V\}/g, '𝒱'],
      [/\\mathcal\{M\}/g, '𝒨'],
      [/\\mathcal\{S\}/g, '𝒮'],
      [/\\mathcal\{K\}/g, '𝒦'],
      [/\\mathcal\{H\}/g, 'ℋ'],
      [/\\mathcal\{F\}/g, 'ℱ'],
      [/\\mathcal\{O\}/g, '𝒪'],
      [/\\mathcal\{T\}/g, '𝒯'],
      [/\\mathcal\{A\}/g, '𝒩'],
      [/\\mathcal\{L\}/g, 'ℒ'],
      [/\\mathcal\{R\}/g, 'ℛ'],
      [/\\text\{level\}/g, 'level'],
      [/\\text\{envelope\}/g, 'envelope'],
      [/\\text\{ficta\}/g, 'ficta'],
      [/\\text\{hand\}/g, 'hand'],
      [/\\text\{hexachord\}/g, 'hexachord'],
      [/\\text\{slendro\}/g, 'slendro'],
      [/\\text\{pelog\}/g, 'pelog'],
      [/\\text\{slendro\}/g, 'slendro'],
      [/\\text\{gamelan\}/g, 'gamelan'],
      [/\\text\{sync\}/g, 'sync'],
      [/\\text\{cue\}/g, 'cue'],
      [/\\text\{cut\}/g, 'cut'],
      [/\\text\{visual\}/g, 'visual'],
      [/\\text\{music\}/g, 'music'],
      [/\\text\{leitmotif\}/g, 'leitmotif'],
      [/\\text\{relationship\}/g, 'relationship'],
      [/\\text\{state\}/g, 'state'],
      [/\\text\{transition\}/g, 'transition'],
      [/\\text\{ludo\}/g, 'ludo'],
      [/\\text\{branch\}/g, 'branch'],
      [/\\text\{indigenous\}/g, 'indigenous'],
      [/\\text\{reference\}/g, 'reference'],
      [/\\text\{culture\}/g, 'culture'],
      [/\\text\{field\}/g, 'field'],
      [/\\text\{resonance\}/g, 'resonance'],
      [/\\text\{slendro\}/g, 'slendro'],
      [/\\text\{Slendro\}/g, 'Slendro'],
      [/\\text\{Tempus\}/g, 'Tempus'],
      [/\\text\{Prolatio\}/g, 'Prolatio'],
      [/\\text\{Color\}/g, 'Color'],
      [/\\text\{Talea\}/g, 'Talea'],
      [/\\text\{negative\}/g, 'negative'],
      [/\\text\{axis\}/g, 'axis'],
      [/\\text\{maj\}/g, 'maj'],
      [/\\text\{min\}/g, 'min'],
      [/\\text\{Tonnetz\}/g, 'Tonnetz'],
      [/\\text\{Dist\}/g, 'Dist'],
      [/\\text\{Forte\}/g, 'Forte'],
      [/\\text\{Aut\}/g, 'Aut'],
      [/\\text\{Zug\}/g, 'Zug'],
      [/\\text\{Stufe\}/g, 'Stufe'],
      [/\\text\{Ursatz\}/g, 'Ursatz'],
      [/\\text\{level\}/g, 'level'],
      [/\\text\{envelope\}/g, 'envelope'],
      [/\\text\{roughness\}/g, 'roughness'],
      [/\\text\{partials\}/g, 'partials'],
      [/\\text\{partial\}/g, 'partial'],
      [/\\text\{Noise\}/g, 'Noise'],
      [/\\text\{slendro\}/g, 'slendro'],
      [/\\text\{Slendro\}/g, 'Slendro'],
      [/\\text\{Hollywood\}/g, 'Hollywood'],
      [/\\text\{Drama\}/g, 'Drama'],
      [/\\text\{Tritone\}/g, 'Tritone'],
      [/\\sum\_\{i=1\}\^\{n\}/g, '∑_{i=1}ⁿ'],
      [/\\sum\_\{k=1\}\^\{K\}/g, '∑_{k=1}ᴷ'],
      [/\\sum/g, '∑'],
      [/\\frac\{\\partial\\s+(\\w+)\}\{\\partial\\s+(\\w+)\}/g, '𝜕$1/𝜕$2'],
      [/\\frac\{\\partial\s*(\\w+)_i\}\{\\partial\s*(\\w+)_i\}/g, '𝜕$1_i/𝜕$2_i'],
      [/\\frac\{\\partial\s*\\text\{Zug\}_i\}\{\\partial\s*\\text\{Stufe\}_i\}/g, '𝜕Zug_i/𝜕Stufe_i'],
      [/\\frac\{\\partial\s*\\text\{Drama\}\}\{\\partial\s*\\text\{Tritone\}\}/g, '𝜕Drama/𝜕Tritone'],
      [/\\frac\{\\text\{Tempus\}\}\{\\text\{Prolatio\}\}/g, 'Tempus / Prolatio'],
      [/\\frac\{\\text\{Partial\}_k\}\{\\text\{Noise\}\}/g, 'Partial_k / Noise'],
      [/\\frac\{\\partial\s*\\text\{Drama\}\}\{\\partial\s*\\text\{Tritone\}\}/g, '𝜕Drama/𝜕Tritone'],
      [/\\cdot/g, ' • '],
      [/\\mathbf\{([A-Z])\}/g, '𝐌_$1'],
      [/\\mathbf\{K\}/g, '𝐊'],
      [/\\mathbf\{S\}/g, '𝐒'],
      [/\\mathbf\{H\}/g, '𝐇'],
      [/\\mathbf\{P\}/g, '𝐏'],
      [/\\mathbf\{V\}/g, '𝐕'],
      [/\\mathbf\{E\}/g, '𝐄'],
      [/\\mathbf\{C\}/g, '𝐂'],
      [/\\mathbf\{G\}/g, '𝐆'],
      [/\\mathbf\{A\}/g, '𝐀'],
      [/\\mathbf\{\\Phi\}/g, '𝚽'],
      [/\\mathbb\{R\}\^2/g, 'ℝ²'],
      [/\\mathbb\{Z\}\_\{12\}/g, 'ℤ₁₂'],
      [/\\mathbb\{Z\}\_\{120\}/g, 'ℤ₁₂₀'],
      [/\\mathbb\{Z\}\_N/g, 'ℤ_N'],
      [/\\mathbb\{Z\}/g, 'ℤ'],
      [/\\iint\_\{field\}/g, '∬_field'],
      [/\\int\_\{-\\infty\}\^\{\\infty\}/g, '∫₋∞⁺∞'],
      [/\\int\_\{t\_\{cue\}\}\^\{t\_\{cut\}\}/g, '∫_{t_cue}^{t_cut}'],
      [/\\int/g, '∫'],
      [/\\Lambda\_\{prolongation\}/g, '𝚲_prolongation'],
      [/\\Lambda\_\{Forte\}/g, '𝚲_Forte'],
      [/\\Lambda\_\{culture\}/g, '𝚲_culture'],
      [/\\Gamma\_\{Ursatz\}/g, '𝚪_Ursatz'],
      [/\\Phi\_\{axis\}/g, '𝚽_axis'],
      [/\\Phi\_\{ludo\}/g, '𝚽_ludo'],
      [/\\Psi\_\{roughness\}/g, '𝚽_roughness'],
      [/\\Psi\_\{resonance\}/g, '𝚿_resonance'],
      [/\\Delta\_\{ficta\}/g, '𝚫_ficta'],
      [/\\Delta\_\{ilm\}/g, '𝚫_film'],
      [/\\nabla\_\{chaos\}/g, '∇_chaos'],
      [/\\alpha/g, 'α'],
      [/\\beta/g, 'β'],
      [/\\theta/g, 'θ'],
      [/\\phi/g, 'φ'],
      [/\\omega/g, 'ω'],
      [/\\tau/g, 'τ'],
      [/\\gamma\_\{diegesis\}/g, 'γ_diegesis'],
      [/\\oplus/g, ' ⊕ '],
      [/\\otimes/g, ' ⊗ '],
      [/\\cong/g, ' ≅ '],
      [/\\equiv/g, ' ≡ '],
      [/\\pmod\{12\}/g, ' (mod 12)'],
      [/\\pmod\{(\w+)\}/g, ' (mod $1)'],
      [/\\pmod\{\\mathbb\{Z\}\_N\}/g, ' (mod ℤ_N)'],
      [/\\pmod\{\\Lambda\_\{culture\}\}/g, ' (mod 𝚲_culture)'],
      [/\\left\\langle\s*/g, '⟨'],
      [/\s*\\right\\rangle/g, '⟩'],
      [/\\|/g, '‖'],
      [/\\_/g, '_'],
      [/\\quad/g, '   '],
      [/\\sqrt\{(.+?)\}/g, '√($1)'],
      [/\\binom\{(.+?)\}\{(.+?)\}/g, '($1 over $2)']
    ];

    replacements.forEach(([regex, replacement]) => {
      html = html.replace(regex, replacement);
    });

    // Clean up remaining backslashes
    html = html.replace(/\\/g, '');
    return html;
  };

  // Citation formats
  const authorLastName = paper.authors[0].name.split(' ').pop() || 'Author';
  const citationKey = `${authorLastName.toLowerCase()}${paper.year}theory`;

  const citations = {
    apa: `${paper.authors.map(a => {
      const names = a.name.split(' ');
      const last = names.pop();
      const initials = names.map(n => n[0] + '.').join(' ');
      return `${last}, ${initials}`;
    }).join(', & ')} (${paper.year}). ${paper.title}. *${paper.journal}*, ${paper.volume}(${paper.issue}), 201-218. DOI: ${paper.doi}`,

    mla: `${paper.authors.map(a => {
      const names = a.name.split(' ');
      const last = names.pop();
      const firsts = names.join(' ');
      return `${last}, ${firsts}`;
    }).join(', and ')}. "${paper.title}." *${paper.journal}*, vol. ${paper.volume}, no. ${paper.issue}, ${paper.year}, pp. 201-218. DOI: ${paper.doi}.`,

    chicago: `${paper.authors.map(a => a.name).join(', ')}. "${paper.title}." *${paper.journal}* ${paper.volume}, no. ${paper.issue} (${paper.year}): 201-218. DOI: ${paper.doi}.`,

    bibtex: `@article{${citationKey},
  author = {${paper.authors.map(a => a.name).join(' and ')}},
  title = {${paper.title}},
  journal = {${paper.journal}},
  volume = {${paper.volume}},
  number = {${paper.issue}},
  pages = {201--218},
  year = {${paper.year}},
  doi = {${paper.doi}}
}`
  };

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    try {
      await exportPaperAsPdf(paper);
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
              <p className="font-serif font-bold text-zinc-800 text-base">Typesetting PDF</p>
              <p className="text-xs text-zinc-500 mt-1 font-serif italic">Laying out pages, equations, and bibliography…</p>
            </div>
            <div className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase">jsPDF · Times New Roman · A4</div>
          </div>
        </div>
      )}

      {/* Paper Preview Header Bar */}
      <div className="h-14 bg-[#EFECE6] border-b border-zinc-300/80 px-6 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${activeTab === 'preview' ? 'bg-amber-950 text-[#FDFBF7] shadow-sm' : 'text-zinc-700 hover:bg-zinc-200'}`}
          >
            <FileText className="w-3.5 h-3.5" />
            Academic Preview
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
            onClick={() => setShowCiteModal(true)}
            className="px-3 py-1.5 rounded bg-[#FDFBF7] border border-zinc-300 text-zinc-800 text-xs font-medium hover:bg-zinc-50 transition-all flex items-center gap-1 shadow-sm"
            title="Cite Paper"
          >
            <Quote className="w-3.5 h-3.5 text-amber-900" />
            <span>Cite</span>
          </button>
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
            
            {/* Journal-style Academic Sheet Wrapper */}
            <div className="bg-[#FDFBF7] border border-zinc-300/60 shadow-md rounded-sm px-8 md:px-16 py-12 md:py-16 text-zinc-900 font-serif leading-relaxed print:border-0 print:shadow-none print:p-0" data-pdf-paper>
              
              {/* Header Info */}
              <div className="border-b border-zinc-800 pb-4 mb-8 text-[11px] font-sans tracking-wide text-zinc-600 flex flex-col md:flex-row justify-between gap-2">
                <div className="italic font-medium text-amber-950">
                  {paper.journal}, Vol. {paper.volume}, No. {paper.issue}, {paper.year}
                </div>
                <div>
                  <span className="font-bold">DOI: </span>
                  <span className="font-mono text-zinc-500">{paper.doi}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-center tracking-tight leading-tight text-zinc-900 mb-6 font-serif pt-4">
                {paper.title}
              </h1>

              {/* Authors & Footnotes */}
              <div className="flex flex-col items-center justify-center gap-2 mb-10">
                <div className="flex flex-wrap justify-center gap-6 text-center font-sans font-medium text-sm text-zinc-800">
                  {paper.authors.map((author, idx) => (
                    <div key={idx}>
                      <span>{author.name}</span>
                      <sup className="text-[9px] text-amber-900 font-bold ml-0.5">{idx + 1}</sup>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex flex-col items-center gap-1 text-[10.5px] font-sans text-zinc-500 italic text-center">
                  {paper.authors.map((author, idx) => (
                    <div key={idx}>
                      <sup>{idx + 1}</sup> {author.institution}
                    </div>
                  ))}
                </div>
              </div>

              {/* Abstract Frame */}
              <div className="my-10 px-4 md:px-8">
                <div className="border-t border-b border-zinc-300 py-6 text-justify">
                  <div className="text-center font-sans font-bold text-xs uppercase tracking-widest mb-2.5 text-zinc-800">
                    Abstract
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-700 text-indent">
                    {paper.abstract}
                  </p>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-8 text-justify text-[14px] leading-[1.7] font-serif">
                {paper.sections.map((sec, sIdx) => (
                  <div key={sIdx} className="space-y-4">
                    <h2 className="text-lg font-bold text-zinc-900 font-sans pt-2 border-b border-zinc-100 pb-1">
                      {sec.title}
                    </h2>
                    {sec.paragraphs.map((para, pIdx) => (
                      <p key={pIdx} className="text-zinc-800 text-indent">
                        {para}
                      </p>
                    ))}

                    {/* Diagram insertion */}
                    {sec.diagramType && (
                      <AcademicDiagram type={sec.diagramType} seed={seed} />
                    )}

                    {/* Equation rendering */}
                    {sec.equation && (
                      <div className="my-6 py-4 px-6 bg-zinc-50/50 border-y border-zinc-100 flex items-center justify-between gap-4 font-serif italic select-all hover:bg-zinc-50 transition-colors rounded-sm">
                        <div className="flex-1 text-center text-sm md:text-base tracking-wider text-zinc-950 py-1 font-serif font-semibold overflow-x-auto">
                          {formatEquation(sec.equation)}
                        </div>
                        <div className="text-xs md:text-sm font-sans font-bold text-zinc-500 select-none pr-2">
                          {sec.equationLabel}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bibliography */}
              <div className="mt-12 pt-8 border-t border-zinc-300">
                <h3 className="text-sm font-bold font-sans uppercase tracking-widest mb-4 text-zinc-800">
                  References
                </h3>
                <ul className="space-y-2.5 text-xs leading-relaxed text-zinc-700 font-serif pl-6 -indent-6">
                  {paper.bibliography.map((bib, bIdx) => (
                    <li key={bIdx} className="hover:text-zinc-950 transition-colors">
                      <span dangerouslySetInnerHTML={{
                        __html: bib.formatted
                          .replace(/\*(.*?)\*/g, '<em class="font-semibold text-amber-950">$1</em>')
                      }} />
                      <span className="inline-block ml-2 text-[9px] font-sans text-zinc-400 bg-zinc-100 px-1 py-0.2 rounded hover:bg-amber-100 hover:text-amber-900 transition-colors cursor-pointer font-mono print:hidden"
                            onClick={() => handleCopy(bib.bibtex, `bib-${bIdx}`)}>
                        {copiedMap[`bib-${bIdx}`] ? 'Copied BibTeX!' : 'BibTeX'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Academic page footer */}
              <div className="mt-16 pt-6 border-t border-zinc-200 flex flex-col items-center justify-center gap-2 text-center text-[10px] font-sans text-zinc-400 select-none">
                <div className="italic">{paper.journal} • Vol. {paper.volume}, No. {paper.issue}, {paper.year} • pp. 201–218</div>
                <div className="tracking-widest">— — —</div>
              </div>
            </div>

            {/* Peer Review Archive Toggle */}
            <div className="bg-[#F5F2EB] border border-zinc-300/80 rounded shadow-sm overflow-hidden font-sans">
              <button
                onClick={() => setShowReviews(!showReviews)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-100/80 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-zinc-700" />
                  <span className="font-serif font-semibold text-sm text-zinc-800">
                    Peer Review Correspondence ({paper.peerReviews.length} Reports)
                  </span>
                </div>
                <span className="text-xs font-medium text-zinc-600 hover:text-zinc-800">
                  {showReviews ? 'Collapse' : 'Expand'}
                </span>
              </button>

              {showReviews && (
                <div className="border-t border-zinc-200 px-6 py-4 space-y-4 bg-[#FAF8F4]">
                  <div className="p-3.5 bg-zinc-50/60 border border-zinc-200/80 rounded text-xs text-zinc-600">
                    <strong className="text-zinc-800">Editorial Correspondence:</strong> The following reports are reproduced verbatim from the blind peer-review process. Author identities and reviewer affiliations have been anonymized in accordance with standard journal practice.
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {paper.peerReviews.map((rev, idx) => {
                      const v = rev.verdict.toLowerCase();
                      const isAccept = v.includes('accept') && !v.includes('minor');
                      const isMinor = v.includes('minor');
                      const isMajor = v.includes('major');
                      const isReject = v.includes('reject');
                      const badgeClass = isAccept ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 
                                          isMinor ? 'bg-amber-50 text-amber-800 border-amber-200' :
                                          isMajor ? 'bg-orange-50 text-orange-800 border-orange-200' :
                                          isReject ? 'bg-red-50 text-red-800 border-red-200' :
                                          'bg-zinc-50 text-zinc-800 border-zinc-200';
                      return (
                        <div key={idx} className="bg-[#FDFBF7] border border-zinc-200 rounded p-4 shadow-xs">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 mb-3 border-b border-zinc-100">
                            <span className="font-bold text-xs text-zinc-800">{rev.reviewer}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${badgeClass}`}>
                              Recommendation: {rev.verdict}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-700 leading-relaxed font-serif whitespace-pre-line text-justify bg-zinc-50/40 p-3 border border-zinc-100 rounded">
                            {rev.comments}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {activeTab === 'latex' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold font-sans text-zinc-800">LaTeX Article Document (.tex)</h3>
              <button
                onClick={() => handleCopy(paper.rawLaTeX, 'latex')}
                className="px-3 py-1.5 rounded bg-amber-950 text-white text-xs font-medium hover:bg-amber-900 transition-colors flex items-center gap-1"
              >
                {copiedMap['latex'] ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedMap['latex'] ? 'Copied LaTeX!' : 'Copy Source'}
              </button>
            </div>
            <pre className="bg-[#1e1e1e] text-zinc-200 p-5 rounded-lg overflow-x-auto max-h-[600px] leading-relaxed border border-zinc-800 shadow-inner select-all">
              {paper.rawLaTeX}
            </pre>
          </div>
        )}

        {activeTab === 'markdown' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold font-sans text-zinc-800">Markdown Paper Source (.md)</h3>
              <button
                onClick={() => handleCopy(paper.rawMarkdown, 'markdown')}
                className="px-3 py-1.5 rounded bg-amber-950 text-white text-xs font-medium hover:bg-amber-900 transition-colors flex items-center gap-1"
              >
                {copiedMap['markdown'] ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedMap['markdown'] ? 'Copied Markdown!' : 'Copy Source'}
              </button>
            </div>
            <pre className="bg-[#1e1e1e] text-zinc-200 p-5 rounded-lg overflow-x-auto max-h-[600px] leading-relaxed border border-zinc-800 shadow-inner select-all whitespace-pre-wrap">
              {paper.rawMarkdown}
            </pre>
          </div>
        )}

      </div>

      {/* Citation Modal */}
      {showCiteModal && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 select-none">
          <div className="bg-[#FDFBF7] max-w-2xl w-full rounded-lg shadow-2xl border border-zinc-200 overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#EFECE6] px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-950" />
                <h3 className="font-serif font-bold text-base text-zinc-900">Academic Citation Formatter</h3>
              </div>
              <button
                onClick={() => setShowCiteModal(false)}
                className="text-zinc-400 hover:text-zinc-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-5">
              <p className="text-xs text-zinc-600">
                Copy this paper's academic coordinates in standard bibliographical formats to cite in your musicology publications:
              </p>

              {/* APA Format */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">APA Style</span>
                  <button
                    onClick={() => handleCopy(citations.apa, 'apa')}
                    className="text-[11px] font-bold text-amber-900 hover:underline flex items-center gap-1"
                  >
                    {copiedMap['apa'] ? 'Copied!' : 'Copy APA'}
                  </button>
                </div>
                <div className="bg-zinc-50 p-3 rounded border border-zinc-200 text-xs text-zinc-800 italic font-serif select-all">
                  {citations.apa}
                </div>
              </div>

              {/* MLA Format */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">MLA Style</span>
                  <button
                    onClick={() => handleCopy(citations.mla, 'mla')}
                    className="text-[11px] font-bold text-amber-900 hover:underline flex items-center gap-1"
                  >
                    {copiedMap['mla'] ? 'Copied!' : 'Copy MLA'}
                  </button>
                </div>
                <div className="bg-zinc-50 p-3 rounded border border-zinc-200 text-xs text-zinc-800 font-serif select-all">
                  {citations.mla}
                </div>
              </div>

              {/* Chicago Format */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Chicago Manual of Style</span>
                  <button
                    onClick={() => handleCopy(citations.chicago, 'chicago')}
                    className="text-[11px] font-bold text-amber-900 hover:underline flex items-center gap-1"
                  >
                    {copiedMap['chicago'] ? 'Copied!' : 'Copy Chicago'}
                  </button>
                </div>
                <div className="bg-zinc-50 p-3 rounded border border-zinc-200 text-xs text-zinc-800 font-serif select-all">
                  {citations.chicago}
                </div>
              </div>

              {/* BibTeX */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">BibTeX Entry</span>
                  <button
                    onClick={() => handleCopy(citations.bibtex, 'bibtex-modal')}
                    className="text-[11px] font-bold text-amber-900 hover:underline flex items-center gap-1"
                  >
                    {copiedMap['bibtex-modal'] ? 'Copied!' : 'Copy BibTeX'}
                  </button>
                </div>
                <pre className="bg-[#1e1e1e] text-zinc-200 p-3 rounded text-[10.5px] font-mono overflow-x-auto select-all leading-relaxed">
                  {citations.bibtex}
                </pre>
              </div>
            </div>

            <div className="bg-[#EFECE6] px-6 py-3 flex justify-end">
              <button
                onClick={() => setShowCiteModal(false)}
                className="px-4 py-2 rounded bg-amber-950 hover:bg-amber-900 text-white text-xs font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
