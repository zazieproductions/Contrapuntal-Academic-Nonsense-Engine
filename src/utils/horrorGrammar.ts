import { SeededRandom } from './seedRandom';

export interface GeneratedHorror {
  title: string;
  author: string;
  coauthors: { name: string; institution: string }[];
  genre: string;
  format: 'manuscript' | 'screenplay';
  year: number;
  synopsis: string;
  chaptersOrScenes: {
    title: string; // Chapter Title or Screenplay Slugline
    elements: {
      type: 'action' | 'dialogue' | 'parenthetical' | 'chapter-title' | 'narrative';
      speaker?: string;
      content: string;
    }[];
  }[];
  rawLaTeX: string;
  rawMarkdown: string;
}

const HORROR_GENRES: Record<string, {
  titleTemplates: string[];
  settings: string[];
  protagonists: string[];
  antagonists: string[];
  verbs: string[];
  imagery: string[];
  dialogueLines: string[];
  driftPhrases: string[];
}> = {
  cosmic: {
    titleTemplates: [
      "The Geometry of the [adjective] [setting]",
      "Where the [antagonist] Whispers in the [setting]",
      "The [adjective] Convergence of [protagonist]",
      "In the Shadow of the [antagonist] Star"
    ],
    settings: ["desolate observatory", "flooded basement of the archive", "forgotten salt flats", "decaying cyclopean temple", "sub-basement of the library", "blackened reef"],
    protagonists: ["Dr. Hargrave", "the chief archivist", "a sleepless cartographer", "the retired antiquarian", "a blind mathematician"],
    antagonists: ["the crawling void", "the nameless constellation", "the multi-angled deity", "the silent architect of the deep", "the light that consumes shadows"],
    verbs: ["dissolves", "fractures", "coalesces", "reverberates", "unfolds", "gestates", "whispers", "erases", "inverts"],
    imagery: ["non-Euclidean angles", "black liquid stars", "a vibration that shivers the teeth", "smell of ozone and dry parchment", "the terrifying architecture of a higher dimension", "eyes opening along the grain of the floorboards"],
    dialogueLines: [
      "The stars... they aren't in the sky. They're behind it.",
      "The math doesn't close. It leaks.",
      "We are merely skin stretched over a cold coordinate.",
      "Listen to the frequency between the ticks."
    ],
    driftPhrases: [
      "The pages are growing damp with grease that smells like dead seas.",
      "I can feel the ink vibrating against the paper.",
      "The margins are narrowing. There is less room to breathe."
    ]
  },
  gothic: {
    titleTemplates: [
      "The Crimson Sediment of [setting]",
      "The Portrait of [protagonist]'s Decay",
      "A Nocturne for the [adjective] [antagonist]",
      "The Shadow Over [setting]"
    ],
    settings: ["decaying family chapel", "abandoned ancestral manorhouse", "waterlogged conservatory", "overgrown topiary labyrinth", "mist-choked crypt", "iron-gated sanatorium"],
    protagonists: ["the widowed governess", "the pale heir", "the nervous portraitist", "the sister of mercy", "an eccentric genealogist"],
    antagonists: ["the weeping lady", "the red rot", "the shadow in the portrait", "the iron-locked ancestor", "the clockwork specter"],
    verbs: ["rots", "bleeds", "languishes", "haunts", "withers", "sighs", "creaks", "entombs", "suffocates"],
    imagery: ["heavy velvet drapes damp with mold", "flickering candelabras", "dust motes suspended like ashes", "the smell of damp earth and wet copper", "blood-red camellias", "a mirror that reflects a slightly different room"],
    dialogueLines: [
      "The house remembers us. It has always remembered us.",
      "There is someone behind the plaster. I hear them scratching.",
      "Do not look at the family portraits after sunset.",
      "My blood feels thick, like the water in the well."
    ],
    driftPhrases: [
      "A cold draft is coming from the corner of the text.",
      "The ink has turned a rusty, dried-blood brown.",
      "I hear footsteps on the stairs. Nobody is home."
    ]
  },
  body: {
    titleTemplates: [
      "The Cellular Architecture of [protagonist]",
      "The [adjective] Gestation of the [setting]",
      "The [antagonist] Within the Bone",
      "The Metamorphosis of the [adjective] Flesh"
    ],
    settings: ["sterile isolation ward", "amateur operating theater", "damp meat-packing locker", "suburban greenhouse", "underground laboratory", "the space behind the ribs"],
    protagonists: ["the renegade embryologist", "the sleepless donor", "the prosthetics technician", "the veterinary surgeon", "the self-taught anatomist"],
    antagonists: ["the sentient calcification", "the cellular replacement", "the growth that mimics teeth", "the vascular network", "the invasive twin"],
    verbs: ["gestates", "calcifies", "sprouts", "divides", "splits", "pulses", "ruptures", "mutates", "sloughs"],
    imagery: ["teeth growing inside the lung", "the sound of joints popping in reverse", "peeling fingernails revealing brass gears", "sweet, heavy scent of warm fat", "vascular patterns map like city streets", "the skin sliding like silk over muscle"],
    dialogueLines: [
      "It's not a tumor. It's a blossom.",
      "I can feel it thinking in my fingernails.",
      "My bones are softer today. More accommodating.",
      "We don't need anesthesia. The marrow likes the air."
    ],
    driftPhrases: [
      "The paper feels warm, almost feverish.",
      "There is a pulse in the cursor.",
      "The text is beginning to blister."
    ]
  },
  folk: {
    titleTemplates: [
      "The Harvest of the [adjective] [setting]",
      "The [antagonist] of the Furrow",
      "When the [setting] Weeps Green",
      "The [adjective] Law of [protagonist]"
    ],
    settings: ["deeply rutted barley field", "sunken mud-lane", "forgotten peat bog", "hollow-way beneath the oaks", "damp drystone sheep-cote", "the village common"],
    protagonists: ["the parish surveyor", "the new schoolmaster", "the herb-gatherer", "the timber-cruiser", "the pregnant stranger"],
    antagonists: ["the straw-man", "the moss-mother", "the tooth-in-the-turf", "the blind sow of the fen", "the wicker-king"],
    verbs: ["burrows", "harvests", "binds", "sprouts", "chokes", "drowns", "ripens", "tethers", "exhumes"],
    imagery: ["braided straw masks", "wet black peat", "roots that grasp like fingers", "the smell of wet wool and elderberries", "a crown of dry thorns", "the rhythmic thud of a churn in an empty cottage"],
    dialogueLines: [
      "The soil must have its salt.",
      "We do not walk the hollow-way after the frost.",
      "The green will climb the walls before spring.",
      "Drink the well-water. It makes the dreams green."
    ],
    driftPhrases: [
      "A smell of wet straw is rising from the device.",
      "The letters look like small, dry thorns.",
      "Something is buried beneath this page."
    ]
  }
};

