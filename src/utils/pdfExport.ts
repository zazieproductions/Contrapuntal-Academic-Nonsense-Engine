import { jsPDF } from 'jspdf';
import { GeneratedPaper } from './grammar';

// ─── Page geometry (all in mm, A4) ───────────────────────────────────────────
const PAGE_W   = 210;
const PAGE_H   = 297;
const M_TOP    = 24;   // top margin
const M_BOT    = 24;   // bottom margin (leaves room for footer)
const M_LEFT   = 22;
const M_RIGHT  = 22;
const COL_W    = PAGE_W - M_LEFT - M_RIGHT;   // 166 mm usable width
const LINE_GAP = 1.4;  // leading multiplier

// ─── Colour palette ───────────────────────────────────────────────────────────
const C_DARK    : [number,number,number] = [40,  30,  24 ];   // near-black header/title
const C_BODY    : [number,number,number] = [35,  28,  22 ];   // body text
const C_GREY    : [number,number,number] = [100, 95,  90 ];   // captions, footnotes
const C_RULE    : [number,number,number] = [60,  45,  35 ];   // thin rule lines
const C_EQ_BG   : [number,number,number] = [248, 246, 240];   // equation block bg
const C_EQ_RULE : [number,number,number] = [160, 130, 100];   // equation side bar

// ─── Font size catalogue ─────────────────────────────────────────────────────
const FS = {
  journal   : 7.5,
  doi       : 7,
  title     : 18,
  authors   : 10,
  inst      : 8.5,
  abstract  : 8.5,
  section   : 11,
  body      : 10,
  equation  : 9.5,
  figcap    : 8,
  bib       : 8.5,
  runHead   : 7,
  footer    : 7.5,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Strip LaTeX commands down to readable ASCII/Unicode for PDF embedding */
function stripLatex(s: string): string {
  return s
    .replace(/\\hat\{(\d)\}/g,  (_,n)=>n+'̂')
    .replace(/\\mathcal\{([A-Z])\}/g, '$1')
    .replace(/\\mathbf\{([A-Z])\}/g, '$1')
    .replace(/\\mathbb\{([A-Z])\}/g, '$1')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\sum/g,'∑').replace(/\\int/g,'∫').replace(/\\infty/g,'∞')
    .replace(/\\partial/g,'∂').replace(/\\nabla/g,'∇')
    .replace(/\\alpha/g,'α').replace(/\\beta/g,'β').replace(/\\gamma/g,'γ')
    .replace(/\\delta/g,'δ').replace(/\\theta/g,'θ').replace(/\\lambda/g,'λ')
    .replace(/\\mu/g,'μ').replace(/\\phi/g,'φ').replace(/\\psi/g,'ψ')
    .replace(/\\omega/g,'ω').replace(/\\sigma/g,'σ').replace(/\\pi/g,'π')
    .replace(/\\Lambda/g,'Λ').replace(/\\Gamma/g,'Γ').replace(/\\Phi/g,'Φ')
    .replace(/\\Psi/g,'Ψ').replace(/\\Delta/g,'Δ').replace(/\\Omega/g,'Ω')
    .replace(/\\cdot/g,' · ').replace(/\\times/g,'×').replace(/\\oplus/g,'⊕')
    .replace(/\\otimes/g,'⊗').replace(/\\cong/g,'≅').replace(/\\equiv/g,'≡')
    .replace(/\\leq/g,'≤').replace(/\\geq/g,'≥').replace(/\\neq/g,'≠')
    .replace(/\\left[\(\[\{]/g,'(').replace(/\\right[\)\]\}]/g,')')
    .replace(/\\left\\langle/g,'⟨').replace(/\\right\\rangle/g,'⟩')
    .replace(/\\langle/g,'⟨').replace(/\\rangle/g,'⟩')
    .replace(/\\pmod\{([^}]+)\}/g,' (mod $1)')
    .replace(/\\binom\{([^}]+)\}\{([^}]+)\}/g, 'C($1,$2)')
    .replace(/\\begin\{[^}]+\}/g,'').replace(/\\end\{[^}]+\}/g,'')
    .replace(/\\\\/g,' ').replace(/\\_/g,'_').replace(/\\quad/g,'  ')
    .replace(/\^(\w)/g,'$1').replace(/\{([^}]*)\}/g,'$1')
    .replace(/\\\s*/g,'').replace(/\s{2,}/g,' ').trim();
}

/** Convert italic markdown *text* markers */
function stripMarkdownItalic(s: string): string {
  return s.replace(/\*(.*?)\*/g, '$1');
}

// ─── Cursor / page state ─────────────────────────────────────────────────────
interface Cursor {
  doc: jsPDF;
  y: number;
  page: number;
  totalPagesPlaceholder: string;
  runningHead: string;
  year: number;
  journal: string;
  startPage: number;
}

function newPage(cur: Cursor): void {
  cur.doc.addPage();
  cur.page++;
  cur.y = M_TOP + 8; // leave room for running head we'll draw on top
  drawPageFurniture(cur);
}

