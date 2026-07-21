import { SeededRandom } from './seedRandom';

export interface GeneratedSchemer {
  title: string;
  author: string;
  coconspirators: { name: string; role: string }[];
  format: 'blueprint' | 'pitch';
  year: number;
  systemDiagnostics: {
    moralDecay: number;
    yieldCoefficient: number;
    exposureRisk: number;
    heartlessnessIndex: number;
    executionProbability: number;
  };
  blueprints: {
    id: number;
    title: string;
    description: string;
    steps: string[];
  }[];
  closingMemo: string;
  rawLaTeX: string;
  rawMarkdown: string;
}

const SCAMS_POOL = [
  {
    title: "Obituary Crypto Seizure Funnel",
    desc: "Capitalizing on grief timelines when digital asset awareness is lowest and familial focus is completely fractured.",
    steps: [
      "Automate scraping of daily regional obituaries using simple cron triggers.",
      "Cross-reference names against public directories, Coinbase, Robinhood, and Venmo databases using lazy username API endpoints.",
      "Target the 48-96 hour grief window when relatives are overwhelmed and identity theft alerts are ignored.",
      "Initiate SIM swap account recoveries posing as the deceased's 'court-appointed estate executor' using barely-official legal letterheads.",
      "Quietly liquidate entire wallet balances into private mixer services, routing donations to shell charities you control to sanitize transaction histories."
    ]
  },
  {
    title: "Ultra-Lowball Micro-Acquisition Scheme",
    desc: "Targeting emotionally exhausted micro-founders and solopreneurs facing acute personal distress.",
    steps: [
      "Scan LinkedIn, IndieHackers, and burnout-focused subreddits for distressed keywords (divorce, illness, fatigue).",
      "Offer rapid, 'no-diligence' emergency buyouts of their small business IP and domains for a pittance ($500 to $2,000 cash).",
      "Structure template purchase contracts that overload all pre-existing operational debts and liabilities back onto the seller.",
      "Aggregate dozens of these distressed brands into a single storefront shell.",
      "Manufacture artificial demand with bots, then flip the aggregated portfolio to clueless corporate incubators at a 400% markup."
    ]
  },
  {
    title: "Fake Home Appraisal Distress Flip",
    desc: "Acquiring distressed residential assets at 50-60% of fair market value using fabricated inspections.",
    steps: [
      "Establish dozens of dummy home inspection LLCs across foreclosure-heavy zip codes.",
      "Approach desperate sellers facing immediate bank auctions, offering a 'free, expedited pre-appraisal report'.",
      "Lowball the condition assessment reports—fabricate toxic black mold, structural foundation cracking, and phantom dry rot.",
      "Apply extreme temporal pressure, offering a 'hassle-free, cash-in-hand buyout' if signed within 24 hours.",
      "Flip the property within 90 days after performing purely aesthetic cosmetic repairs disguised as deep structural restorations."
    ]
  },
  {
    title: "Emergency Vet Diagnostic Funnel",
    desc: "Exploiting emergency pet panics where logical decision-making is disabled by acute stress.",
    steps: [
      "Launch localized social media ad campaigns for '24-Hour Emergency Triage Veterinary Care' in underserved counties.",
      "Design intake landing pages that require pre-authorization of maxed-out debit/credit cards before a consultation is scheduled.",
      "Provide zero medical care—automatically cycle through pre-recorded automated triage responses.",
      "Vanish the online presence completely within 48 hours, transferring funds through decentralized crypto bridges.",
      "Target pet owners specifically because emotional attachment disables normal risk assessment protocols."
    ]
  },
  {
    title: "Grudge-Based Reputational Leverage",
    desc: "Quietly extracting high-margin fees from personal vendettas without crossing criminal extortion thresholds.",
    steps: [
      "Sell targeted background check and investigative services to disgruntled ex-employees and jealous spouses.",
      "Collect $1,500 to $5,000 to systematically index and organize the target's personal and professional secrets.",
      "Instead of blacklisting or demanding funds directly, anonymously leak the most embarrassing, true-but-damaging facts to public forums.",
      "Profit entirely from providing the automated scraping and delivery bots while leaving the legal risk to the customer.",
      "Maintain a strict 'informational neutrality' clause in the service terms to prevent conspiracy indictments."
    ]
  },
  {
    title: "Ghost Vendor Holiday Retargeting",
    desc: "Setting up fast-failing storefront networks optimized for time-sensitive seasonal buying spikes.",
    steps: [
      "Spin up 50+ minimalist Shopify stores selling highly specific seasonal products (Fourth of July kits, custom ugly sweaters).",
      "Process payments directly to dummy accounts, immediately skipping supplier fulfillment loops.",
      "Exploit the fact that holiday shipping backlogs delay chargeback procedures by several weeks.",
      "Vanish the entire storefront network preemptively before payment gateway audit flags trigger.",
      "Re-register new entities under foreign shelf companies to sustain the quarterly cycle."
    ]
  },
  {
    title: "Existential Threat Grift",
    desc: "Prying on systemic collapse anxiety using pseudo-scientific protection gear.",
    steps: [
      "Design landing pages for high-ticket 'EMP Shielding Systems' and 'Grid-Collapse Personal Bunkers' priced at $9,995.",
      "Inundate survivalist forums and conspiracy channels with manufactured leaks regarding 'upcoming cosmic events'.",
      "Accept payments exclusively in non-custodial cryptocurrency to avoid payment processors holding escrow.",
      "Ship empty steel cases with basic industrial ventilation tubes labeled as 'Military-Grade EMP Neutralizers'.",
      "Incorporate the legal entity in jurisdictions with zero consumer protection laws."
    ]
  },
  {
    title: "The Benefactor Bond Scam",
    desc: "Targeting the low-income creative demographic through fake philanthropic grants.",
    steps: [
      "Pose as a reclusive, terminally ill eccentric offering 'no-strings grants' to independent musicians and students.",
      "Require a nominal 'processing, verification, and inheritance bond' ranging from $300 to $1,200 to release the funds.",
      "Exploit the psychology of desperate hope—individuals facing eviction are highly compliant.",
      "Blame eventual funding delays on 'complex tax documentation and cross-border verification regulations'.",
      "Systematically cycle through Grant bodies, dissolving the registry every 60 days."
    ]
  }
];

