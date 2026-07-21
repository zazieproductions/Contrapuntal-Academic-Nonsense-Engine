import { SeededRandom } from './seedRandom';

export interface GeneratedUnderground {
  title: string;
  date: string;
  location: string;
  financials: {
    totalRaised: number;
    ticketRange: string;
    venueCost: number;
    securityCost: number;
    insuranceCost: number;
    cleaningCost: number;
    netPayout: number;
    beneficiary: string;
  };
  gearAndDubplates: {
    toteType: string;
    plates: string[];
  };
  performance: {
    duration: number;
    peakMinute: number;
    peakAction: string;
    eyewitnessCount: number;
  };
  philosophy: {
    mainstreamChasing: string;
    undergroundDef: string[];
    discordServer: string;
    discordDate: string;
  };
  closingMemo: string;
  rawLaTeX: string;
  rawMarkdown: string;
}

const CITIES = [
  { name: "Baltimore", venues: ["warehouse on E. Oliver St.", "basement gallery in Station North", "abandoned printshop off Greenmount Ave."] },
  { name: "Brooklyn", venues: ["loft space in Bushwick", "basement off Broadway in Bed-Stuy", "waterfront warehouse in Red Hook"] },
  { name: "Chicago", venues: ["diy space in Pilsen", "storefront gallery in Logan Square", "industrial loft off Damen Ave."] },
  { name: "Philadelphia", venues: ["basement on Baltimore Ave in West Philly", "warehouse off Front St in Kensington", "punk house in South Philly"] },
  { name: "Oakland", venues: ["warehouse in West Oakland", "loft space near Fruitvale", "converted auto shop off Telegraph Ave."] },
  { name: "Detroit", venues: ["loft space near Eastern Market", "converted bank building off Woodward Ave.", "basement studio in Hamtramck"] }
];

const PLATES_POOL = [
  "footwork cuts with pitched-up vocal chops",
  "electroacoustic grime instrumentals with heavy sub weight",
  "ballroom-noise remixes built on a 1997 house acapella",
  "ambient drill cuts constructed from field recordings of my neighbor’s radiator knocking at 3:14 a.m.",
  "analog-synthesizer drone layers mixed with microtonal feedback loops",
  "speed-garage bassline tools with stuttering rimshots",
  "distorted jungle breaks chopped on a tracker interface",
  "electro-acoustic soundscape layers utilizing a contact mic on a water pipe",
  "raw techno loops designed for mono-system impact",
  "minimalist synthesizer loops utilizing custom patch configurations"
];

const BENEFICIARIES = [
  "households facing eviction in the neighborhood",
  "a local community bail fund",
  "grassroots mutual-aid distribution collectives",
  "the neighborhood community fridge network",
  "transgender healthcare and support networks",
  "displaced warehouse artist space relocation funds"
];

const MAINSTREAM_CHASE = [
  "the next 'underground aesthetic' the way it chases sunset gradients and serif fonts",
  "the raw texture of 'authenticity' the way it chases retro synthesizer emulation and vintage filters",
  "the latest 'niche subculture' the way it chases algorithms and metadata trends",
  "the aesthetic of 'resistance' the way it chases moodboard pins and streaming playlist branding"
];

const UNDERGROUND_PRACTICES = [
  "a labor practice",
  "a consent practice",
  "a mutual-aid practice",
  "a memory practice",
  "a community safety practice",
  "an accountability practice"
];

const DISCORDS = ["NOISE SWAP / EAST COAST", "TRACKER HEADS / DUB RITES", "DUBPLATE ARCHIVE / MIDWEST", "MODULAR MATRIX / WEST COAST"];