function drawPageFurniture(cur: Cursor): void {
  const doc = cur.doc;
  const pg  = cur.page;

  // ── Running head ──────────────────────────────────────────────────────
  doc.setFont('helvetica','normal');
  doc.setFontSize(FS.runHead);
  doc.setTextColor(...C_GREY);

  const leftHead  = pg % 2 === 0
    ? `${cur.journal} (${cur.year})`
    : cur.runningHead.substring(0, 55) + (cur.runningHead.length > 55 ? '...' : '');
  const rightHead = `${pg}`;

  doc.text(leftHead,  M_LEFT, M_TOP - 4);
  doc.text(rightHead, PAGE_W - M_RIGHT, M_TOP - 4, { align: 'right' });

  // thin rule beneath running head
  doc.setDrawColor(...C_RULE);
  doc.setLineWidth(0.2);
  doc.line(M_LEFT, M_TOP - 2, PAGE_W - M_RIGHT, M_TOP - 2);

  // ── Footer ────────────────────────────────────────────────────────────
  doc.setDrawColor(...C_RULE);
  doc.line(M_LEFT, PAGE_H - M_BOT + 4, PAGE_W - M_RIGHT, PAGE_H - M_BOT + 4);
  doc.setFont('helvetica','italic');
  doc.setFontSize(FS.footer);
  doc.setTextColor(...C_GREY);
  doc.text(`${cur.journal}`, M_LEFT, PAGE_H - M_BOT + 8);
  doc.text(`${pg}`, PAGE_W - M_RIGHT, PAGE_H - M_BOT + 8, { align: 'right' });
}

/** 
 * Write a block of text, auto-paging.
 * Returns new y position after the text block.
 */
function writeText(
  cur: Cursor,
  text: string,
  x: number,
  fontSize: number,
  fontStyle: 'normal' | 'bold' | 'italic' | 'bolditalic',
  color: [number,number,number],
  options: {
    maxWidth?: number;
    align?: 'left' | 'center' | 'right' | 'justify';
    indent?: number;
    lineHeightFactor?: number;
    afterParagraph?: number;    // extra gap after the block
  } = {}
): void {
  const doc          = cur.doc;
  const maxW         = options.maxWidth ?? COL_W;
  const lhf          = options.lineHeightFactor ?? LINE_GAP;
  const after        = options.afterParagraph ?? 0;
  const lineH        = (fontSize / 2.835) * lhf;  // pt → mm conversion × leading

  doc.setFont('times', fontStyle);
  doc.setFontSize(fontSize);
  doc.setTextColor(...color);

  const lines: string[] = doc.splitTextToSize(text, maxW - (options.indent ?? 0));
  const bottomLimit = PAGE_H - M_BOT;

  lines.forEach((line, i) => {
    if (cur.y + lineH > bottomLimit) {
      newPage(cur);
    }
    const drawX = x + (i === 0 && options.indent ? options.indent : 0);
    doc.text(line, drawX, cur.y, {
      align: options.align ?? 'left',
      maxWidth: maxW - (options.indent ?? 0),
    });
    cur.y += lineH;
  });

  cur.y += after;
}

/** Ensure there is at least `needed` mm left; else page-break */
function ensureSpace(cur: Cursor, needed: number): void {
  if (cur.y + needed > PAGE_H - M_BOT) {
    newPage(cur);
  }
}

/** Draw a thin horizontal rule */
function drawRule(cur: Cursor, width = COL_W, weight = 0.3): void {
  cur.doc.setDrawColor(...C_RULE);
  cur.doc.setLineWidth(weight);
  cur.doc.line(M_LEFT, cur.y, M_LEFT + width, cur.y);
  cur.y += 2;
}

/** Render an equation block with side-bar and background tint */
function writeEquation(cur: Cursor, latex: string, label: string): void {
  const readable = stripLatex(latex);
  const lines    = cur.doc.splitTextToSize(readable, COL_W - 20);
  const blockH   = lines.length * 5 + 8;

  ensureSpace(cur, blockH + 6);

  // Background
  cur.doc.setFillColor(...C_EQ_BG);
  cur.doc.rect(M_LEFT, cur.y, COL_W, blockH, 'F');

  // Left accent bar
  cur.doc.setFillColor(...C_EQ_RULE);
  cur.doc.rect(M_LEFT, cur.y, 1.2, blockH, 'F');

  // Equation text
  cur.doc.setFont('courier','normal');
  cur.doc.setFontSize(FS.equation);
  cur.doc.setTextColor(...C_BODY);

  const eqY = cur.y + 5;
  lines.forEach((line: string, i: number) => {
    cur.doc.text(line, M_LEFT + 6, eqY + i * 5);
  });

  // Label (right-aligned)
  cur.doc.setFont('times','italic');
  cur.doc.setFontSize(FS.equation);
  cur.doc.setTextColor(...C_GREY);
  cur.doc.text(label, M_LEFT + COL_W - 2, eqY + ((lines.length - 1) * 5) / 2, {
    align: 'right',
  });

  cur.y += blockH + 6;
}