const COMMON_ADJECTIVES = ["desolate", "forgotten", "blackened", "damp", "hollowed", "ancient", "sterile", "feverish", "calcified", "subterranean", "mishappen", "incurable"];

export function generateHorror(
  genreKey: string,
  format: 'manuscript' | 'screenplay',
  seed: string,
  density: number,
  authorName: string,
  coauthors: { name: string; institution: string }[],
  length: number = 15,
  drift: number = 0
): GeneratedHorror {
  const random = new SeededRandom(seed || "horror-seed-42");
  const genre = HORROR_GENRES[genreKey] || HORROR_GENRES.cosmic;

  // ── Title Generation ──────────────────────────────────────────────────
  const activeAdj = random.pick(COMMON_ADJECTIVES);
  const activeSetting = random.pick(genre.settings);
  const activeProtagonist = random.pick(genre.protagonists);
  const activeAntagonist = random.pick(genre.antagonists);

  let title = random.pick(genre.titleTemplates)
    .replace("[adjective]", activeAdj)
    .replace("[setting]", activeSetting)
    .replace("[protagonist]", activeProtagonist)
    .replace("[antagonist]", activeAntagonist);

  const year = 2026;

  if (drift > 75) {
    title = title + `: A Record of ${random.pick(genre.imagery)}`;
  }

  // ── Synopsis ─────────────────────────────────────────────────────────
  const synopsis = `A visceral examination of spatial degradation and somatic distress. Upon documenting a non-periodic disturbance in the ${activeSetting}, ${activeProtagonist} registers a series of anomalous manifestations of ${random.pick(genre.imagery)} corresponding to the presence of ${activeAntagonist}.`;

  // ── Scene/Chapter Generation ──────────────────────────────────────────
  const chaptersOrScenes: GeneratedHorror['chaptersOrScenes'] = [];
  // Scale section count proportionally to length, allowing up to 40 chapters/scenes for a full 120-page manuscript/script
  const sectionCount = Math.max(3, Math.min(40, Math.floor(length / 3)));

  for (let s = 1; s <= sectionCount; s++) {
    const sceneTitle = format === 'screenplay'
      ? `INT. ${activeSetting.toUpperCase()} - ${random.pick(['DAY', 'NIGHT', 'TWILIGHT', 'DAWN'])}`
      : `Chapter ${s}: The ${random.pick(genre.settings).charAt(0).toUpperCase() + random.pick(genre.settings).slice(1)}`;

    const elements: GeneratedHorror['chaptersOrScenes'][0]['elements'] = [];

    if (format === 'screenplay') {
      // Standard screenplay formatting structure
      // 1. Action line describing setting/atmosphere
      elements.push({
        type: 'action',
        content: `The air in the ${activeSetting} is heavy, thick with the scent of ${random.pick(genre.imagery)}. ${activeProtagonist.toUpperCase()} stands motionless before the center of the room. The sound of a slow, rhythmic ${random.pick(["dripping", "scraping", "breathing", "clicking"])} echoes from the corners.`
      });

      // 2. Action line with drift/madness inflections
      if (drift > 30 || density > 50) {
        elements.push({
          type: 'action',
          content: `A shadow stretches across the floorboards — not matching the light source. It moves with a liquid, ${random.pick(genre.verbs)} motion.`
        });
      }

      // Dialogue loop
      const dialoguesCount = random.nextInt(2, 5);
      for (let d = 0; d < dialoguesCount; d++) {
        const speaker = random.pick([activeProtagonist, "A VOICE", "THE SHADOW", "THE RADIO"]);
        
        // Dialogue line infused with genre imagery and drift
        let speech = random.pick(genre.dialogueLines);
        if (drift > 50 && random.next() > 0.5) {
          speech = `${speech} Do you hear it? The sound of ${random.pick(genre.imagery)} under the floor.`;
        }
        if (drift > 80 && random.next() > 0.6) {
          speech = `${speech} ${random.pick(genre.driftPhrases)}`;
        }

        if (random.next() > 0.6) {
          elements.push({
            type: 'parenthetical',
            speaker,
            content: `(${random.pick(["whispering", "shivering", "staring into the dark", "with rising panic", "hollowly"])})`
          });
        }

        elements.push({
          type: 'dialogue',
          speaker: speaker.toUpperCase(),
          content: speech
        });
      }

      // Ending action
      elements.push({
        type: 'action',
        content: `${activeProtagonist.toUpperCase()} backs away slowly. The ${random.pick(genre.imagery)} begins to ${random.pick(genre.verbs)}.`
      });

    } else {
      // Novel Manuscript formatting structure
      // 3-4 dense narrative blocks
      const narrativeBlocks = random.nextInt(2, 4);
      for (let n = 0; n < narrativeBlocks; n++) {
        let text = `It began in the ${activeSetting}, where the shadows did not fall as they should. ${activeProtagonist} spent hours mapping the anomalies, noting how the grain of the wood seemed to ${random.pick(genre.verbs)} under the dim lantern-light. There was a smell in the air — the unmistakable scent of ${random.pick(genre.imagery)}.`;

        if (density > 40) {
          text += ` The secondary sources had described this phenomenon as a form of ${random.pick(genre.verbs)}ing decay, but the reality was far more visceral. The ${activeAntagonist} was not merely a symbol; it was an active, physical presence, waiting in the damp drafts of the floorboards.`;
        }

        if (drift > 45) {
          text += ` ${random.pick(genre.driftPhrases)} We must not look at the margins of the page, for fear of what is written in the space between.`;
        }

        if (drift > 75) {
          text += ` ${random.pick(genre.driftPhrases).toUpperCase()} It is breathing. I can hear the page breathing beneath the keyboard.`;
        }

        elements.push({
          type: 'narrative',
          content: text
        });
      }
    }

    chaptersOrScenes.push({
      title: sceneTitle,
      elements
    });
  }

  // ── LaTeX Formatting ─────────────────────────────────────────────────
  const authorStr = `${authorName || "Maxwell S. Hargrave"}`;
  const caStr = coauthors.map(ca => `\\author{${ca.name} \\\\ \\small ${ca.institution}}`).join("\n");

  const latexContent = chaptersOrScenes.map(cs => {
    let sectionStr = `\\section*{${cs.title.replace('&', '\\&')}}\n\n`;
    cs.elements.forEach(el => {
      if (el.type === 'action') {
        sectionStr += `\\textit{${el.content.replace('&', '\\&')}}\n\n`;
      } else if (el.type === 'dialogue') {
        sectionStr += `\\begin{center}\n\\textbf{${el.speaker}}\\\\\n${el.content.replace('&', '\\&')}\n\\end{center}\n\n`;
      } else if (el.type === 'parenthetical') {
        sectionStr += `\\begin{center}\n\\textit{${el.content}}\n\\end{center}\n\n`;
      } else {
        sectionStr += `${el.content.replace('&', '\\&')}\n\n`;
      }
    });
    return sectionStr;
  }).join("\n");

  const rawLaTeX = `\\documentclass[11pt]{article}
\\usepackage{times}
\\usepackage{geometry}
\\geometry{margin=1in}

\\title{${title}}
\\author{${authorStr} \\\\ \\small Leuphana University}
${caStr}
\\date{${year}}

\\begin{document}
\\maketitle

\\begin{abstract}
${synopsis}
\\end{abstract}

${latexContent}

\\end{document}`;

  // ── Markdown Formatting ──────────────────────────────────────────────
  const mdContent = chaptersOrScenes.map(cs => {
    let secStr = `## ${cs.title}\n\n`;
    cs.elements.forEach(el => {
      if (el.type === 'action') {
        secStr += `*${el.content}*\n\n`;
      } else if (el.type === 'dialogue') {
        secStr += `**${el.speaker}**\n${el.content}\n\n`;
      } else if (el.type === 'parenthetical') {
        secStr += `*${el.content}*\n\n`;
      } else {
        secStr += `${el.content}\n\n`;
      }
    });
    return secStr;
  }).join("\n");

  const rawMarkdown = `# ${title}

**Author:** ${authorStr} (Leuphana University)
${coauthors.map(ca => `- ${ca.name} (${ca.institution})`).join("\n")}

> **Synopsis:** ${synopsis}

---

${mdContent}`;

  return {
    title,
    author: authorStr,
    coauthors,
    genre: genreKey,
    format,
    year,
    synopsis,
    chaptersOrScenes,
    rawLaTeX,
    rawMarkdown
  };
}
