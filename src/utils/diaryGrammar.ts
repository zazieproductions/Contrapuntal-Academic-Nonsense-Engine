import { SeededRandom } from './seedRandom';

export interface GeneratedDiary {
  catalogPath: string;
  date: string;
  wakeTime: string;
  irritability: number;
  moodNote: string;
  format: 'logbook' | 'memoir';
  rituals: {
    time: string;
    title: string;
    paragraphs: string[];
  }[];
  diaryEntries: {
    timestamp: string;
    title: string;
    content: string;
  }[];
  diagnostics: {
    structuralIntegrity: number;
    socialExposureRisk: number;
    hopeForHumanity: number;
    compulsionLevel: number;
    precisionQuotient: number;
  };
  closingMantra: string;
  nextTask: string;
  rawLaTeX: string;
  rawMarkdown: string;
}

// ── Logbook Pool ─────────────────────────────────────────────────────────────
const ANOMALIES = [
  "The lower drawer of the filing cabinet is [angle]° off alignment—likely due to that unapproved vacuuming incident three days ago.",
  "Tracked a micro-vibration of [frequency] Hz in the north wall to a miscalibrated radiator valve.",
  "Noticed a slight [percent]% deviation in the curvature of the lowercase 'e' in today's handwriting.",
  "A single hair fell onto the desk at [time]. Labeled specimen slide as 'Incidental Self | [date] | Dawnfall'.",
  "The Aphex Twin shower sync was offset by [time] due to a water-pressure spike.",
  "Discovered a [dB]dB peak at 820Hz on the solo stem from three nights ago—evidence of emotional cowardice."
];

const CORRECTIVE_ACTIONS = [
  "Wrote a 14-step reengineering draft to correct the balance.",
  "Drafted a 5-point stabilization protocol including a custom wedge. I will not sleep until it is installed.",
  "Recalibrated chair height by [cm]cm, then wrote [pages] full pages of 'eeeeeeeeee' to reassert dominance over the loop.",
  "Soloed Cell A4 and compared against the 'Golden Compendium of Midrange Ethics'. Rebuilt using subtractive EQ lineage.",
  "Preserved the artifact. I believe every shed part of me carries residual intent. They must be archived.",
  "Deleted the last [count] renders as a punitive measure and re-rendered with a stricter ceiling."
];

const DIARY_RITUALS = [
  {
    title: "AUDIO ENVIRONMENT SANITATION",
    steps: [
      "Ensure all studio monitors are positioned at exactly [angle]° inward angle from ear axis.",
      "Wipe down all control surface knobs clockwise ONLY.",
      "Verify that no audio or power cables cross each other (braided interference = spiritual entropy)."
    ]
  },
  {
    title: "FILE SYSTEM PURIFICATION & AUDITING",
    steps: [
      "Audit the previous day's project folders.",
      "Rename all rough exports to strict 'YYYY-MM-DD_PROJECT-S[number]_r[number]_FINALCANDIDATE' format.",
      "Any file containing the word 'final' without a strict timestamp is deleted and re-exported."
    ]
  },
  {
    title: "TRACK CELL RECONSTRUCTION: MODULE A4",
    steps: [
      "Import yesterday's 'Strain Index Test Layer' (BPM [bpm] locked).",
      "Solo the mid-range bridge and check against structural harmony standards.",
      "Verify spectral tilt slope is within the [tolerance]dB threshold to avoid emotional indulgence."
    ]
  },
  {
    title: "SOCIAL DECONTAMINATION WINDOW",
    steps: [
      "Open communication channels for [minutes] minutes precisely.",
      "Reply to no more than two external queries. Maintain complete neutrality.",
      "Archive all transcript logs into 'External Interference > Distractions > 2025_Q2'.",
      "Rebalance cortisol levels using white-noise panning sweep for exactly [minutes] minutes."
    ]
  }
];

// ── Memoir / Visceral Hardware-Decay Pool ─────────────────────────────────────
const MEMOIR_GEAR = [
  { name: "Akai S2000 sampler", history: "the one I dragged out of a flooded basement in Gowanus in 2018, the one with the missing SCSI port and the sticky pitch-bend wheel" },
  { name: "Tascam 388 tape recorder", history: "purchased from a church cellar in Queens, its motor occasionally groaning under the weight of old oxide buildup" },
  { name: "E-mu SP1200", history: "which has spent three years on my desk with a dying backlight and a floppy drive that only reads formatted double-density disks" },
  { name: "Roland Juno-106", history: "with three failing voice chips that crackle like dry pine needles whenever the chorus is engaged" }
];