/** Draw the schematic analytical figure for a section */
function writeFigureCaption(cur: Cursor, captionText: string): void {
  ensureSpace(cur, 8);
  cur.doc.setDrawColor(...C_RULE);
  cur.doc.setLineWidth(0.15);
  cur.doc.rect(M_LEFT, cur.y, COL_W, 28, 'S');

  // placeholder hatching to suggest a diagram
  cur.doc.setDrawColor(210, 200, 190);
  cur.doc.setLineWidth(0.12);
  for (let xi = 0; xi < COL_W; xi += 8) {
    cur.doc.line(M_LEFT + xi, cur.y, M_LEFT + xi, cur.y + 28);
  }
  cur.doc.setDrawColor(220, 210, 200);
  for (let yi = 0; yi < 28; yi += 8) {
    cur.doc.line(M_LEFT, cur.y + yi, M_LEFT + COL_W, cur.y + yi);
  }

  // label inside box
  cur.doc.setFont('times', 'italic');
  cur.doc.setFontSize(8);
  cur.doc.setTextColor(...C_GREY);
  cur.doc.text('[Analytical Figure]', M_LEFT + COL_W / 2, cur.y + 15, { align: 'center' });

  cur.y += 32;

  // caption
  writeText(cur, captionText, M_LEFT, FS.figcap, 'italic', C_GREY, {
    afterParagraph: 5,
    align: 'left',
  });
}

// ─── Main export function ────────────────────────────────────────────────────

export async function exportPaperAsPdf(paper: GeneratedPaper): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  // page-1 furniture (no running head on first page)
  const cur: Cursor = {
    doc,
    y: M_TOP,
    page: 1,
    totalPagesPlaceholder: '{TOTAL}',
    runningHead: paper.authors.map(a => a.name.split(' ').pop()).join(' & ') || '',
    year: paper.year,
    journal: paper.journal,
    startPage: 201, // simulated start page
  };

  // ── Page 1: masthead rule ─────────────────────────────────────────────
  doc.setDrawColor(...C_RULE);
  doc.setLineWidth(0.8);
  doc.line(M_LEFT, M_TOP, PAGE_W - M_RIGHT, M_TOP);
  cur.y += 4;

  // Journal / volume line
  doc.setFont('times','italic');
  doc.setFontSize(FS.journal);
  doc.setTextColor(...C_GREY);
  const journalLine = `${paper.journal}, Vol. ${paper.volume}, No. ${paper.issue} (${paper.year}), pp. ${cur.startPage}–${cur.startPage + paper.sections.length * 3 + 6}`;
  doc.text(journalLine, M_LEFT, cur.y);
  const doiText = `DOI: ${paper.doi}`;
  doc.text(doiText, PAGE_W - M_RIGHT, cur.y, { align: 'right' });
  cur.y += 6;

  // thin rule below masthead
  doc.setLineWidth(0.2);
  doc.setDrawColor(...C_RULE);
  doc.line(M_LEFT, cur.y, PAGE_W - M_RIGHT, cur.y);
  cur.y += 8;

  // ── Title ─────────────────────────────────────────────────────────────
  doc.setFont('times','bold');
  doc.setFontSize(FS.title);
  doc.setTextColor(...C_DARK);
  const titleLines: string[] = doc.splitTextToSize(paper.title, COL_W);
  titleLines.forEach((line: string) => {
    doc.text(line, M_LEFT + COL_W / 2, cur.y, { align: 'center' });
    cur.y += (FS.title / 2.835) * 1.25;
  });
  cur.y += 4;

  // ── Authors ───────────────────────────────────────────────────────────
  doc.setFont('times','bold');
  doc.setFontSize(FS.authors);
  doc.setTextColor(...C_DARK);
  const authorLine = paper.authors.map((a, i) => `${a.name}${paper.authors.length > 1 ? String.fromCharCode(185 + i) : ''}`).join('  ·  ');
  doc.text(authorLine, M_LEFT + COL_W / 2, cur.y, { align: 'center' });
  cur.y += 5;

  // Institutions
  paper.authors.forEach((a, i) => {
    doc.setFont('times','italic');
    doc.setFontSize(FS.inst);
    doc.setTextColor(...C_GREY);
    const supStr = paper.authors.length > 1 ? String.fromCharCode(185 + i) + ' ' : '';
    doc.text(supStr + a.institution, M_LEFT + COL_W / 2, cur.y, { align: 'center' });
    cur.y += 4;
  });
  cur.y += 3;

  // ── Thin rule + Abstract ──────────────────────────────────────────────
  drawRule(cur, COL_W, 0.3);
  cur.y += 2;

  doc.setFont('times','bold');
  doc.setFontSize(FS.abstract - 0.5);
  doc.setTextColor(...C_DARK);
  doc.text('Abstract', M_LEFT + COL_W / 2, cur.y, { align: 'center' });
  cur.y += 5;

  writeText(cur, paper.abstract, M_LEFT, FS.abstract, 'italic', C_BODY, {
    afterParagraph: 4,
    align: 'justify',
    lineHeightFactor: 1.45,
  });

  drawRule(cur, COL_W, 0.3);
  cur.y += 6;

  // ── Running head starts from page 2 ──────────────────────────────────
  // (page 1 gets the footer only)
  doc.setFont('times','italic');
  doc.setFontSize(FS.footer);
  doc.setTextColor(...C_GREY);
  doc.setDrawColor(...C_RULE);
  doc.setLineWidth(0.2);
  doc.line(M_LEFT, PAGE_H - M_BOT + 4, PAGE_W - M_RIGHT, PAGE_H - M_BOT + 4);
  doc.text(`${paper.journal}`, M_LEFT, PAGE_H - M_BOT + 8);
  doc.text(`${cur.startPage}`, PAGE_W - M_RIGHT, PAGE_H - M_BOT + 8, { align: 'right' });

  // ─────────────────────────────────────────────────────────────────────
  // ── Sections ─────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────
  paper.sections.forEach((sec, si) => {
    // Ensure section heading has enough room (don't orphan a heading at page bottom)
    ensureSpace(cur, 22);

    // Section heading
    doc.setFont('times','bold');
    doc.setFontSize(FS.section);
    doc.setTextColor(...C_DARK);
    const headLines: string[] = doc.splitTextToSize(sec.title, COL_W);
    headLines.forEach((hl: string) => {
      doc.text(hl, M_LEFT, cur.y);
      cur.y += (FS.section / 2.835) * 1.3;
    });
    cur.y += 2;

    // Body paragraphs
    sec.paragraphs.forEach((para, pi) => {
      const isFirst = pi === 0;
      writeText(cur, para, M_LEFT, FS.body, 'normal', C_BODY, {
        align: 'justify',
        lineHeightFactor: 1.5,
        indent: isFirst ? 0 : 5,   // indent continuation paragraphs
        afterParagraph: 3,
      });
    });

    // Optional equation
    if (sec.equation) {
      cur.y += 2;
      writeEquation(cur, sec.equation, sec.equationLabel ?? `(${si + 1})`);
    }

    // Optional diagram placeholder
    if (sec.diagramType) {
      cur.y += 2;
      const figNum = si + 1;
      writeFigureCaption(
        cur,
        `Figure ${figNum}. Analytical diagram — ${sec.diagramType.charAt(0).toUpperCase() + sec.diagramType.slice(1)} representation of structural parameters discussed in Section ${si + 1}. Axes correspond to the primary variables defined in the mathematical framework. Node labels indicate pitch-class or structural identity; edge weights represent voice-leading distance.`
      );
    }

    cur.y += 4; // inter-section gap
  });

  // ─────────────────────────────────────────────────────────────────────
  // ── Bibliography ─────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────
  ensureSpace(cur, 28);
  drawRule(cur, COL_W, 0.5);
  cur.y += 3;

  doc.setFont('times','bold');
  doc.setFontSize(FS.section);
  doc.setTextColor(...C_DARK);
  doc.text('References', M_LEFT, cur.y);
  cur.y += 7;

  paper.bibliography.forEach(bib => {
    const clean = stripMarkdownItalic(bib.formatted);
    writeText(cur, clean, M_LEFT + 5, FS.bib, 'normal', C_BODY, {
      indent: -5,    // hanging indent effect via offset x
      maxWidth: COL_W - 5,
      lineHeightFactor: 1.4,
      afterParagraph: 3,
    });
  });

  // ── Final rule ────────────────────────────────────────────────────────
  cur.y += 3;
  drawRule(cur, COL_W, 0.3);
  cur.y += 4;

  doc.setFont('times','italic');
  doc.setFontSize(FS.doi);
  doc.setTextColor(...C_GREY);
  doc.text(`Received: ${paper.year - 1}  ·  Accepted: ${paper.year}  ·  Published online: ${paper.year}`, M_LEFT, cur.y);
  cur.y += 4;
  doc.text(`DOI: ${paper.doi}`, M_LEFT, cur.y);

  // ─────────────────────────────────────────────────────────────────────
  // ── Save ─────────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────
  const safeTitle = paper.title
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 60);

  doc.save(`${safeTitle}.pdf`);
}