const BLUEPRINT_MEMOS = [
  "If you aren't exploiting the margin, you're the one paying for it. The room is full of sheep waiting to be sheared—let your templates be the shears.",
  "The entire economy is built on the friction of grief and panic. If you learn to index those variables, cash flow becomes a simple mathematical inevitability.",
  "Perfection in execution is not a moral question. It is a matter of precision, timing, and clean corporate dissolution."
];

export function generateSchemer(
  seed: string,
  density: number,
  drift: number,
  authorName: string,
  length: number = 15,
  format: 'blueprint' | 'pitch' = 'blueprint'
): GeneratedSchemer {
  const random = new SeededRandom(seed || "schemer-seed-42");
  const author = authorName || "Maxwell S. Hargrave";

  // Dynamic financials and diagnostics
  const moralDecay = Math.max(70, Math.min(100, Math.round(85 + (drift / 5) + random.nextInt(-3, 3))));
  const yieldCoefficient = Math.max(50, Math.min(100, Math.round(75 + (density / 4) + random.nextInt(-2, 2))));
  const exposureRisk = Math.max(10, Math.min(100, Math.round(25 - (density / 5) + (drift / 4))));
  const heartlessnessIndex = Math.max(80, Math.min(100, Math.round(90 + (drift / 8))));
  const executionProbability = Math.max(60, Math.min(100, Math.round(80 + (density / 6))));

  const systemDiagnostics = {
    moralDecay,
    yieldCoefficient,
    exposureRisk,
    heartlessnessIndex,
    executionProbability
  };

  // co-conspirators/shell partners
  const coconspirators = [
    { name: "Delaware Shell Services Inc.", role: "Registered Agent & Proxy" },
    { name: "Cayman Asset Routing", role: "Offshore Treasury" }
  ];

  // Blueprints scale with length (up to 25 strategies for high-length treatises)
  const targetCount = Math.max(2, Math.min(25, Math.floor(length / 4)));
  
  const selectedScams: typeof SCAMS_POOL = [];
  if (targetCount > 0) {
    const shuffled = random.shuffle([...SCAMS_POOL]);
    for (let i = 0; i < targetCount; i++) {
      selectedScams.push(shuffled[i % shuffled.length]);
    }
  }

  const blueprints = selectedScams.map((s, idx) => ({
    id: idx + 1,
    title: s.title,
    description: s.desc,
    steps: s.steps.map(step => {
      let text = step;
      if (drift > 50 && random.next() > 0.6) {
        text += ` (Crucial: Ensure all traces of identity are routed through three intermediate VPN layers before running the cron scripts).`;
      }
      return text;
    })
  }));

  const title = format === 'blueprint'
    ? `MALIGNANT SOCIOPATH FRAGMENT TRANSMISSION — VOL. ${random.nextInt(2, 9)}`
    : `CONFIDENTIAL REVENUE BLUEPRINT: SYSTEMIC PREDATION PROTOCOL`;

  const closingMemo = random.pick(BLUEPRINT_MEMOS);

  // ── LaTeX Generation ──────────────────────────────────────────────────
  const stepsLaTeX = blueprints.map(b => {
    return `\\subsection*{${b.id}. ${b.title}}\n\\textbf{Strategy:} ${b.description}\\\\\n\\begin{enumerate}\n` + b.steps.map(s => `  \\item ${s}`).join('\n') + `\n\\end{enumerate}\n`;
  }).join('\n');

  const rawLaTeX = `\\documentclass[11pt]{article}
\\usepackage{times}
\\usepackage{geometry}
\\geometry{margin=1in}

\\title{${title}}
\\author{${author} \\\\ \\small Leuphana University}

\\begin{document}
\\maketitle

\\section*{Systemic Predation Tensors}
\\begin{itemize}
  \\item \\textbf{Moral Decay Index:} ${moralDecay}\\%
  \\item \\textbf{Yield Coefficient:} ${yieldCoefficient}\\%
  \\item \\textbf{Exposure Risk:} ${exposureRisk}\\%
\\end{itemize}

\\section*{Operative Blueprints}
${stepsLaTeX}

\\section*{Closing Memo}
\\textit{${closingMemo}}

\\end{document}`;

  // ── Markdown Generation ──────────────────────────────────────────────
  const mdContent = blueprints.map(b => {
    return `### ${b.id}. ${b.title}\n*${b.description}*\n\n` + b.steps.map(s => `- ${s}`).join('\n') + `\n`;
  }).join('\n');

  const rawMarkdown = `# ${title}

**Author/Architect:** ${author} (Leuphana University)
**Shell Intermediaries:**
${coconspirators.map(c => `- ${c.name} (${c.role})`).join('\n')}

---

## Predictive Diagnostics
- **Moral Decay Index:** ${moralDecay}% (Full ethical bypass simulated)
- **Estimated Yield Coefficient:** ${yieldCoefficient}%
- **Prosecutorial Exposure Risk:** ${exposureRisk}%
- **Heartlessness Quotient:** ${heartlessnessIndex}%
- **Execution Probability:** ${executionProbability}%

---

## Operative Blueprints

${mdContent}

## Closing Memo
*${closingMemo}*`;

  return {
    title,
    author,
    coconspirators,
    format,
    year: 2026,
    systemDiagnostics,
    blueprints,
    closingMemo,
    rawLaTeX,
    rawMarkdown
  };
}