const MEMOIR_LOOPS = [
  "a 14-second loop of rain hitting a fire escape, recorded on a cracked iPhone 4 in 2011",
  "a field recording of my neighbor’s radiator knocking at 3:14 a.m. on a freezing February night",
  "a deteriorating cassette loop of a choir acapella from a thrift-store cassette, routed through failing tape delays",
  "the subharmonic resonance of the G train shaking the apartment window frame at 2:45 a.m."
];

const MEMOIR_OBSESSIONS = [
  "We tell ourselves we’re fighting the algorithm. We tell ourselves we’re rebelling against the sterile, frictionless, phase-aligned void of streaming platforms. We say we want 'texture.' We say we want 'warmth.' Bullshit. We aren't fighting the algorithm. We’re just terrified of immortality.",
  "A 24-bit WAV file is a psychopath. It doesn't age. It doesn't grieve. It doesn't care if you die. It has no relationship with time; it is a sociopath in a math equation. But tape? Tape is biological. Tape gets eaten by mold. Tape stretches. The hiss isn't an 'aesthetic.' The hiss is the sound of the medium bleeding out.",
  "We are obsessed with archiving the ephemeral because we are desperately trying to prove that we are real. That our decay matters. That the fact that we are going to disappear is the exact thing that makes us beautiful."
];

const MEMOIR_HARD_DRIVES = [
  { name: "silver LaCie hard drive", files: "3,412 unreleased tracks from kids on private forums between 2009 and 2013" },
  { name: "lacquered CD-R folder", files: "hundreds of unlabelled soundboard bootlegs from warehouse parties in the late nineties" },
  { name: "scuffed external Western Digital drive", files: "the complete rip of three dead music blogs that folded in the spring of 2012" }
];