import { GeneratedHorror } from './horrorGrammar';

export async function exportHorrorAsPdf(horror: GeneratedHorror): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const cur = {
    doc,
    y: M_TOP,
    page: 1,
  };

  // ── TITLE PAGE ─────────────────────────────────────────────────────────
  if (horror.format === 'screenplay') {
    // Classic Hollywood Title Page: Centered Courier 12pt
    doc.setFont('courier', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // Centering vertically on title page
    cur.y = 100;
    const titleLines: string[] = doc.splitTextToSize(horror.title.toUpperCase(), COL_W);
    titleLines.forEach(line => {
      doc.text(line, PAGE_W / 2, cur.y, { align: 'center' });
      cur.y += 6;
    });

    cur.y += 10;
    doc.text("Written by", PAGE_W / 2, cur.y, { align: 'center' });
    cur.y += 8;
    doc.text(horror.author, PAGE_W / 2, cur.y, { align: 'center' });

    if (horror.coauthors.length > 0) {
      cur.y += 6;
      doc.text("&", PAGE_W / 2, cur.y, { align: 'center' });
      cur.y += 6;
      const coauthStr = horror.coauthors.map(ca => ca.name).join(', ');
      doc.text(coauthStr, PAGE_W / 2, cur.y, { align: 'center' });
    }

    // Address info in bottom left
    doc.text("Leuphana University", M_LEFT, PAGE_H - M_BOT - 15);
    doc.text(`Copyright ${horror.year}`, M_LEFT, PAGE_H - M_BOT - 8);

    // Add first screenplay page
    doc.addPage();
    cur.page = 2;
    cur.y = M_TOP;
  } else {
    // Classic Novel Manuscript Title Page: justified, elegant top alignment
    doc.setFont('times', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);

    cur.y = M_TOP + 20;
    const titleLines: string[] = doc.splitTextToSize(horror.title, COL_W);
    titleLines.forEach(line => {
      doc.text(line, M_LEFT, cur.y);
      cur.y += 10;
    });

    cur.y += 12;
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.text(`A Novel Manuscript by ${horror.author}`, M_LEFT, cur.y);

    if (horror.coauthors.length > 0) {
      cur.y += 6;
      const coauthStr = `with ${horror.coauthors.map(ca => `${ca.name} (${ca.institution})`).join(', ')}`;
      doc.text(coauthStr, M_LEFT, cur.y);
    }

    cur.y += 15;
    doc.setFont('times', 'italic');
    doc.setFontSize(10.5);
    const synLines: string[] = doc.splitTextToSize(horror.synopsis, COL_W);
    synLines.forEach(line => {
      doc.text(line, M_LEFT, cur.y);
      cur.y += 5;
    });

    // Add first chapter page
    doc.addPage();
    cur.page = 2;
    cur.y = M_TOP;
  }

  // ── CHAPTERS / SCENES ──────────────────────────────────────────────────
  horror.chaptersOrScenes.forEach((sec, si) => {
    // Page break between chapters/scenes
    if (si > 0) {
      doc.addPage();
      cur.page++;
      cur.y = M_TOP;
    }

    if (horror.format === 'screenplay') {
      doc.setFont('courier', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);

      // Slugline
      doc.text(sec.title.toUpperCase(), M_LEFT, cur.y);
      cur.y += 8;

      sec.elements.forEach(el => {
        // check bottom margin
        if (cur.y > PAGE_H - M_BOT) {
          doc.addPage();
          cur.page++;
          cur.y = M_TOP;
        }

        if (el.type === 'action') {
          doc.setFont('courier', 'normal');
          doc.setFontSize(12);
          const actLines: string[] = doc.splitTextToSize(el.content, COL_W);
          actLines.forEach(line => {
            if (cur.y > PAGE_H - M_BOT) {
              doc.addPage();
              cur.page++;
              cur.y = M_TOP;
            }
            doc.text(line, M_LEFT, cur.y);
            cur.y += 5.5;
          });
          cur.y += 4; // paragraph gap
        } else if (el.type === 'dialogue') {
          // Hollywood dialogue is indented: speaker name centered-ish at 95mm
          doc.setFont('courier', 'bold');
          doc.setFontSize(12);
          doc.text(el.speaker || "CHARACTER", PAGE_W / 2, cur.y, { align: 'center' });
          cur.y += 5.5;

          // dialogue block max width is 75mm, centered
          doc.setFont('courier', 'normal');
          const dialW = 75;
          const dialLines: string[] = doc.splitTextToSize(el.content, dialW);
          dialLines.forEach(line => {
            if (cur.y > PAGE_H - M_BOT) {
              doc.addPage();
              cur.page++;
              cur.y = M_TOP;
            }
            doc.text(line, PAGE_W / 2, cur.y, { align: 'center' });
            cur.y += 5.5;
          });
          cur.y += 4; // dialogue block gap
        } else if (el.type === 'parenthetical') {
          doc.setFont('courier', 'italic');
          doc.setFontSize(11);
          doc.text(el.content, PAGE_W / 2, cur.y, { align: 'center' });
          cur.y += 5.5;
        }
      });
    } else {
      // Novel Manuscript Chapter
      doc.setFont('times', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);

      // Chapter title centered
      doc.text(sec.title, PAGE_W / 2, cur.y, { align: 'center' });
      cur.y += 12;

      sec.elements.forEach(el => {
        doc.setFont('times', 'normal');
        doc.setFontSize(11.5);

        const lines: string[] = doc.splitTextToSize(el.content, COL_W);
        lines.forEach((line, i) => {
          if (cur.y > PAGE_H - M_BOT) {
            doc.addPage();
            cur.page++;
            cur.y = M_TOP;
          }
          // Indent first line of narrative block
          const isFirst = i === 0;
          doc.text(line, M_LEFT + (isFirst ? 6 : 0), cur.y);
          cur.y += 6;
        });
        cur.y += 4; // gap
      });
    }

    // Footer: Page numbers on every page except the title page
    const totalPages = doc.getNumberOfPages();
    for (let i = 2; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont(horror.format === 'screenplay' ? 'courier' : 'times', 'normal');
      doc.setFontSize(10);
      doc.text(`${i}.`, PAGE_W - M_RIGHT, PAGE_H - M_BOT + 6, { align: 'right' });
    }
  });

  const safeTitle = horror.title
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 60);

  doc.save(`${safeTitle}.pdf`);
}