export function generateUnderground(
  seed: string,
  density: number,
  drift: number,
  authorName: string,
  length: number = 15
): GeneratedUnderground {
  const random = new SeededRandom(seed || "underground-seed-42");
  const author = authorName || "Maxwell S. Hargrave";

  // ── Dynamic details ───────────────────────────────────────────────────
  const cityData = random.pick(CITIES);
  const venue = random.pick(cityData.venues);
  const dateStr = `2026-05-${random.nextInt(1, 28)}`;
  
  // Financials
  const raised = random.nextInt(2200, 3800);
  const venueCost = random.nextInt(800, 1100);
  const securityCost = random.nextInt(250, 450);
  const insuranceCost = random.nextInt(120, 220);
  const cleaningCost = random.nextInt(100, 180);
  const netPayout = raised - (venueCost + securityCost + insuranceCost + cleaningCost);
  const beneficiary = random.pick(BENEFICIARIES);

  // Dubplates scale with length
  const countPlates = Math.min(10, Math.max(4, Math.floor(length / 3)));
  const shuffledPlates = random.shuffle(PLATES_POOL);
  const selectedPlates = shuffledPlates.slice(0, countPlates);

  // Performance
  const duration = random.nextInt(40, 65);
  const peakMin = random.nextInt(20, duration - 10);
  const actions = [
    "cut the kick for 8 beats and let a tape hiss swell fill the room like a slow wave",
    "dropped the sub frequencies and let a raw modular oscillator screech cut the darkness",
    "filtered the high hat and introduced a low-end drone that rattled the pipes in the ceiling",
    "stopped the main loop entirely to let the room breathe with just the feedback of the delays"
  ];
  const peakAction = random.pick(actions);
  const eyewitness = random.nextInt(10, 22);

  // Philosophy
  const chase = random.pick(MAINSTREAM_CHASE);
  const practices = random.shuffle(UNDERGROUND_PRACTICES).slice(0, 4);
  const discord = random.pick(DISCORDS);
  const discDate = `July 8, 2019`;

  const title = `Memo from ${cityData.name}: ${dateStr}`;

  // Add drift parenthetical if drift level is high
  let driftComment = "";
  if (drift > 40) {
    driftComment = ` (I still hear the tape hiss at night, a low-amplitude wave that refuses to settle, almost as if the drywall had absorbed the transient and began to reflect it back).`;
  }
  if (drift > 80) {
    driftComment = ` (The walls have fully memorized the frequency. I have monitored the structural drift since then. Every nail in the floorboards has shifted exactly 0.4mm to the left to match the speaker array coordinates).`;
  }

  // Add density details to dubplates list if density level is elevated
  const formattedPlates = selectedPlates.map(p => {
    if (density > 50) {
      return `${p} (mastered at -14.2 LUFS with flat response, calibrated for a mono point-source stack)`;
    }
    return p;
  });

  // ── Markdown Generation ──────────────────────────────────────────────
  const rawMarkdown = `# ${title}

On May 3, 2026, I played a benefit for a displaced queer collective in ${cityData.name} at a ${venue} Entry was pay-what-you-can $5–$20. We raised $${raised}. After venue costs ($${venueCost}), security ($${securityCost}), insurance rider ($${insuranceCost}), and a $${cleaningCost} cleaning fee, $${netPayout} went straight to ${beneficiary}.

I brought ${countPlates} dubplates in a foam-lined tote:
${formattedPlates.map(p => `- ${p}`).join('\n')}

My set ran ${duration} minutes. The peak moment was minute ${peakMin}, when I ${peakAction}${driftComment}. Nobody filmed it. ${eyewitness} people told me about it the next day anyway, with the kind of detail you can’t get from a screen: where they were standing, what it felt like in their sternum, the exact lyric fragment that landed.

That’s the memo, honestly.

The mainstream will keep chasing ${chase}. But the underground in 2026 is not an aesthetic. It’s ${practices.slice(0, -1).map(p => `a ${p.split(' ')[1]}`).join(', ')} practice, and a ${practices[practices.length - 1].split(' ')[1]} practice. It’s people choosing lower throughput, higher fidelity, tighter community, louder truth.

If you came up on the internet, that's fine. I did too. I met half my favorite collaborators through a Discord server called ${discord} that I joined on ${discDate}. But the internet is where we find each other. The room is where we become real.

So the next time you see a flyer with a date, a time, a basement address, a sliding scale, a no-photo icon, and a hand-drawn logo that looks like it was made with a gel pen in a moving car: go. Bring cash. Bring earplugs. Bring a friend who knows how to take a door shift. And when the sub hits at 1:37 a.m. and the paint flakes and the stranger next to you smiles like they’ve been waiting all week for this exact frequency — don’t reach for your phone.`;

  // ── LaTeX Generation ──────────────────────────────────────────────────
  const rawLaTeX = `\\documentclass[11pt]{article}
\\usepackage{times}
\\usepackage{geometry}
\\geometry{margin=1in}

\\title{${title}}
\\author{${author} \\\\ \\small Leuphana University}

\\begin{document}
\\maketitle

On May 3, 2026, I played a benefit in ${cityData.name} at a ${venue} Entry was pay-what-you-can \\$5--\\$20. We raised \\$${raised}. After venue costs (\\$${venueCost}), security (\\$${securityCost}), insurance rider (\\$${insuranceCost}), and a \\$${cleaningCost} cleaning fee, \\$${netPayout} went straight to ${beneficiary}.

I brought ${countPlates} dubplates in a foam-lined tote:
\\begin{itemize}
${formattedPlates.map(p => `  \\item ${p.replace(/&/g, '\\&')}`).join('\n')}
\\end{itemize}

My set ran ${duration} minutes. The peak moment was minute ${peakMin}, when I ${peakAction}${driftComment}.

\\end{document}`;

  return {
    title,
    date: dateStr,
    location: `${venue}, ${cityData.name}`,
    financials: {
      totalRaised: raised,
      ticketRange: "$5–$20",
      venueCost,
      securityCost,
      insuranceCost,
      cleaningCost,
      netPayout,
      beneficiary
    },
    gearAndDubplates: {
      toteType: "foam-lined tote",
      plates: selectedPlates
    },
    performance: {
      duration,
      peakMinute: peakMin,
      peakAction,
      eyewitnessCount: eyewitness
    },
    philosophy: {
      mainstreamChasing: chase,
      undergroundDef: practices,
      discordServer: discord,
      discordDate: discDate
    },
    closingMemo: `So the next time you see a flyer with a date, a time, a basement address, a sliding scale, a no-photo icon, and a hand-drawn logo that looks like it was made with a gel pen in a moving car: go. Bring cash. Bring earplugs. Bring a friend who knows how to take a door shift. And when the sub hits at 1:37 a.m. and the paint flakes and the stranger next to you smiles like they’ve been waiting all week for this exact frequency — don’t reach for your phone.`,
    rawLaTeX,
    rawMarkdown
  };
}