export function generateDiary(
  seed: string,
  density: number,
  drift: number,
  authorName: string,
  length: number = 15,
  format: 'logbook' | 'memoir' = 'logbook'
): GeneratedDiary {
  const random = new SeededRandom(seed || "diary-seed-42");
  const activeAuthor = authorName || "Maxwell S. Hargrave";

  const dateStr = `2026-03-${random.nextInt(10, 29)}`;
  const wakeTimeStr = `04:${random.nextInt(10, 30)}:${random.nextInt(10, 59)}.${random.nextInt(100, 999)} AM`;
  const catalogId = `ΔSTRICT-DOMINION-VOC.${random.nextInt(50, 99)}`;
  const catalogPath = `Logs > Meta-Process > Self-Audits > 2026 > MARCH > ${dateStr.split('-')[2]} > ${catalogId}`;

  const irritability = Number((0.2 + (density / 200) + (random.next() * 0.2)).toFixed(2));
  let moodNote = `Subthreshold irritability indexed at ${irritability}. Metronome ocular sweep completed. Structural balance checks pending.`;

  const rituals: GeneratedDiary['rituals'] = [];
  const diaryEntries: GeneratedDiary['diaryEntries'] = [];

  // ── 1. NOVEL VISCERAL MEMOIR GENERATION ──────────────────────────────────
  if (format === 'memoir') {
    const gear = random.pick(MEMOIR_GEAR);
    const loop = random.pick(MEMOIR_LOOPS);
    const drive = random.pick(MEMOIR_HARD_DRIVES);
    const obsession = random.pick(MEMOIR_OBSESSIONS);

    const timestamp1 = `04:12:03 AM`;
    const timestamp2 = `04:32:45 AM`;
    const timestamp3 = `05:02:16 AM`;

    let entry1 = `The smell hit me first. Ozone, hot dust, and the sharp, metallic tang of burning rosin flux. My ${gear.name}—${gear.history}—just committed suicide. There was a physical pop, like a knuckle cracking inside a tin can. A tiny blue spark jumped from the back vent, and the little LED that had been staring at me like a unblinking eye flickered, dimmed, and died. I was in the middle of trying to resample ${loop}, routed through three failing analog lines. I was trying to make it sound like a memory forgetting itself. Instead, the machine just gave up.`;
    
    if (drift > 50) {
      entry1 += ` I didn't reach for the fire extinguisher. I just slid off my chair, sat on the cold hardwood floor in my underwear, and watched the smoke curl up toward the ceiling.`;
    }

    let entry2 = `I started laughing. Then I started crying. Not because I lost the loop—the loop is gone, in the silicon graveyard now. I'm crying because sitting here, inhaling the smoke of a circuit board surrendering to entropy, I finally got the joke. ${obsession}`;

    let entry3 = `I have a ${drive.name} sitting on my desk right now. It contains ${drive.files}. But for the last three weeks, the drive has been making a sound. Click. Whirrr. Scrape. The bearing is failing. The read/write head is dropping onto the platter. I could back it up. I could put it on a temperature-controlled server where it will live perfectly preserved, perfectly safe, perfectly dead. I'm not going to do it. I'm going to let it click. I'm going to let it scrape. I'm going to let it die. Because art isn't meant to be preserved in amber.`;
    
    if (drift > 75) {
      entry3 += ` I'm going to open the window wider. Let the G train shake the glass. Let the damp March air ruin the rest of the gear. I'm done trying to save the ghosts. I'm just going to sit here in the dark, and listen to them rot.`;
    }

    diaryEntries.push(
      { timestamp: timestamp1, title: "The Capacitor Blew, and I Finally Understood Why We’re All So Fucking Sad", content: entry1 },
      { timestamp: timestamp2, title: "Fear of Immortality", content: entry2 },
      { timestamp: timestamp3, title: "Let the Platter Scrape", content: entry3 }
    );

    // Pad placeholders for rituals to keep interface consistent
    rituals.push({
      time: "04:12",
      title: "CAPACITOR BLOWOUT SEQUENCE",
      paragraphs: [
        `Inhaled exactly 18ml of burned rosin flux smoke from the ${gear.name}.`,
        "Observed curl profile of rising smoke against the gray ceiling.",
        "Verified G train window vibration coefficient is within acceptable limits."
      ]
    });
  } 
  // ── 2. CLASSIC OBSESSIVE LOGBOOK GENERATION ──────────────────────────────
  else {
    // Always start with Dawn Stabilization sequence
    const oolongSteep = 100 + random.nextInt(5, 50);
    const oolongTemp = (80 + random.next() * 10).toFixed(1);
    const oolongAmt = 100 + random.nextInt(10, 50);
    const drillMins = (3 + random.next() * 2).toFixed(1);
    const drillSecs = random.nextInt(10, 25);

    rituals.push({
      time: "05:30",
      title: "INITIATION RITE: “DAWN-STABILIZATION SEQUENCE”",
      paragraphs: [
        "Wake on first chime (Octatrack pulse tone, 62 bpm, sine wave only — no harmonics allowed).",
        `Perform ${drillMins}-minute ocular focus drill (object: metronome pendulum), alternating dominant/non-dominant eyes every ${drillSecs} seconds.`,
        `Brew ${oolongAmt}ml of oolong (Steep time: ${Math.floor(oolongSteep / 60)}m${oolongSteep % 60}s. Water temp: precisely ${oolongTemp}°C).`,
        "Consume with left hand while reading last night’s Error Logbook entries aloud in monotone. No emotional inflection permitted."
      ]
    });

    // Append additional rituals (scales dynamically up to 20 rituals for high-page logs)
    const ritualCount = Math.max(1, Math.min(20, Math.floor(length / 5)));
    const shuffledRituals = random.shuffle([...DIARY_RITUALS]);

    for (let i = 0; i < ritualCount; i++) {
      const baseRitual = shuffledRituals[i % shuffledRituals.length];
      const timeHour = 6 + Math.floor(i / 2);
      const timeMinute = i % 2 === 0 ? "00" : "30";
      const timeStr = timeHour < 10 ? `0${timeHour}:${timeMinute}` : `${timeHour}:${timeMinute}`;

      const steps = baseRitual.steps.map(step => {
        let s = step
          .replace("[angle]", random.nextInt(30, 45).toString())
          .replace("[frequency]", (10 + random.next() * 90).toFixed(2))
          .replace("[bpm]", (110 + random.next() * 10).toFixed(2))
          .replace("[tolerance]", (0.2 + random.next() * 0.8).toFixed(2))
          .replace("[minutes]", (3 + random.nextInt(1, 8)).toString());
        
        if (drift > 65 && random.next() > 0.5) {
          s += " (Note: Ensure the shadow in the corner does not shift during this task).";
        }
        return s;
      });

      rituals.push({
        time: timeStr,
        title: baseRitual.title,
        paragraphs: steps
      });
    }

    // Add observational logbook entries (scales up to 35 entries for massive logs)
    const entryCount = Math.max(2, Math.min(35, Math.floor(length / 3)));
    for (let e = 0; e < entryCount; e++) {
      const hour = 4 + Math.floor(e / 2);
      const min = random.nextInt(10, 59);
      const sec = random.nextInt(10, 59);
      const timeStamp = hour < 10 ? `0${hour}:${min}:${sec} AM` : `${hour}:${min}:${sec} AM`;

      let anomaly = random.pick(ANOMALIES)
        .replace("[angle]", (1 + random.next() * 2).toFixed(1))
        .replace("[frequency]", (10 + random.next() * 90).toFixed(2))
        .replace("[percent]", (1 + random.next() * 5).toFixed(2))
        .replace("[time]", timeStamp)
        .replace("[date]", dateStr.substring(5))
        .replace("[dB]", (0.5 + random.next() * 2).toFixed(2));

      let corrective = random.pick(CORRECTIVE_ACTIONS)
        .replace("[cm]", (1 + random.next() * 2).toFixed(1))
        .replace("[pages]", random.nextInt(2, 5).toString())
        .replace("[count]", random.nextInt(2, 5).toString());

      if (drift > 30 && random.next() > 0.5) {
        anomaly += ` Wrote a anonymous letter warning of this anomaly. I cannot risk them knowing the scope of my awareness.`;
      }
      if (drift > 60 && random.next() > 0.6) {
        corrective += ` Perfection is penance. I kissed the margin and whispered: 'You may stand forever.'`;
      }

      diaryEntries.push({
        timestamp: timeStamp,
        title: e === 0 ? "On the Minor Catastrophes of a Misaligned World" : `Log Segment ${e + 1}`,
        content: `${anomaly} ${corrective}`
      });
    }
  }

  // ── Diagnostics ───────────────────────────────────────────────────────
  const structuralIntegrity = Math.max(0, Math.min(100, Math.round(95 - (drift / 2) + random.nextInt(-5, 5))));
  const socialExposureRisk = Math.max(0, Math.min(100, Math.round(3 + (drift / 5) + random.nextInt(-2, 2))));
  const hopeForHumanity = Math.max(0, Math.min(100, Math.round(15 - (drift / 6) + random.nextInt(-3, 3))));
  const compulsionLevel = Math.max(0, Math.min(100, Math.round(85 + (density / 10) + random.nextInt(-4, 4))));
  const precisionQuotient = Math.max(0, Math.min(100, Math.round(98 - (drift / 4) + random.nextInt(-1, 2))));

  const diagnostics = {
    structuralIntegrity,
    socialExposureRisk,
    hopeForHumanity,
    compulsionLevel,
    precisionQuotient
  };

  let closingMantra = "Perfection is not completion. Perfection is recursion with reverence. If I must live in this broken dimension, let my rituals make it holy.";
  if (drift > 60) {
    closingMantra = "The grid is clean. The margins are narrow. The silence is flat. Let me become the coordinate.";
  }
  if (drift > 85) {
    closingMantra = "Let the G train shake the glass. Let the damp March air ruin the rest of the gear. I'm done trying to save the ghosts.";
  }

  const nextTask = drift > 70
    ? "Inhale the smoke of the circuit board and listen to the tape rot."
    : "Verify structural alignment of Study Room Theta shelving grid.";

  // ── LaTeX Generation ──────────────────────────────────────────────────
  const latexContent = diaryEntries.map(e => {
    return `\\subsection*{${e.timestamp}: ${e.title}}\n${e.content.replace(/%/g, '\\%')}\n\n`;
  }).join('\n');

  const rawLaTeX = `\\documentclass[11pt]{article}
\\usepackage{times}
\\usepackage{geometry}
\\geometry{margin=1in}

\\title{${catalogId}: ${dateStr}}
\\author{${activeAuthor} \\\\ \\small Leuphana University}
\\date{${dateStr}}

\\begin{document}
\\maketitle

\\section*{Log Path: ${catalogPath}}
\\textbf{Wake Time:} ${wakeTimeStr}\\\\
\\textbf{Irritability Index:} ${irritability} (0-1 scale)\\\\
\\textbf{Atmosphere Notes:} ${moodNote}

\\section*{Observations \& Journals}
${latexContent}

\\section*{Closing Mantra}
\\textit{${closingMantra}}

\\end{document}`;

  // ── Markdown Generation ──────────────────────────────────────────────
  const mdContent = diaryEntries.map(e => {
    return `### ${e.timestamp} - ${e.title}\n${e.content}\n`;
  }).join('\n');

  const rawMarkdown = `# ${catalogId}

**Catalogue Path:** \`${catalogPath}\`
**Date:** ${dateStr}
**Wake Time:** ${wakeTimeStr}
**Irritability Index:** ${irritability}/1.0

> **Atmosphere:** ${moodNote}

---

## Observations & Journals

${mdContent}

## Diagnostics
- **Structural Integrity:** ${structuralIntegrity}%
- **Social Exposure Risk:** ${socialExposureRisk}%
- **Hope for Humanity:** ${hopeForHumanity}%
- **Compulsion Level:** ${compulsionLevel}%
- **Precision Quotient:** ${precisionQuotient}%

**Closing Mantra:** *${closingMantra}*

**Next Task:** ${nextTask}`;

  return {
    catalogPath,
    date: dateStr,
    wakeTime: wakeTimeStr,
    irritability,
    moodNote,
    format,
    rituals,
    diaryEntries,
    diagnostics,
    closingMantra,
    nextTask,
    rawLaTeX,
    rawMarkdown
  };
}