import { GeneratedDiary } from './diaryGrammar';

export async function exportDiaryAsPdf(diary: GeneratedDiary): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const cur = {
    doc,
    y: M_TOP,
    page: 1,
  };

  // ── Drawing dot grid pattern inside usable margins ────────────────────
  const drawDots = () => {
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.1);
    for (let x = M_LEFT; x <= PAGE_W - M_RIGHT; x += 5) {
      for (let y = M_TOP; y <= PAGE_H - M_BOT; y += 5) {
        doc.rect(x, y, 0.15, 0.15, 'S');
      }
    }
  };

  drawDots();

  // ── Masthead and Metadata ─────────────────────────────────────────────
  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...C_DARK);
  doc.text(diary.format === 'memoir' ? "VISCERAL STUDIO JOURNAL" : "LOG ENTRY / SELF-AUDIT", M_LEFT, cur.y);
  cur.y += 6;

  doc.setFont('courier', 'bold');
  doc.setFontSize(9.5);
  doc.text(`Path: ${diary.catalogPath}`, M_LEFT, cur.y);
  cur.y += 8;

  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.text(`Date: ${diary.date}   Wake: ${diary.wakeTime}`, M_LEFT, cur.y);
  cur.y += 10;

  // Atmosphere box
  doc.setFillColor(248, 246, 242);
  doc.rect(M_LEFT, cur.y, COL_W, 18, 'F');
  doc.setDrawColor(200, 190, 180);
  doc.setLineWidth(0.2);
  doc.rect(M_LEFT, cur.y, COL_W, 18, 'S');
  
  doc.setFont('times', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(...C_BODY);
  const moodLines: string[] = doc.splitTextToSize(diary.moodNote, COL_W - 6);
  moodLines.forEach((line: string, idx: number) => {
    doc.text(line, M_LEFT + 3, cur.y + 4.5 + idx * 4.5);
  });
  cur.y += 24;

  // ── Operational Schedule (Only for clinical logbooks) ────────────────
  if (diary.format !== 'memoir') {
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...C_DARK);
    doc.text("DAILY OPERATIONAL SCHEDULE", M_LEFT, cur.y);
    cur.y += 6;

    diary.rituals.forEach(rit => {
      if (cur.y > PAGE_H - M_BOT - 15) {
        doc.addPage();
        cur.page++;
        cur.y = M_TOP;
        drawDots();
      }

      doc.setFont('courier', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(0, 0, 0);
      doc.text(`[${rit.time}] ${rit.title}`, M_LEFT, cur.y);
      cur.y += 5;

      doc.setFont('times', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(...C_BODY);
      
      rit.paragraphs.forEach(step => {
        const stepLines: string[] = doc.splitTextToSize(`- ${step}`, COL_W);
        stepLines.forEach((line: string) => {
          if (cur.y > PAGE_H - M_BOT - 6) {
            doc.addPage();
            cur.page++;
            cur.y = M_TOP;
            drawDots();
          }
          doc.text(line, M_LEFT + 3, cur.y);
          cur.y += 4.5;
        });
      });
      cur.y += 4; // spacing between rituals
    });
  }

  // ── Diary Observations ────────────────────────────────────────────────
  cur.y += 4;
  if (cur.y > PAGE_H - M_BOT - 20) {
    doc.addPage();
    cur.page++;
    cur.y = M_TOP;
    drawDots();
  }

  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...C_DARK);
  doc.text(diary.format === 'memoir' ? "JOURNAL LOG ENTRIES" : "TIMESTAMPED DIARY ENTRIES", M_LEFT, cur.y);
  cur.y += 6;

  diary.diaryEntries.forEach(entry => {
    if (cur.y > PAGE_H - M_BOT - 15) {
      doc.addPage();
      cur.page++;
      cur.y = M_TOP;
      drawDots();
    }

    doc.setFont('courier', 'bold');
    doc.setFontSize(9.5);
    doc.text(`[${entry.timestamp}] ${entry.title}`, M_LEFT, cur.y);
    cur.y += 6;

    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...C_BODY);
    
    const contentLines: string[] = doc.splitTextToSize(entry.content, COL_W);
    contentLines.forEach((line: string) => {
      if (cur.y > PAGE_H - M_BOT - 6) {
        doc.addPage();
        cur.page++;
        cur.y = M_TOP;
        drawDots();
      }
      doc.text(line, M_LEFT + 3, cur.y);
      cur.y += 4.5;
    });
    cur.y += 4;
  });

  // ── Diagnostics and Closing ───────────────────────────────────────────
  cur.y += 6;
  if (cur.y > PAGE_H - M_BOT - 30) {
    doc.addPage();
    cur.page++;
    cur.y = M_TOP;
    drawDots();
  }

  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text("PERFORMANCE TENSORS", M_LEFT, cur.y);
  cur.y += 6;

  doc.setFont('courier', 'normal');
  doc.setFontSize(9);
  doc.text(`Structural Integrity: ${diary.diagnostics.structuralIntegrity}%   Social Exposure: ${diary.diagnostics.socialExposureRisk}%`, M_LEFT, cur.y);
  cur.y += 4.5;
  doc.text(`Hope for Humanity: ${diary.diagnostics.hopeForHumanity}%   Compulsion Index: ${diary.diagnostics.compulsionLevel}%`, M_LEFT, cur.y);
  cur.y += 8;

  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.text("Closing Mantra:", M_LEFT, cur.y);
  cur.y += 4.5;
  
  doc.setFont('times', 'italic');
  doc.setFontSize(9.5);
  const mantraLines: string[] = doc.splitTextToSize(`"${diary.closingMantra}"`, COL_W);
  mantraLines.forEach((line: string) => {
    doc.text(line, M_LEFT, cur.y);
    cur.y += 4.5;
  });

  const safeTitle = diary.catalogPath.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_').substring(0, 50);
  doc.save(`${safeTitle}.pdf`);
}

import { GeneratedUnderground } from './undergroundGrammar';

export async function exportUndergroundAsPdf(underground: GeneratedUnderground): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const cur = {
    doc,
    y: M_TOP,
    page: 1,
  };

  // ── Title Header ──────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(underground.title.toUpperCase(), M_LEFT, cur.y);
  cur.y += 6;

  doc.setFont('courier', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...C_GREY);
  doc.text(`Location: ${underground.location}  ·  Date: ${underground.date}`, M_LEFT, cur.y);
  cur.y += 10;

  // Thin divider
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(M_LEFT, cur.y, PAGE_W - M_RIGHT, cur.y);
  cur.y += 8;

  // ── Body Paragraph 1 ──────────────────────────────────────────────────
  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(35, 28, 22);
  const p1Text = `On May 3, 2026, I played a benefit in the city. Entry was pay-what-you-can ${underground.financials.ticketRange}. We raised $${underground.financials.totalRaised}. After venue costs ($${underground.financials.venueCost}), security ($${underground.financials.securityCost}), insurance rider ($${underground.financials.insuranceCost}), and a $${underground.financials.cleaningCost} cleaning fee, $${underground.financials.netPayout} went straight to ${underground.financials.beneficiary}.`;
  const p1Lines: string[] = doc.splitTextToSize(p1Text, COL_W);
  p1Lines.forEach(line => {
    doc.text(line, M_LEFT, cur.y);
    cur.y += 5.5;
  });
  cur.y += 6;

  // ── Dubplates Manifest Box ────────────────────────────────────────────
  doc.setFillColor(245, 245, 245);
  doc.rect(M_LEFT, cur.y, COL_W, 6 + underground.gearAndDubplates.plates.length * 5, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.25);
  doc.rect(M_LEFT, cur.y, COL_W, 6 + underground.gearAndDubplates.plates.length * 5, 'S');
  
  doc.setFont('courier', 'bold');
  doc.setFontSize(10);
  doc.text("DUBPLATE MANIFEST", M_LEFT + 4, cur.y + 5);
  
  doc.setFont('courier', 'normal');
  doc.setFontSize(9.5);
  underground.gearAndDubplates.plates.forEach((plate, idx) => {
    doc.text(`- ${plate}`, M_LEFT + 6, cur.y + 10 + idx * 5);
  });
  cur.y += 12 + underground.gearAndDubplates.plates.length * 5;

  // ── Body Paragraph 2 ──────────────────────────────────────────────────
  if (cur.y > PAGE_H - M_BOT - 30) {
    doc.addPage();
    cur.page++;
    cur.y = M_TOP;
  }

  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  const p2Text = `My set ran ${underground.performance.duration} minutes. The peak moment was minute ${underground.performance.peakMinute}, when I ${underground.performance.peakAction}. Nobody filmed it. ${underground.performance.eyewitnessCount} people told me about it the next day anyway, with the kind of detail you can’t get from a screen: where they were standing, what it felt like in their sternum, the exact lyric fragment that landed.`;
  const p2Lines: string[] = doc.splitTextToSize(p2Text, COL_W);
  p2Lines.forEach(line => {
    doc.text(line, M_LEFT, cur.y);
    cur.y += 5.5;
  });
  cur.y += 8;

  // ── Callout Quote ─────────────────────────────────────────────────────
  doc.setFont('times', 'italic');
  doc.setFontSize(13);
  doc.text("\"That’s the memo, honestly.\"", M_LEFT + 10, cur.y);
  cur.y += 10;

  // ── Body Paragraph 3 ──────────────────────────────────────────────────
  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  const p3Text = `The mainstream will keep chasing ${underground.philosophy.mainstreamChasing}. But the underground in 2026 is not an aesthetic. It’s a labor practice. A consent practice. A mutual-aid practice. A memory practice. It’s people choosing lower throughput, higher fidelity, tighter community, louder truth.`;
  const p3Lines: string[] = doc.splitTextToSize(p3Text, COL_W);
  p3Lines.forEach(line => {
    if (cur.y > PAGE_H - M_BOT - 10) {
      doc.addPage();
      cur.page++;
      cur.y = M_TOP;
    }
    doc.text(line, M_LEFT, cur.y);
    cur.y += 5.5;
  });
  cur.y += 6;

  // ── Body Paragraph 4 ──────────────────────────────────────────────────
  const p4Text = `If you came up on the internet, that's fine. I did too. I met half my favorite collaborators through a Discord server called ${underground.philosophy.discordServer} that I joined on ${underground.philosophy.discordDate}. But the internet is where we find each other. The room is where we become real.`;
  const p4Lines: string[] = doc.splitTextToSize(p4Text, COL_W);
  p4Lines.forEach(line => {
    if (cur.y > PAGE_H - M_BOT - 10) {
      doc.addPage();
      cur.page++;
      cur.y = M_TOP;
    }
    doc.text(line, M_LEFT, cur.y);
    cur.y += 5.5;
  });
  cur.y += 10;

  // ── Closing Memo Box (High contrast) ──────────────────────────────────
  if (cur.y > PAGE_H - M_BOT - 35) {
    doc.addPage();
    cur.page++;
    cur.y = M_TOP;
  }

  doc.setFillColor(20, 20, 20);
  const memoLines: string[] = doc.splitTextToSize(underground.closingMemo, COL_W - 8);
  const memoH = 10 + memoLines.length * 5;
  doc.rect(M_LEFT, cur.y, COL_W, memoH, 'F');

  doc.setFont('courier', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("MEMO TO THE LISTENER", M_LEFT + 4, cur.y + 5);
  
  doc.setFont('courier', 'normal');
  doc.setFontSize(9.5);
  memoLines.forEach((line: string, idx: number) => {
    doc.text(line, M_LEFT + 4, cur.y + 10 + idx * 5);
  });
  cur.y += memoH + 8;

  // ── Footer ────────────────────────────────────────────────────────────
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(`Compiled by ${underground.gearAndDubplates.toteType}  ·  Maxwell S. Hargrave  ·  Leuphana University`, M_LEFT, cur.y);

  const safeTitle = underground.title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_').substring(0, 50);
  doc.save(`${safeTitle}.pdf`);
}

import { GeneratedSchemer } from './schemerGrammar';

export async function exportSchemerAsPdf(schemer: GeneratedSchemer): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const cur = {
    doc,
    y: M_TOP,
    page: 1,
  };

  // ── Title Header ──────────────────────────────────────────────────────
  doc.setFont('courier', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(180, 20, 20); // Deep Red warning header
  doc.text(schemer.title.toUpperCase(), M_LEFT, cur.y);
  cur.y += 6;

  doc.setFont('courier', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...C_GREY);
  doc.text(`Architect: ${schemer.author}  ·  Leuphana University`, M_LEFT, cur.y);
  cur.y += 10;

  // Red Warning rule
  doc.setDrawColor(180, 20, 20);
  doc.setLineWidth(0.6);
  doc.line(M_LEFT, cur.y, PAGE_W - M_RIGHT, cur.y);
  cur.y += 8;

  // ── Strategy Diagnostics Grid ─────────────────────────────────────────
  doc.setFillColor(248, 245, 245);
  doc.rect(M_LEFT, cur.y, COL_W, 20, 'F');
  doc.setDrawColor(220, 200, 200);
  doc.setLineWidth(0.2);
  doc.rect(M_LEFT, cur.y, COL_W, 20, 'S');

  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 0, 0);
  doc.text(`Moral Decay: ${schemer.systemDiagnostics.moralDecay}%`, M_LEFT + 4, cur.y + 6);
  doc.text(`Yield Coeff: ${schemer.systemDiagnostics.yieldCoefficient}%`, M_LEFT + 4, cur.y + 12);
  doc.text(`Risk Index: ${schemer.systemDiagnostics.exposureRisk}%`, M_LEFT + 65, cur.y + 6);
  doc.text(`Heartless:  ${schemer.systemDiagnostics.heartlessnessIndex}%`, M_LEFT + 65, cur.y + 12);
  doc.text(`Exec Prob:  ${schemer.systemDiagnostics.executionProbability}%`, M_LEFT + 120, cur.y + 9);
  cur.y += 28;

  // ── Blueprints ────────────────────────────────────────────────────────
  schemer.blueprints.forEach(bp => {
    if (cur.y > PAGE_H - M_BOT - 20) {
      doc.addPage();
      cur.page++;
      cur.y = M_TOP;
    }

    doc.setFont('courier', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(180, 20, 20);
    doc.text(`${bp.id}. ${bp.title.toUpperCase()}`, M_LEFT, cur.y);
    cur.y += 5;

    doc.setFont('times', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(...C_BODY);
    const descLines: string[] = doc.splitTextToSize(`Strategy: ${bp.description}`, COL_W);
    descLines.forEach(line => {
      doc.text(line, M_LEFT, cur.y);
      cur.y += 4.5;
    });
    cur.y += 3;

    doc.setFont('times', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...C_BODY);
    
    bp.steps.forEach(step => {
      const stepLines: string[] = doc.splitTextToSize(`- ${step}`, COL_W);
      stepLines.forEach(line => {
        if (cur.y > PAGE_H - M_BOT - 6) {
          doc.addPage();
          cur.page++;
          cur.y = M_TOP;
        }
        doc.text(line, M_LEFT + 3, cur.y);
        cur.y += 4.5;
      });
    });
    cur.y += 6; // spacing
  });

  // ── Closing Memo ──────────────────────────────────────────────────────
  if (cur.y > PAGE_H - M_BOT - 18) {
    doc.addPage();
    cur.page++;
    cur.y = M_TOP;
  }
  
  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(...C_GREY);
  const closingLines: string[] = doc.splitTextToSize(`"${schemer.closingMemo}"`, COL_W);
  closingLines.forEach(line => {
    doc.text(line, M_LEFT, cur.y);
    cur.y += 4.5;
  });

  const safeTitle = schemer.title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_').substring(0, 50);
  doc.save(`${safeTitle}.pdf`);
}
