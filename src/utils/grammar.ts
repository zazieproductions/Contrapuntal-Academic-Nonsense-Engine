import { SeededRandom } from './seedRandom';

export interface GeneratedPaper {
  title: string;
  journal: string;
  volume: number;
  issue: number;
  year: number;
  doi: string;
  authors: { name: string; institution: string }[];
  abstract: string;
  sections: {
    title: string;
    paragraphs: string[];
    equation?: string;
    equationLabel?: string;
    diagramType?: 'schenkerian' | 'posttonal' | 'jazzneo' | 'medieval' | 'spectral' | 'algorithmic' | 'ethno' | 'film';
  }[];
  bibliography: {
    citationKey: string;
    formatted: string;
    bibtex: string;
  }[];
  peerReviews: {
    reviewer: string;
    verdict: 'Accept as submitted' | 'Accept with minor revisions' | 'Major revisions required' | 'Reject and resubmit';
    comments: string;
  }[];
  rawLaTeX: string;
  rawMarkdown: string;
}

// Jargon and dictionaries grouped by music theory fields
const FIELDS: Record<string, {
  titleTemplates: string[];
  nouns: string[];
  adjectives: string[];
  verbs: string[];
  buzzwords: string[];
  equations: string[];
  composers: string[];
  theoreticians: string[];
  diagramTypes: string[];
}> = {
  schenkerian: {
    titleTemplates: [
      "The Prolongational Deep-Structure of [composer]'s [work]: A [adjective] [noun] Analysis",
      "Voice-Leading Linearities and the [adjective] Ursatz in the Later Works of [composer]",
      "Deconstructing the Kopfton: [adjective] [noun] and Background Prolongations in [composer]",
      "Anstieg Vectors and the [adjective] Urlinie: Toward a General Theory of [buzzword]"
    ],
    nouns: ["prolongation", "Kopfton", "Ursatz", "Urlinie", "structural descent", "Schichten", "voice-leading graph", "bass arpeggiation", "Stufe", "Zug (linear progression)", "Nebennote (neighbor tone)", "Auskomponierung", "foreground diminution", "middleground transition", "structural cadence", "tonicization"],
    adjectives: ["prolongational", "Schenkerian", "structural", "hierarchical", "diatonic", "linear", "middleground", "fundamental", "foreground", "contrapuntal", "cadential", "highly prolonged", "sub-foreground", "chromatically inflected"],
    verbs: ["prolongs", "structuralizes", "linearizes", "articulates", "delays", "spans", "telescopes", "unfolds", "demarcates", "embellishes", "substantiates", "underpins", "resolves", "counterpoints"],
    buzzwords: ["prolongational tension", "fundamental bass progression", "structural voice-leading level", "interruption paradigm", "axial Kopfton shift", "anacrusis prolongation", "linear chordal representation", "scale-degree hierarchy"],
    equations: [
      "\\hat{5} - \\hat{4} - \\hat{3} - \\hat{2} - \\hat{1} \\quad \\text{prolonged via } I \\to IV \\to V \\to I",
      "\\mathcal{U}_{\\text{level}} = \\sum_{i=1}^{n} \\frac{\\partial \\text{Zug}_i}{\\partial \\text{Stufe}_i} \\cdot \\mathbf{K}_{\\text{opfton}}",
      "\\Gamma_{\\text{Ursatz}} = \\left\\langle \\mathcal{V}_{\\text{upper}}, \\mathcal{V}_{\\text{lower}} \\right\\rangle \\oplus \\Lambda_{\\text{prolongation}}",
      "\\mathbf{S}_{k} \\equiv \\mathbf{S}_{k-1} \\otimes \\mathcal{M}_{\\text{diminution}}"
    ],
    composers: ["J.S. Bach", "Ludwig van Beethoven", "Johannes Brahms", "W.A. Mozart", "Franz Schubert", "Joseph Haydn", "Frederic Chopin"],
    theoreticians: ["Heinrich Schenker", "Felix Salzer", "Carl Schachter", "Allen Forte", "William Rothstein", "John Rothgeb"],
    diagramTypes: ["schenkerian"]
  },
  posttonal: {
    titleTemplates: [
      "Set-Theoretic Isomorphisms and the [adjective] [noun] in [composer]'s [work]",
      "Combinatoriality and Z-Related Aggregates: A [adjective] Taxonomy of [composer]",
      "Multi-Dimensional Pitch-Class Symmetries and [buzzword] in Post-Tonal Matrices",
      "The [adjective] Vector: Re-Evaluating the Interval-Class Profiles of [composer]"
    ],
    nouns: ["pitch-class set", "interval-class vector", "prime form", "Forte number", "transpositional symmetry", "inversional index", "hexachordal combinatoriality", "Klumpenhouwer network", "Z-relation", "dodecaphonic matrix", "superset aggregate", "cardinality", "ordered pitch-class segment", "dyadic partition", "trichordal generator", "interval-class profile"],
    adjectives: ["post-tonal", "combinatorial", "non-diatonic", "set-theoretic", "dodecaphonic", "Z-related", "transpositionally invariant", "inversionally symmetric", "hexachordal", "dyadic", "trichordal", "serial", "atonal", "multi-dimensional"],
    verbs: ["transposes", "inverts", "partitions", "combinatorializes", "maps", "symmetrizes", "aggregates", "canonizes", "modulates", "serializes", "deconstructs", "permutates", "formalizes"],
    buzzwords: ["hexachordal combinatorial invariance", "interval-class vector convergence", "transpositional symmetry index", "multi-dimensional pitch-class space", "non-retrogradable rhythm mappings", "serial aggregate completion"],
    equations: [
      "T_n I (x) = (n - x) \\pmod{12}",
      "\\vec{V}(S) = \\left[ c_1, c_2, c_3, c_4, c_5, c_6 \\right] \\quad \\text{where } \\sum c_i = \\binom{|S|}{2}",
      "\\mathcal{K}(\\alpha, \\beta) = \\left\\{ T_n I \\mid \\phi(\\alpha) = \\beta \\right\\} \\subset \\text{Aut}(\\mathcal{S}_{12})",
      "\\mathbf{M}_{ij} = \\| p_i - p_j \\|_{12} \\otimes \\Lambda_{\\text{Forte}}"
    ],
    composers: ["Arnold Schoenberg", "Anton Webern", "Alban Berg", "Igor Stravinsky", "Bela Bartok", "Milton Babbitt", "Pierre Boulez"],
    theoreticians: ["Allen Forte", "David Lewin", "Joseph Straus", "Robert Morris", "Richard Cohn", "Milton Babbitt"],
    diagramTypes: ["posttonal"]
  },
  jazzneo: {
    titleTemplates: [
      "PLR-Cycles and [adjective] Tonnetz Lattices in [composer]'s [work]",
      "The [adjective] [noun] of Coltrane Changes: Toward a Non-Euclidean Theory of Jazz Harmony",
      "Negative Harmony and Dualistic Conversions in the [adjective] Style of [composer]",
      "Neo-Riemannian Transformations and [buzzword] in Modern Modal Jazz improvisations"
    ],
    nouns: ["Tonnetz representation", "PLR transformation", "Parallel relation", "Leading-tone exchange", "Relative transformation", "voice-leading distance", "triadic lattice", "hexatonic cycle", "tritone substitution", "Coltrane cycle", "negative harmony", "double-diminished axis", "Lydian chromatic matrix", "upper extension", "altered dominant partition", "parsimonious voice leading"],
    adjectives: ["Neo-Riemannian", "hexatonic", "parsimonious", "dualistic", "Lydian", "double-diminished", "chromatic-mediant", "non-Euclidean", "modal", "extended-triadic", "plagal", "enharmonically equivalent"],
    verbs: ["transforms", "maps", "resolves", "slides", "rotates", "substitutes", "polarizes", "bridges", "extends", "modulates", "cycles", "inverts"],
    buzzwords: ["parsimonious voice-leading distance", "triadic Tonnetz coordination", "Lydian chromatic expansion", "negative harmonic polarization", "hexatonic cycle projection", "chromatic mediant transformation"],
    equations: [
      "P(M) = M \\cdot \\left( \\begin{smallmatrix} 1 & 0 & 0 \\\\ 0 & -1 & 7 \\\\ 0 & 0 & 1 \\end{smallmatrix} \\right), \\quad L(M) = M \\cdot R_{12}",
      "\\text{Dist}_{PLR}(T_1, T_2) = \\min \\sum \\| \\Delta \\theta_i \\|_{12}",
      "\\mathcal{H}_{\\text{negative}}(C_{\\text{maj}}) = G_{\\text{min}} \\iff \\Phi_{\\text{axis}}(e) = -e \\pmod{12}",
      "\\mathbf{T} = \\mathbb{R}^2 / \\langle (4, 3), (3, 4) \\rangle \\cong \\text{Tonnetz}_{P,L,R}"
    ],
    composers: ["John Coltrane", "Thelonious Monk", "Bill Evans", "Wayne Shorter", "Herbie Hancock", "Miles Davis", "Duke Ellington", "Jacob Collier"],
    theoreticians: ["Hugo Riemann", "David Lewin", "Richard Cohn", "Dmitri Tymoczko", "George Russell", "Ernst Levy"],
    diagramTypes: ["jazzneo"]
  },
  medieval: {
    titleTemplates: [
      "Isorhythmic Taleae and [adjective] Mensuration in [composer]'s [work]",
      "Musica Ficta and the [adjective] Clausula: A Mathematical Formalization of [composer]",
      "Hexachordal Mutation and [adjective] [noun] in the Trecento and Ars Nova Polyphony",
      "The [adjective] Prolation Canon: [buzzword] and Temporal Ratios in [composer]"
    ],
    nouns: ["isorhythm", "talea", "color", "musica ficta", "clausula", "prolation canon", "hexachordal mutation", "cantus firmus", "Landini cadence", "Trecento polyphony", "Ars Nova notation", "micrologus", "guidonian hand", "chiavette", "hocket", "imperfect time", "mensuration circle"],
    adjectives: ["isorhythmic", "mensural", "fictive", "hexachordal", "modal", "cadential", "contrapuntal", "diatonic", "Trecento", "Ars Nova", "prolational", "imperfect", "hocketed", "Guidonian"],
    verbs: ["mutates", "annotates", "cadences", "prolates", "diminishes", "canonizes", "counterpoints", "transcribes", "measures", "solmizates", "interlocks"],
    buzzwords: ["isorhythmic color-talea friction", "mensural prolation coefficient", "hexachordal mutational path", "musica ficta double-semitone resolution", "hocketing vocal distribution", "Guidonian solmization lattice"],
    equations: [
      "\\text{Proportion} = \\frac{\\text{Tempus}}{\\text{Prolatio}} = 3:2 \\iff \\bigcirc \\text{ vs. } \\mathbf{C}",
      "\\mathcal{F}(t) = \\text{Color}(t \\pmod{N}) \\oplus \\text{Talea}(t \\pmod{M})",
      "\\Delta_{\\text{ficta}} = \\left\\{ x \\in \\mathbb{Z}_{12} \\mid \\text{Interval}(x, \\text{Cantus}) \\equiv 5 \\text{ or } 11 \\right\\}",
      "\\mathbf{H}_{\\text{hand}} = \\prod_{i=1}^{7} \\mathcal{H}_{\\text{hexachord}(i)}"
    ],
    composers: ["Guillaume de Machaut", "Francesco Landini", "Johannes Ockeghem", "Josquin des Prez", "Philippe de Vitry", "Leonin", "Perotin", "Hildegard von Bingen"],
    theoreticians: ["Guido d'Arezzo", "Johannes de Muris", "Franco of Cologne", "Tinctoris", "Marchetto da Padova", "Gioseffo Zarlino"],
    diagramTypes: ["medieval"]
  },
  spectral: {
    titleTemplates: [
      "Acoustic Inharmonicity and [adjective] Envelopes in the Spectral Works of [composer]",
      "Fourier Decompositions and the [adjective] [noun] in [composer]'s [work]",
      "Psychoacoustic Roughness and [buzzword] in Multi-Phonic Instrumentations",
      "The Spectral [noun]: Algorithmic Ring Modulation and Resonance Matrices in [composer]"
    ],
    nouns: ["overtone partial", "harmonic spectrum", "psychoacoustic roughness", "critical band", "spectral envelope", "frequency modulation index", "ring modulation", "differential tone", "additive synthesis", "transient response", "Fourier transform", "formant region", "acoustic centroid", "in-harmonicity ratio", "sonorous object", "microtonal beating"],
    adjectives: ["spectral", "psychoacoustic", "inharmonically dense", "microtonal", "acoustic", "Fourier-derived", "additive", "resonant", "multi-phonic", "Griseyan", "electro-acoustic", "filtered", "formant-based"],
    verbs: ["modulates", "filters", "decomposes", "resonates", "synthesizes", "analyzes", "beats", "thresholds", "transforms", "interpolates", "dissonates"],
    buzzwords: ["psychoacoustic roughness threshold", "critical band frequency overlap", "harmonic-to-inharmonic ratio gradient", "spectral envelope transient morphing", "ring-modulated overtone aggregation", "microtonal beating interference field"],
    equations: [
      "f_n = f_1 \\cdot n \\sqrt{1 + B n^2} \\quad \\text{where } B \\text{ is the inharmonicity coefficient}",
      "\\mathcal{R}(f_1, f_2) = \\sum a_i a_j e^{-b(f_j - f_i)} \\cdot \\left( e^{-c_1(f_j - f_i)} - e^{-c_2(f_j - f_i)} \\right)",
      "\\mathcal{S}_{\\text{envelope}}(\\omega) = \\int_{-\\infty}^{\\infty} x(t) e^{-i \\omega t} W(t - \\tau) \\, dt",
      "\\Psi_{\\text{roughness}} = \\mathbf{A}_{k} \\otimes \\mathbf{\\Phi}_{\\text{partials}}"
    ],
    composers: ["Gerard Grisey", "Tristan Murail", "Kaija Saariaho", "Claude Vivier", "Horatiu Radulescu", "Karlheinz Stockhausen", "György Ligeti"],
    theoreticians: ["Hugues Dufourt", "Gerard Grisey", "Tristan Murail", "Helmholtz", "Albert Bregman", "Jean-Claude Risset"],
    diagramTypes: ["spectral"]
  },
  algorithmic: {
    titleTemplates: [
      "Stochastic Sieves and [adjective] Markov Chains in [composer]'s [work]",
      "Information-Theoretic Entropy and the [adjective] [noun] of Algorithmic Compositions",
      "Cellular Automata and Chaos Theory: A [adjective] Dynamic Model of [composer]",
      "Recursive L-Systems and [buzzword] in [composer]'s Algorithmic Scores"
    ],
    nouns: ["Markov chain", "stochastic distribution", "entropy density", "Xenakis sieve", "cellular automaton", "L-system", "genetic algorithm", "chaotic attractor", "fractal dimension", "algorithmic complexity", "probability density function", "transition matrix", "information redundancy", "generative grammar", "self-similarity parameter"],
    adjectives: ["stochastic", "Markovian", "algorithmic", "information-theoretic", "chaotic", "fractal", "entropy-bound", "sieved", "generative", "automated", "recursive", "probability-based", "computational"],
    verbs: ["generates", "sieves", "calculates", "automates", "iterates", "stochasticizes", "transcribes", "computes", "converges", "optimizes", "randomizes", "maps"],
    buzzwords: ["stochastic probability density matrix", "information-theoretic entropy constraints", "Xenakis-styled sieve integer lattices", "cellular automaton generation rules", "recursive fractal L-system self-similarity", "genetic voice-leading cost-function"],
    equations: [
      "H(X) = -\\sum_{i=1}^{n} P(x_i) \\log_2 P(x_i) \\quad \\text{bits per note}",
      "S = \\left\\{ x \\in \\mathbb{Z} \\mid x \\equiv a_i \\pmod{m_i} \\right\\} \\cap \\mathbb{Z}_{120}",
      "\\mathbf{P}_{ij}^{(n)} = P(X_{t+n} = j \\mid X_t = i) = \\left( \\mathbf{M}_{\\text{transition}} \\right)^n",
      "\\mathcal{A}_{t+1} = f(\\mathcal{A}_t) \\oplus \\nabla_{\\text{chaos}}"
    ],
    composers: ["Iannis Xenakis", "John Cage", "Lejaren Hiller", "Herbert Brün", "Brian Eno", "György Ligeti", "Karlheinz Stockhausen"],
    theoreticians: ["Iannis Xenakis", "Claude Shannon", "Abraham Moles", "Lejaren Hiller", "Max Bense", "David Cope"],
    diagramTypes: ["algorithmic"]
  },
  ethno: {
    titleTemplates: [
      "Tuning Lattices and [adjective] Soundscapes: An Acoustemology of [composer]",
      "De-Westernizing Pitch Space: [adjective] [noun] and Geophony in the Highlands of [composer]",
      "Organology, Hegemony, and the [adjective] Resonance Profiles of Local Ensembles",
      "Hybridity and Participant-Observation: Re-Evaluating [buzzword] in [composer]'s Fieldwork"
    ],
    nouns: ["organology", "tuning system", "geophony", "acoustemology", "hegemonic pitch space", "participant-observation", "soundscape", "idiophonic resonance", "microtonal lattice", "hegemonic notation", "biophony", "cultural hybridity", "timbral spectrum", "sonic geography", "ritualized polyphony"],
    adjectives: ["acoustemological", "hegemonic", "de-Westernized", "geophonic", "organological", "hybrid", "microtonal", "fieldwork-based", "localized", "timbral", "biophonic", "ritualized", "non-tempered"],
    verbs: ["deconstructs", "recontextualizes", "documents", "resonates", "mediates", "listens", "embodies", "problematizes", "contextualizes", "hegemonizes", "de-Westernizes"],
    buzzwords: ["participant-observation acoustemological field", "indigenous non-tempered microtonal lattice", "hegemonic Western staff deconstruction", "geophonic environmental resonance profile", "post-colonial sonic hybridity vector"],
    equations: [
      "\\text{Cents} = 1200 \\log_2 \\left(\\frac{f_{\\text{indigenous}}}{f_{\\text{reference}}}\\right) \\pmod{\\Lambda_{\\text{culture}}}",
      "\\mathcal{O}_{\\text{hybrid}} = \\iint_{\\text{field}} \\mathbf{S}(\\theta, \\phi) \\cdot \\mathbf{H}_{\\text{hegemony}} \\, d\\theta \\, d\\phi",
      "\\Psi_{\\text{resonance}} = \\sum_{k=1}^{K} w_k \\cdot \\log \\left( \\frac{\\text{Partial}_k}{\\text{Noise}} \\right)",
      "\\mathbf{G}_{\\text{gamelan}} = \\mathcal{T}_{\\text{slendro}} \\times \\mathcal{T}_{\\text{pelog}} \\pmod{\\mathbb{Z}_N}"
    ],
    composers: ["Bela Bartok", "Colin McPhee", "Lou Harrison", "Harry Partch", "Toru Takemitsu", "Steve Reich", "A.J. Ellis"],
    theoreticians: ["Steven Feld", "John Blacking", "Bruno Nettl", "Alan Merriam", "Edward Said", "A.J. Ellis"],
    diagramTypes: ["ethno"]
  },
  film: {
    titleTemplates: [
      "Leitmotif Networks and [adjective] Diegesis in the Scores of [composer]",
      "Mickey-Mousing Vectors and the [adjective] [noun] in Golden Age Hollywood Cinema",
      "Ludomusicological Adaptive Layering: [buzzword] in the Interactive Works of [composer]",
      "Temporal Sync Points and [adjective] Thematic Transformation in [composer]'s [work]"
    ],
    nouns: ["leitmotif network", "diegetic permeability", "Mickey-mousing vector", "temporal sync point", "thematic transformation", "Hollywood chromaticism", "ludomusicological immersion", "adaptive audio layering", "diegetic transition", "narrative cue", "leitmotif node", "cross-modal sync", "interactive score branch", "tonal underscoring"],
    adjectives: ["leitmotivic", "diegetic", "ludomusicological", "sync-point-based", "chromatic", "narrative", "cross-modal", "adaptive", "interactive", "Hollywood-style", "cinematic", "underscored", "transformational"],
    verbs: ["underscores", "transforms", "syncs", "permeates", "leitmotif-maps", "triggers", "narrates", "dramatizes", "transitions", "modulates", "bridges", "amplifies"],
    buzzwords: ["diegetic boundary permeability coefficient", "ludomusicological adaptive audio layering", "leitmotif node connectivity index", "Hollywood-style chromatic voice leading", "temporal cross-modal sync vector"],
    equations: [
      "\\mathcal{T}_{\\text{sync}}(f) = \\int_{t_{\\text{cue}}}^{t_{\\text{cut}}} \\| \\mathbf{V}_{\\text{visual}}(t) - \\mathbf{M}_{\\text{music}}(t) \\|_2 \\, dt",
      "\\mathcal{L}_{\\text{network}} = \\mathbf{N}_{\\text{leitmotif}} \\times \\mathbf{E}_{\\text{relationship}} \\cdot \\gamma_{\\text{diegesis}}",
      "\\mathbf{S}_{\\text{branch}} = \\mathbf{P}_{\\text{state}} \\cdot \\mathbf{M}_{\\text{transition}} \\pmod{\\Phi_{\\text{ludo}}}",
      "\\Delta_{ilm} = \\frac{\\partial \\text{Drama}}{\\partial \\text{Tritone}} \\cdot \\mathbf{C}_{\\text{Hollywood}}"
    ],
    composers: ["John Williams", "Bernard Herrmann", "Max Steiner", "Erich Wolfgang Korngold", "Nobuo Uematsu", "Hans Zimmer", "Jerry Goldsmith", "Koji Kondo"],
    theoreticians: ["Claudia Gorbman", "Michel Chion", "Adorno & Eisler", "Royal S. Brown", "Philip Tagg", "Kofi Agawu"],
    diagramTypes: ["film"]
  },
  cognitive: {
    titleTemplates: [
      "Auditory Scene Analysis and [adjective] [noun] in the Perception of [composer]'s [work]",
      "Cognitive Constraints on [adjective] Processing: Evidence from [composer]",
      "Memory, Expectation, and the [adjective] [noun]: A Cognitive Approach to [composer]",
      "Schema Theory and [buzzword] in the Listening Experience of [composer]"
    ],
    nouns: ["auditory stream", "cognitive schema", "perceptual grouping", "melodic expectancy", "chunking mechanism", "working memory load", "gestalt principle", "prototypicality gradient", "categorical perception", "tonal hierarchy", "event segmentation", "implicit learning", "attentional spotlight", "predictive coding"],
    adjectives: ["cognitive", "perceptual", "gestalt-based", "schema-driven", "attentional", "prototypical", "expectancy-based", "cross-modal", "embodied", "predictive", "hierarchical", "statistical"],
    verbs: ["segments", "groups", "chunks", "predicts", "encodes", "retrieves", "attends to", "categorizes", "anticipates", "violates", "confirms", "modulates"],
    buzzwords: ["perceptual fluency gradient", "statistical learning mechanism", "predictive coding violation", "cross-modal auditory-visual binding", "implicit tonal knowledge structure", "event boundary detection threshold"],
    equations: [
      "P(\\text{note}_i | \\text{context}) = \\frac{e^{\\beta \\cdot \\text{TP}(i)}}{\\sum_j e^{\\beta \\cdot \\text{TP}(j)}}",
      "\\mathcal{E}_{\\text{surprise}} = -\\log_2 P(\\text{event} | \\text{schema}_{t-1})",
      "d'(\\text{tonal}, \\text{atonal}) = \\frac{\\mu_T - \\mu_A}{\\sqrt{\\frac{1}{2}(\\sigma_T^2 + \\sigma_A^2)}}",
      "\\mathbf{W}_{\\text{attention}} = \\text{softmax}\\left(\\frac{\\mathbf{Q}\\mathbf{K}^T}{\\sqrt{d_k}}\\right) \\cdot \\mathbf{V}_{\\text{auditory}}"
    ],
    composers: ["W.A. Mozart", "J.S. Bach", "Arnold Schoenberg", "Steve Reich", "Philip Glass", "John Cage", "Bela Bartok"],
    theoreticians: ["Diana Deutsch", "David Huron", "Carol Krumhansl", "Jamshed Bharucha", "Aniruddh Patel", "Fred Lerdahl", "Emmanuel Bigand"],
    diagramTypes: ["algorithmic"]
  },
  performance: {
    titleTemplates: [
      "Tempo Rubato and [adjective] [noun] in Historical Recordings of [composer]'s [work]",
      "The [adjective] Gesture: Embodied Knowledge and [buzzword] in Performance Practice",
      "Micro-Timing Deviations and the [adjective] [noun] of [composer] Interpretations",
      "From Score to Sound: [adjective] [noun] and the Hermeneutics of Performance"
    ],
    nouns: ["tempo rubato", "agogic accent", "micro-timing deviation", "dynamic shaping", "performative gesture", "interpretive tradition", "historical recording", "embodied knowledge", "expressive timing", "performance practice", "kinesthetic awareness", "somatic memory", "phrasing arc", "vibrato envelope"],
    adjectives: ["performative", "kinesthetic", "somatic", "historically informed", "expressive", "interpretive", "gestural", "micro-temporal", "embodied", "tradition-bound", "idiosyncratic", "rhetorical"],
    verbs: ["shapes", "inflects", "breathes", "stretches", "compresses", "articulates", "embodies", "interprets", "realizes", "ornaments", "personalizes", "rhetoricizes"],
    buzzwords: ["expressive micro-timing profile", "kinesthetic gesture mapping", "historically informed performance dialectic", "somatic knowledge transmission", "interpretive fingerprint analysis", "agogic accent distribution matrix"],
    equations: [
      "\\Delta t_{\\text{rubato}}(n) = t_{\\text{performed}}(n) - t_{\\text{metronomic}}(n)",
      "\\mathcal{G}_{\\text{gesture}} = \\int_{t_1}^{t_2} \\left| \\frac{d\\,\\text{tempo}(t)}{dt} \\right| dt",
      "\\sigma_{\\text{timing}} = \\sqrt{\\frac{1}{N}\\sum_{i=1}^N (\\Delta t_i - \\overline{\\Delta t})^2}",
      "\\mathbf{P}_{\\text{style}} = \\text{PCA}\\left(\\left[\\vec{v}_{\\text{tempo}}, \\vec{v}_{\\text{dynamics}}, \\vec{v}_{\\text{articulation}}\\right]\\right)"
    ],
    composers: ["Frederic Chopin", "J.S. Bach", "Ludwig van Beethoven", "Franz Schubert", "Claude Debussy", "Glenn Gould", "Sviatoslav Richter"],
    theoreticians: ["Nicholas Cook", "Daniel Leech-Wilkinson", "John Rink", "Richard Taruskin", "Robert Philip", "Dorottya Fabian"],
    diagramTypes: ["spectral"]
  },
  popular: {
    titleTemplates: [
      "Harmonic Syntax and [adjective] [noun] in the [adjective] Songwriting of [composer]",
      "The [adjective] Hook: [buzzword] and Structural Repetition in [composer]",
      "Production as Composition: [adjective] [noun] in the Studio Works of [composer]",
      "Genre Hybridity and [adjective] [noun]: Toward an Analysis of [composer]'s [work]"
    ],
    nouns: ["harmonic loop", "hook structure", "production layer", "timbral palette", "rhythmic groove", "formal module", "vocal melody", "bass pattern", "chorus-verse transition", "bridge interpolation", "drop structure", "sample interpolation", "auto-tune artifact", "sidechain compression"],
    adjectives: ["popular", "vernacular", "hook-driven", "production-centric", "genre-fluid", "loop-based", "timbrally complex", "rhythmically stratified", "digitally mediated", "commercially viable", "cross-platform", "algorithmically curated"],
    verbs: ["hooks", "loops", "samples", "layers", "drops", "grooves", "interpolates", "produces", "curates", "remixes", "compresses", "modulates"],
    buzzwords: ["hook density coefficient", "timbral stratification index", "algorithmic playlist positioning", "cross-genre hybridity metric", "production-as-composition paradigm", "vocal processing chain analysis"],
    equations: [
      "\\mathcal{H}_{\\text{hook}} = \\frac{\\text{repetition}(m)}{\\text{duration}(m)} \\cdot \\text{salience}(m)",
      "\\mathbf{T}_{\\text{timbre}} = \\text{MFCC}(\\text{track}_i) \\otimes \\mathbf{W}_{\\text{production}}",
      "\\text{Groove}_{\\text{index}} = \\sum_{k=1}^{4} \\left| \\text{onset}_k - \\text{grid}_k \\right| \\cdot w_k",
      "\\mathcal{V}_{\\text{virality}} = \\alpha \\cdot \\text{hook} + \\beta \\cdot \\text{timbre} + \\gamma \\cdot \\text{algorithm}"
    ],
    composers: ["Brian Wilson", "Stevie Wonder", "Kate Bush", "Radiohead", "Björk", "Kendrick Lamar", "Taylor Swift", "J Dilla", "Prince", "David Bowie"],
    theoreticians: ["Robert Walser", "Susan McClary", "Mark Spicer", "John Covach", "Walter Everett", "Nicole Biamonte", "Trevor de Clercq"],
    diagramTypes: ["jazzneo"]
  },
  opera: {
    titleTemplates: [
      "Vocal Tessitura and [adjective] [noun] in the Dramatic Architecture of [composer]'s [work]",
      "The [adjective] Aria: [buzzword] and Dramatic Temporality in [composer]",
      "Staging the [adjective] [noun]: Operatic Bodies and [buzzword] in [composer]'s [work]",
      "Orchestral Narration and the [adjective] [noun] in [composer]'s Dramatic Works"
    ],
    nouns: ["vocal tessitura", "dramatic arc", "aria form", "recitative texture", "leitmotivic web", "orchestral narration", "stage direction", "character transformation", "dramatic tempo", "vocal register", "ensemble architecture", "cabaletta structure", "scena complex", "vocal fach"],
    adjectives: ["operatic", "dramatic", "vocal", "theatrical", "staged", "narrative", "character-driven", "orchestral-vocal", "melodramatic", "scenic", "diegetic", "performative"],
    verbs: ["dramatizes", "stages", "narrates", "sings", "transforms", "orchestrates", "embodies", "enacts", "theatricalizes", "vocalizes", "characterizes"],
    buzzwords: ["dramatic tessitura mapping", "orchestral-vocal narrative layer", "character leitmotif network", "scenic temporality distortion", "vocal fach as dramatic parameter", "melodramatic gesture analysis"],
    equations: [
      "\\mathcal{D}_{\\text{drama}}(t) = \\sum_{v \\in \\text{voices}} \\text{tessitura}(v,t) \\cdot \\text{orch}(t)",
      "\\mathbf{L}_{\\text{leitmotif}} = \\mathbf{A}_{\\text{character}} \\times \\mathbf{E}_{\\text{dramatic}} \\cdot \\gamma",
      "\\Delta_{\\text{tempo}} = \\frac{\\partial \\text{dramatic tension}}{\\partial \\text{vocal register}}",
      "\\mathcal{S}_{\\text{scena}} = \\int_{\\text{recit}}^{\\text{cabaletta}} \\mathbf{V}(t) \\otimes \\mathbf{O}(t) \\, dt"
    ],
    composers: ["Giuseppe Verdi", "Richard Wagner", "W.A. Mozart", "Giacomo Puccini", "Claudio Monteverdi", "Richard Strauss", "Benjamin Britten", "George Frideric Handel"],
    theoreticians: ["Carolyn Abbate", "Lawrence Kramer", "Joseph Kerman", "Martha Feldman", "Gary Tomlinson", "David Levin"],
    diagramTypes: ["film"]
  },
  gender: {
    titleTemplates: [
      "Queering the [adjective] [noun]: Gender, Sexuality, and [buzzword] in [composer]",
      "The [adjective] Body: Feminist Readings of [noun] and [buzzword] in [composer]'s [work]",
      "Masculinity, Virtuosity, and the [adjective] [noun] in [composer]",
      "Beyond Binary Tonality: [adjective] [noun] and Queer Listening in [composer]"
    ],
    nouns: ["gendered voice", "queer listening practice", "feminist hermeneutic", "patriarchal structure", "performative identity", "embodied subjectivity", "heteronormative form", "camp aesthetic", "drag performativity", "intersectional analysis", "affective economy", "somatic resistance", "vocal gendering", "desire structure"],
    adjectives: ["queer", "feminist", "intersectional", "gendered", "performative", "subversive", "camp", "affective", "embodied", "heteronormative", "non-binary", "deconstructive"],
    verbs: ["queers", "subverts", "performs", "embodies", "resists", "deconstructs", "interrogates", "reclaims", "destabilizes", "reconfigures", "affects", "disrupts"],
    buzzwords: ["queer temporal drag", "feminist counter-hearing", "affective economy of desire", "intersectional voice analysis", "camp performativity index", "heteronormative formal disruption"],
    equations: [
      "\\mathcal{Q}_{\\text{queer}} = \\frac{\\text{subversion}(\\text{form})}{\\text{normativity}(\\text{genre})} \\cdot \\mathbf{I}_{\\text{identity}}",
      "\\mathbf{G}_{\\text{gender}} = \\text{performance}(\\text{body}) \\otimes \\text{reception}(\\text{audience})",
      "\\Delta_{\\text{desire}} = \\nabla_{\\text{affect}} \\times \\mathbf{V}_{\\text{vocal}}",
      "\\Psi_{\\text{camp}} = \\sum_{i=1}^{n} \\frac{\\text{excess}(i)}{\\text{sincerity}(i)} \\cdot w_i"
    ],
    composers: ["Benjamin Britten", "Tchaikovsky", "Aaron Copland", "Ethel Smyth", "Hildegard von Bingen", "Nadia Boulanger", "Pauline Oliveros", "Julius Eastman"],
    theoreticians: ["Susan McClary", "Judith Butler", "Eve Kosofsky Sedgwick", "Fred Maus", "Philip Brett", "Elizabeth Wood", "Suzanne Cusick"],
    diagramTypes: ["posttonal"]
  },
  disability: {
    titleTemplates: [
      "Deafness, Hearing, and the [adjective] [noun]: Rethinking [composer] Through Disability Studies",
      "The [adjective] Body in [composer]'s [work]: [buzzword] and the Politics of Access",
      "Crip Temporalities and the [adjective] [noun] in the Music of [composer]",
      "Beyond Normal Hearing: [adjective] [noun] and [buzzword] in [composer]"
    ],
    nouns: ["deaf gain", "crip temporality", "access aesthetic", "disability metaphor", "prosthetic listening", "neurodivergent form", "chronic rhythm", "mad pride", "accommodation structure", "normative hearing", "sensory difference", "embodied limitation", "adaptive technique", "access intimacy"],
    adjectives: ["crip", "deaf", "neurodivergent", "prosthetic", "adaptive", "non-normative", "access-oriented", "sensory-different", "chronically", "mad", "disabled", "accommodating"],
    verbs: ["accommodates", "adapts", "resists", "reframes", "accesses", "diverges", "reimagines", "crips", "problematizes", "embodies", "transforms", "reorients"],
    buzzwords: ["deaf gain in compositional practice", "crip temporality as formal parameter", "neurodivergent listening strategy", "prosthetic auditory extension", "access aesthetic framework", "normative hearing deconstruction"],
    equations: [
      "\\mathcal{A}_{\\text{access}} = \\frac{\\text{accommodation}(\\text{body})}{\\text{normativity}(\\text{space})} \\cdot \\mathbf{D}_{\\text{difference}}",
      "\\mathbf{T}_{\\text{crip}} = \\text{duration}_{\\text{lived}} - \\text{duration}_{\\text{expected}}",
      "\\Delta_{\\text{hearing}} = \\nabla_{\\text{deaf}} \\oplus \\nabla_{\\text{hearing}}",
      "\\Psi_{\\text{neurodiv}} = \\sum \\frac{\\text{divergence}(i)}{\\text{conformity}(i)} \\cdot \\mathbf{W}_{\\text{access}}"
    ],
    composers: ["Ludwig van Beethoven", "Robert Schumann", "Hildegard von Bingen", "Evelyn Glennie", "Paul Wittgenstein", "Melissa Dunphy", "Charles Ives"],
    theoreticians: ["Joseph Straus", "Rosemarie Garland-Thomson", "Tobin Siebers", "Sami Schalk", "Stefan Sunandan Honisch", "Blake Howe"],
    diagramTypes: ["spectral"]
  },
  tech: {
    titleTemplates: [
      "Algorithmic Curation and [adjective] [noun]: How [buzzword] Shapes the Listening of [composer]",
      "Machine Listening and the [adjective] [noun]: AI-Generated Analysis of [composer]'s [work]",
      "Digital Audio Workstations as [adjective] [noun]: Production Epistemologies in [composer]",
      "Neural Networks and [adjective] [noun]: Computational Approaches to [composer]"
    ],
    nouns: ["algorithmic curation", "machine listening", "neural network", "digital audio workstation", "MIDI protocol", "audio plugin chain", "streaming platform", "recommendation engine", "spectral analysis", "feature extraction", "training dataset", "generative model", "latency buffer", "sample rate conversion"],
    adjectives: ["computational", "algorithmic", "machine-learned", "digitally mediated", "neural", "data-driven", "platform-dependent", "AI-assisted", "automated", "real-time", "cloud-based", "quantized"],
    verbs: ["computes", "trains", "generates", "curates", "streams", "quantizes", "processes", "automates", "classifies", "recommends", "synthesizes", "optimizes"],
    buzzwords: ["algorithmic curation feedback loop", "machine listening classification boundary", "neural style transfer in composition", "platform-dependent listening behavior", "DAW-as-instrument epistemology", "feature extraction bias analysis"],
    equations: [
      "\\mathcal{L}_{\\text{loss}} = -\\sum_{c=1}^{C} y_c \\log(\\hat{y}_c) \\quad \\text{(cross-entropy for genre classification)}",
      "\\mathbf{z} = \\text{Encoder}(\\mathbf{x}_{\\text{audio}}); \\quad \\hat{\\mathbf{x}} = \\text{Decoder}(\\mathbf{z})",
      "\\text{Attention}(Q,K,V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V",
      "\\mathcal{R}_{\\text{rec}} = \\mathbf{U}_{\\text{user}} \\cdot \\mathbf{V}_{\\text{track}}^T + \\lambda \\cdot \\text{collab}"
    ],
    composers: ["Holly Herndon", "Amon Tobin", "Arca", "Oneohpointix Never", "Flying Lotus", "Sophie", "Kraftwerk", "Brian Eno"],
    theoreticians: ["Nick Seaver", "Tero Parviainen", "Ge Wang", "Jonathan Berger", "Robert Henke", "Christine D'Ercole"],
    diagramTypes: ["algorithmic"]
  },
  mathmusic: {
    titleTemplates: [
      "Group-Theoretic Structures and [adjective] [noun] in the Music of [composer]",
      "Topological Approaches to [adjective] [noun]: A Mathematical Model of [composer]'s [work]",
      "Category Theory and [adjective] [noun]: Toward a Unified Framework for [composer]",
      "Graph-Theoretic [noun] and [buzzword] in [composer]'s Compositional Practice"
    ],
    nouns: ["group action", "topological space", "category", "functor", "graph isomorphism", "knot invariant", "braid group", "homology class", "manifold", "fiber bundle", "symmetry group", "orbit space", "quotient structure", "lattice embedding"],
    adjectives: ["group-theoretic", "topological", "categorical", "graph-theoretic", "homological", "manifold-based", "symmetric", "quotient", "fibered", "braided", "knot-theoretic", "lattice-theoretic"],
    verbs: ["maps", "transforms", "quotients", "embeds", "fibers", "braids", "homologizes", "categorifies", "symmetrizes", "topologizes", "knots", "lattices"],
    buzzwords: ["topological voice-leading manifold", "categorical music theory functor", "graph-theoretic harmonic network", "braid group rhythmic structure", "homological form analysis", "fiber bundle modulation space"],
    equations: [
      "\\mathcal{T}_{\\text{voice}} = \\mathbb{R}^n / S_n \\cong \\text{Orbifold}_{\\text{chord}}",
      "\\text{Hom}(\\mathcal{C}_{\\text{music}}, \\mathcal{D}_{\\text{analysis}}) \\cong \\text{Nat}(F, G)",
      "\\pi_1(\\mathcal{M}_{\\text{modulation}}) \\cong \\mathbb{Z}_{12} \\times \\mathbb{Z}_2",
      "H_k(\\mathcal{K}_{\\text{harmonic}}) = \\ker(\\partial_k) / \\text{im}(\\partial_{k+1})"
    ],
    composers: ["J.S. Bach", "Arnold Schoenberg", "Iannis Xenakis", "Milton Babbitt", "György Ligeti", "Elliott Carter", "Conlon Nancarrow"],
    theoreticians: ["Dmitri Tymoczko", "Thomas Noll", "Mariana Montiel", "Guerino Mazzola", "Franck Jedrzejewski", "Moreno Andreatta"],
    diagramTypes: ["posttonal"]
  },
  politics: {
    titleTemplates: [
      "Hegemony, Resistance, and the [adjective] [noun]: Political Readings of [composer]'s [work]",
      "The [adjective] State: Music, Power, and [buzzword] in the Era of [composer]",
      "Decolonizing the [adjective] [noun]: [buzzword] and the Politics of [composer]",
      "Neoliberal Harmonies: [adjective] [noun] and the Political Economy of [composer]"
    ],
    nouns: ["hegemonic discourse", "resistance practice", "colonial soundscape", "political economy", "cultural capital", "state apparatus", "ideological formation", "subaltern voice", "revolutionary form", "dissident harmony", "institutional critique", "biopolitical rhythm", "sovereign melody", "proletarian counterpoint"],
    adjectives: ["hegemonic", "subaltern", "revolutionary", "dissident", "decolonial", "biopolitical", "neoliberal", "institutional", "sovereign", "proletarian", "anti-colonial", "emancipatory"],
    verbs: ["resists", "subverts", "colonizes", "decolonizes", "hegemonizes", "emancipates", "dissents", "mobilizes", "politicizes", "institutionalizes", "revolutionizes", "appropriates"],
    buzzwords: ["decolonial listening practice", "hegemonic tonal discourse", "biopolitical rhythm analysis", "subaltern voice reclamation", "neoliberal playlist economy", "revolutionary form as political action"],
    equations: [
      "\\mathcal{P}_{\\text{power}} = \\frac{\\text{hegemony}(\\text{institution})}{\\text{resistance}(\\text{subaltern})} \\cdot \\mathbf{C}_{\\text{capital}}",
      "\\mathbf{D}_{\\text{decolonial}} = \\nabla_{\\text{colonial}} \\times \\mathbf{R}_{\\text{resistance}}",
      "\\Delta_{\\text{ideology}} = \\sum_{i=1}^{n} \\frac{\\text{discourse}(i)}{\\text{material}(i)} \\cdot w_i",
      "\\Psi_{\\text{revolution}} = \\int_{\\text{oppression}}^{\\text{liberation}} \\mathbf{M}(t) \\otimes \\mathbf{S}(t) \\, dt"
    ],
    composers: ["Dmitri Shostakovich", "Hanns Eisler", "Fela Kuti", "Victor Jara", "Miriam Makeba", "Cornelius Cardew", "Luigi Nono", "Paul Robeson"],
    theoreticians: ["Theodor Adorno", "Jacques Attali", "Georgina Born", "Susan McClary", "Philip Bohlman", "Ana Maria Ochoa Gautier"],
    diagramTypes: ["ethno"]
  },
  reception: {
    titleTemplates: [
      "The Afterlife of [composer]'s [work]: [adjective] [noun] and the Construction of Meaning",
      "Critical Fortunes and the [adjective] [noun]: A Reception History of [composer]",
      "Listening Communities and [adjective] [noun]: How [composer]'s [work] Was Heard",
      "Canon Formation and [adjective] [noun]: The Institutional Life of [composer]"
    ],
    nouns: ["reception history", "critical fortune", "listening community", "canon formation", "interpretive tradition", "performance lineage", "editorial tradition", "critical edition", "scholarly consensus", "popular reception", "institutional memory", "historiographical narrative", "aesthetic judgment", "taste formation"],
    adjectives: ["reception-historical", "canonical", "institutional", "historiographical", "interpretive", "critical", "popular", "scholarly", "editorial", "performative", "aesthetic", "communal"],
    verbs: ["receives", "interprets", "canonizes", "marginalizes", "revives", "reassesses", "edits", "performs", "critiques", "institutionalizes", "remembers", "forgets"],
    buzzwords: ["reception trajectory analysis", "canonical consensus formation", "listening community boundary", "historiographical narrative construction", "editorial tradition bias", "taste formation mechanism"],
    equations: [
      "\\mathcal{R}_{\\text{reception}}(t) = \\sum_{i=1}^{n} w_i \\cdot \\text{critique}_i(t) \\cdot \\text{influence}_i",
      "\\mathbf{C}_{\\text{canon}} = \\lim_{t \\to \\infty} \\frac{\\text{performances}(t)}{\\text{publications}(t)}",
      "\\Delta_{\\text{fortune}} = \\int_{\\text{premiere}}^{\\text{present}} \\frac{d\\,\\text{reputation}}{dt} \\, dt",
      "\\Psi_{\\text{community}} = \\mathbf{L}_{\\text{listening}} \\otimes \\mathbf{I}_{\\text{institutional}}"
    ],
    composers: ["J.S. Bach", "Ludwig van Beethoven", "Claudio Monteverdi", "Gustav Mahler", "Igor Stravinsky", "Arnold Schoenberg", "Hildegard von Bingen"],
    theoreticians: ["Carl Dahlhaus", "Leo Treitler", "Gary Tomlinson", "Martha Feldman", "James Hepokoski", "Reinhold Brinkmann"],
    diagramTypes: ["medieval"]
  },
  embodied: {
    titleTemplates: [
      "Gesture, Movement, and [adjective] [noun]: An Embodied Analysis of [composer]'s [work]",
      "The [adjective] Body in Motion: [buzzword] and Kinesthetic Meaning in [composer]",
      "Proprioception and [adjective] [noun]: How the Body Knows [composer]'s [work]",
      "Mirror Neurons and [adjective] [noun]: The Neurophenomenology of [composer]"
    ],
    nouns: ["kinesthetic gesture", "proprioceptive map", "motor schema", "mirror neuron response", "embodied metaphor", "somatic marker", "movement phrase", "postural alignment", "breath cycle", "tactile feedback", "vestibular orientation", "sensorimotor coupling", "kinesthetic empathy", "body schema"],
    adjectives: ["embodied", "kinesthetic", "proprioceptive", "sensorimotor", "somatic", "tactile", "vestibular", "motor-based", "neurophenomenological", "gestural", "corporeal", "haptic"],
    verbs: ["moves", "gestures", "breathes", "aligns", "couples", "mirrors", "feels", "propriocepts", "empathizes", "orients", "inhabits", "somaticizes"],
    buzzwords: ["kinesthetic empathy mapping", "sensorimotor coupling analysis", "proprioceptive phrase structure", "mirror neuron musical response", "somatic marker distribution", "embodied metaphor extraction"],
    equations: [
      "\\mathcal{K}_{\\text{kinesthetic}} = \\int_{t_1}^{t_2} \\left\\| \\vec{v}_{\\text{gesture}}(t) \\right\\| \\cdot \\text{salience}(t) \\, dt",
      "\\mathbf{M}_{\\text{mirror}} = \\text{activation}(\\text{observer}) \\otimes \\text{activation}(\\text{performer})",
      "\\Delta_{\\text{proprio}} = \\nabla_{\\text{body}} \\times \\mathbf{S}_{\\text{score}}",
      "\\Psi_{\\text{empathy}} = \\sum_{i=1}^{n} \\frac{\\text{mirroring}(i)}{\\text{distance}(i)} \\cdot w_i"
    ],
    composers: ["Meredith Monk", "Steve Reich", "John Cage", "Alvin Lucier", "Pauline Oliveros", "Tan Dun", "Kaija Saariaho"],
    theoreticians: ["Rolf Inge Godoy", "Marc Leman", "Lawrence Zbikowski", "Arnie Cox", "David Huron", "Shaun Gallagher"],
    diagramTypes: ["spectral"]
  },
  worldanalysis: {
    titleTemplates: [
      "Modal Systems and [adjective] [noun]: A Comparative Analysis of [composer] and [composer]",
      "Rhythmic Cycles and [adjective] [noun]: Cross-Cultural Perspectives on [composer]",
      "Tuning, Temperament, and [adjective] [noun]: [buzzword] in the Music of [composer]",
      "Oral Tradition and [adjective] [noun]: Analytical Challenges in [composer]'s [work]"
    ],
    nouns: ["modal system", "rhythmic cycle", "tuning tradition", "oral transmission", "improvisational framework", "drone structure", "melodic mode", "tala cycle", "maqam progression", "gamelan pathet", "polyrhythmic layer", "call-and-response pattern", "microtonal inflection", "heterophonic texture"],
    adjectives: ["cross-cultural", "modal", "improvisational", "oral", "heterophonic", "polyrhythmic", "microtonal", "drone-based", "tradition-specific", "comparative", "intercultural", "transnational"],
    verbs: ["improvises", "cycles", "drones", "ornaments", "transmits", "varies", "intertwines", "responds", "modulates", "heterophonizes", "crosses", "bridges"],
    buzzwords: ["cross-cultural modal comparison", "polyrhythmic layer interaction", "oral transmission fidelity metric", "microtonal inflection mapping", "heterophonic texture analysis", "improvisational framework constraint"],
    equations: [
      "\\mathcal{M}_{\\text{mode}} = \\left\\{ p_i \\in \\mathbb{Z}_{1200} \\mid \\text{interval}(p_i, p_{i+1}) \\in \\text{tradition} \\right\\}",
      "\\mathbf{T}_{\\text{tala}} = \\mathbb{Z}_n \\times \\mathbb{Z}_m \\quad \\text{(cross-rhythm product space)}",
      "\\Delta_{\\text{cent}} = 1200 \\log_2\\left(\\frac{f_{\\text{tradition}}}{f_{\\text{ET}}}\\right)",
      "\\Psi_{\\text{oral}} = \\sum_{g=1}^{G} \\frac{\\text{fidelity}(g)}{\\text{variation}(g)} \\cdot \\mathbf{W}_{\\text{tradition}}"
    ],
    composers: ["Ravi Shankar", "Ali Akbar Khan", "Nusrat Fateh Ali Khan", "Fela Kuti", "Toumani Diabate", "Umm Kulthum", "Kishori Amonkar", "Egberto Gismonti"],
    theoreticians: ["Bruno Nettl", "Timothy Rice", "Kay Kaufman Shelemay", "Martin Clayton", "Richard Widdess", "Bonnie Wade"],
    diagramTypes: ["ethno"]
  }
};

// General academic verbs, nouns, and template sentences to bind everything together
const GENERAL_VERBS = [
  "substantiates", "problematizes", "reifies", "explicates", "delineates", "circumscribes",
  "deconstructs", "foregrounds", "synthesizes", "interrogates", "unpacks", "enunciates",
  "historicizes", "formalizes", "co-opts", "crystallizes", "illuminates", "posits"
];

const GENERAL_NOUNS = [
  "epistemology", "hermeneutics", "teleology", "ontology", "heuristic", "paradigmatic shift",
  "sublation", "structural integrity", "isomorphism", "semiotic matrix", "aesthetic paradigm",
  "dialectical tension", "discursive space", "methodological framework", "ontological status",
  "axiology", "phenomenology", "liminality"
];

const GENERAL_ADJECTIVES = [
  "hermeneutic", "epistemological", "paradigmatic", "teleological", "liminal", "dialectical",
  "heuristical", "isomorphic", "semiotic", "axiologic", "phenomenological", "heuristic",
  "epistemic", "heuristic", "ontological", "discursive", "post-structuralist", "heuristic"
];

const CONNECTIVE_PHRASES = [
  "Consequently, we must observe that",
  "By extending the classical paradigm, it becomes evident that",
  "As demonstrated in the preliminary formulations of [theoretician],",
  "This mapping stands in stark ontological contrast to",
  "A critical reading of this passage suggests that",
  "Crucially, the underlying tension here lies in how",
  "In terms of pure structural syntax, this leads directly to",
  "Such an articulation effectively bridges the gap between",
  "Thus, the mathematical formalization of this parameter reveals that",
  "Without loss of generality, we may assume that",
  "Therefore, the recursive nature of this configuration implies that",
  "It is precisely this structural ambiguity that enables",
  "Interestingly, when subjected to rigorous set-theoretic filtering, we find that"
];

// Graduated drift content pools — each tier represents escalating levels of conceptual slippage

// Tier 1: Subtle Drift (20-40%) — unusual but still coherent metaphors
const DRIFT_SUBTLE = [
  "the almost liturgical quality of its voice-leading gestures",
  "what one might term the archaeology of its harmonic substrata",
  "a quasi-geological sedimentation of thematic material",
  "the cartographic logic underlying its formal architecture",
  "the botanical unfolding of its motivic germ-cells",
  "a kind of acoustic palimpsest, in which earlier layers remain partially legible beneath the surface"
];

// Tier 2: Noticeable Drift (40-60%) — cross-field contamination, paranoia begins
const DRIFT_NOTICEABLE = [
  "the cryptographic structure embedded within the work's opening measures — a pattern that has gone entirely unremarked in the secondary literature",
  "a hidden symmetry that, once perceived, cannot be unseen, and which raises troubling questions about the editorial tradition",
  "the strange resonance between this passage and certain phenomena in contemporary quantum chromodynamics, a parallel which we do not assert but cannot in good conscience suppress",
  "a recurring numerical pattern (the so-called 'Schenker-Fibonacci sequence') whose presence in the score can only be described as uncanny",
  "the suspicious absence of any discussion of this passage in the standard commentaries — an omission that we find difficult to attribute to mere oversight",
  "the work's apparent anticipation of analytical frameworks that would not be formalized for another century"
];

// Tier 3: Significant Drift (60-80%) — self-reference, digressions, first-person intrusions
const DRIFT_SIGNIFICANT = [
  "at this point I must confess to a certain vertigo before the material — a vertigo that, I suspect, the composer himself experienced during the composition of this passage",
  "I should note that Reviewer 2 of a previous draft of this article raised an objection here that I found both cogent and, ultimately, irrelevant to the deeper structural truth at stake",
  "the reader who has followed the argument this far will perhaps understand why I have been reluctant, until now, to state my central thesis in explicit terms",
  "it is difficult to write about this passage without a sense of trespassing upon something that was never intended for public scrutiny",
  "the present author has, over the course of fifteen years of work on this problem, come to suspect that the standard analytical categories are not merely inadequate but actively misleading",
  "I dreamt of this passage last night, and in the dream the voice-leading resolved in a manner that I have since verified in the score"
];

// Tier 4: Full Breakdown (80-100%) — fragmentation, cosmic themes, hallucinated voices
const DRIFT_BREAKDOWN = [
  "the score whispers to those who know how to listen — and what it whispers is not, strictly speaking, musical",
  "I have begun to suspect that the work itself is aware of being analyzed, and has modified its own structure in response",
  "the voice-leading here is not merely structural but prophetic — it anticipates events in the life of the analyst with an accuracy that defies rational explanation",
  "it is necessary at this point to abandon the pretense of scholarly detachment: the music is alive, and it is watching us",
  "the numbers in the measure numbering system, when read as a sequence, yield a message whose implications I am not yet prepared to disclose in a peer-reviewed venue",
  "this passage was dictated to me in a dream by an entity that identified itself as the spirit of Riemann, though I cannot verify this attribution",
  "the tonal center of this passage corresponds, by a series of conversions I have documented elsewhere, to the precise coordinates of an undisclosed archaeological site",
  "the work, in its deepest structural layer, is not a composition at all but a cipher — a message from a composer who may not, in any conventional sense, have existed"
];

// Legacy high-madness additions (used for the discourse density feature)
const MADNESS_ADDITIONS = [
  "the trans-dimensional implications of medieval quantum gravity",
  "a time-traveling voice-leading matrix",
  "the sub-atomic deconstruction of the dominant seventh chord via dark energy",
  "hyper-dimensional dodecaphonic string theory",
  "the teleological integration of alien spectral acoustics",
  "a 24-dimensional Tonnetz projection onto a Mobius strip",
  "Archduke Hildegard von Babbit-Webern's lost algorithmic treatises",
  "the psychoacoustic roughness of absolute silence",
  "hegemonic post-tonal microtonal gamelan synthesis rules",
  "Mickey-mousing vectors aligned with gravitational wave frequencies",
  "the Schrodinger equation applied to Schenkerian Urlinien",
  "stochastic Markov-chain rituals of localized geophonic entities",
  "the musicality of inter-stellar cosmic microwave background radiation",
  "neo-Riemannian PLR-transmutations into parallel universes"
];

const WORKS = [
  "Opus [num]",
  "Symphony No. [num]",
  "String Quartet in [key] major, Op. [num]",
  "Sonata [num] ('[subtitle]')",
  "Mass for [num] Voices",
  "Concerto for [instrument] and [instrument]",
  "Chamber Concerto No. [num] ('[subtitle]')",
  "Metamorphosis [num] on [theoretician]'s Theme",
  "Prelude and Fugue No. [num] in [key] minor"
];

const KEYS = ["C", "D", "E", "F", "G", "A", "B", "C#", "Eb", "F#", "Ab", "Bb"];
const INSTRUMENTS = ["Prepared Piano", "Bass Clarinet", "Soprano Viola", "Trombone", "Digital Harpsichord", "Ondes Martenot", "Microtonal Accordion", "Tubular Bells"];
const SUBTITLES = ["The Quantum Ursatz", "Apostasy of the Triad", "The Inverted Hexachord", "Chthonic Soundscapes", "Spectral Incantations", "Lydian Dreamscapes", "The Isorhythmic Abyss"];

// Helper to generate works
function generateWorkName(random: SeededRandom, theoretician: string): string {
  const template = random.pick(WORKS);
  const num = random.nextInt(1, 142);
  const key = random.pick(KEYS);
  const instrument1 = random.pick(INSTRUMENTS);
  const instrument2 = random.pick(INSTRUMENTS);
  const subtitle = random.pick(SUBTITLES);

  return template
    .replace("[num]", num.toString())
    .replace("[key]", key)
    .replace("[instrument]", instrument1)
    .replace("[instrument]", instrument2) // Handles second instrument if needed
    .replace("[subtitle]", subtitle)
    .replace("[theoretician]", theoretician);
}

// Generates a scholarly sentence, optionally infused with discursive drift
function generateSentence(
  random: SeededRandom,
  fieldKey: string,
  madness: number,
  composers: string[],
  theoreticians: string[],
  work: string,
  drift: number = 0
): string {
  const field = FIELDS[fieldKey];
  const isMad = madness > 50 && random.next() * 100 < madness;
  
  const noun = random.pick(field.nouns);
  const adj = random.pick(field.adjectives);
  const verb = random.pick(field.verbs);
  const buzz = random.pick(field.buzzwords);
  
  const genNoun = random.pick(GENERAL_NOUNS);
  const genAdj = random.pick(GENERAL_ADJECTIVES);
  const genVerb = random.pick(GENERAL_VERBS);
  
  const comp = random.pick(composers);
  const theo = random.pick(theoreticians);
  const connect = random.pick(CONNECTIVE_PHRASES).replace("[theoretician]", theo);

  if (isMad) {
    const madConcept = random.pick(MADNESS_ADDITIONS);
    const madTemplates = [
      `By mapped projection of ${madConcept}, it is trivial to show that the ${adj} ${noun} is fundamentally unstable.`,
      `Indeed, this aligns with ${comp}'s late obsession with ${madConcept}, leading to a complete suspension of standard ${noun} laws.`,
      `${connect} the ${genAdj} ${noun} operates as a self-replicating agent of ${madConcept}.`,
      `This recursive loop represents a major ${genNoun} in which ${buzz} collapses into ${madConcept}.`,
      `Under elevated analytical parameters, the ${noun} undergoes a structural phase transition into ${madConcept}.`
    ];
    return random.pick(madTemplates);
  }

  // Standard academic sentence templates
  const templates = [
    `${connect} the ${adj} ${noun} ${verb} the ${genAdj} ${genNoun} of ${comp}'s ${work}.`,
    `In this context, the ${noun} does not merely ${verb} the music; rather, it ${genVerb} the very ${genNoun} of ${buzz}.`,
    `Thus, ${theo} argued that ${buzz} must be understood as a ${adj} ${noun} that ${verb} the ${genAdj} foreground.`,
    `This is particularly clear in the second movement of ${comp}'s ${work}, where the ${noun} ${verb} a series of ${adj} structural levels.`,
    `Through a ${genAdj} reading of ${buzz}, we discover how the ${noun} ${genVerb} the global ${genNoun} of the piece.`,
    `An examination of the ${adj} ${noun} shows that it ${verb} the ${genNoun} of the chordal progression, validating ${theo}'s claims.`,
    `If we formalize the ${noun} as a vector in ${buzz}, it becomes clear that ${comp}'s work ${genVerb} the classical boundaries of ${genNoun}.`
  ];

  const baseSentence = random.pick(templates);

  // Drift injection: append or splice drift phrases based on drift level
  if (drift < 20) return baseSentence;

  const driftRoll = random.next() * 100;

  if (drift < 40 && driftRoll < drift * 0.6) {
    // Subtle: append as a parenthetical or em-dash aside
    return baseSentence.replace(/\.$/, `, ${random.pick(DRIFT_SUBTLE)}.`);
  }
  if (drift < 60 && driftRoll < drift * 0.7) {
    // Noticeable: append as a new sentence
    return `${baseSentence} ${random.pick(DRIFT_NOTICEABLE)}.`;
  }
  if (drift < 80 && driftRoll < drift * 0.8) {
    // Significant: append a self-referential or paranoid addendum
    return `${baseSentence} ${random.pick(DRIFT_SIGNIFICANT)}.`;
  }
  if (driftRoll < drift) {
    // Full breakdown: append extreme content
    return `${baseSentence} ${random.pick(DRIFT_BREAKDOWN)}.`;
  }

  return baseSentence;
}

// Main generation engine
export interface CoAuthor {
  first: string;
  last: string;
  institution: string;
}

export function generatePaper(
  fieldKey: string,
  seed: string,
  madness: number,
  authorFirst: string,
  authorLast: string,
  institution: string,
  coauthors: CoAuthor[],
  length: number = 15,
  drift: number = 0
): GeneratedPaper {
  const random = new SeededRandom(seed || "music-theory-42");
  const field = FIELDS[fieldKey] || FIELDS.schenkerian;

  // Derive scaling factors from target page length (supports up to 120 pages)
  // ~300 words/page, ~3 sentences/paragraph, ~5 paragraphs/section, ~1 section/3 pages
  const paragraphsPerSection = Math.min(10, 2 + Math.floor(length / 10));
  const extraMiddleSections  = Math.max(0,  Math.floor((length - 12) / 5));
  const bibCount             = Math.min(60, 4 + Math.floor(length / 2));

  // drift is passed through to generateSentence, which handles injection directly

  // 1. Title Generation
  let titleTemplate = random.pick(field.titleTemplates);
  const activeComposers = [...field.composers];
  const activeTheoreticians = [...field.theoreticians];
  
  // Mix in other fields for high madness
  if (madness > 40) {
    const otherFields = Object.keys(FIELDS).filter(k => k !== fieldKey);
    const randomFieldKey = random.pick(otherFields);
    const otherField = FIELDS[randomFieldKey];
    activeComposers.push(...otherField.composers);
    activeTheoreticians.push(...otherField.theoreticians);
  }

  const paperComposer = random.pick(activeComposers);
  const paperTheoretician = random.pick(activeTheoreticians);
  const paperWork = generateWorkName(random, paperTheoretician);

  let title = titleTemplate
    .replace("[composer]", paperComposer)
    .replace("[work]", paperWork)
    .replace("[noun]", random.pick(field.nouns))
    .replace("[adjective]", random.pick(field.adjectives))
    .replace("[buzzword]", random.pick(field.buzzwords));

  if (madness > 75) {
    // Absolute chaos in the title
    title = title + `: A Study in ${random.pick(MADNESS_ADDITIONS)}`;
  }

  // 2. Authors List
  const authors = [{
    name: `${authorFirst || "Maxwell S."} ${authorLast || "Hargrave"}`,
    institution: institution || "Independent Researcher"
  }];

  // Add user-specified co-authors
  coauthors.forEach(ca => {
    if (ca.first && ca.last) {
      authors.push({
        name: `${ca.first} ${ca.last}`,
        institution: ca.institution || "Independent Researcher"
      });
    }
  });

  // If no co-authors specified, sometimes generate a scholarly co-author
  if (coauthors.length === 0 && random.next() > 0.5) {
    // Generate a scholarly-sounding co-author
    const firstNames = ["Edward", "Carl", "David", "Richard", "Suzannah", "Pieter", "Fred", "Nadia", "Hedi", "Jonathan"];
    const lastNames = ["Dahlhaus", "Schachter", "Lewin", "Cohn", "McClary", "van den Toorn", "Lerdahl", "Boulanger", "Siegel", "Bernard"];
    const insts = ["Department of Music, Harvard University", "Faculty of Music, University of Cambridge", "Department of Music Theory, Indiana University", "Department of Music, University of Chicago", "Conservatoire National Supérieur de Musique, Paris", "Department of Music, Stanford University", "Shepherd School of Music, Rice University", "Department of Music Theory, Yale University"];
    authors.push({
      name: `${random.pick(firstNames)} ${random.pick(lastNames)}`,
      institution: random.pick(insts)
    });
  }

  // Journal info
  const journals = [
    "Journal of Music Theory",
    "Music Theory Spectrum",
    "Music Analysis",
    "Perspectives of New Music",
    "Music Theory Online",
    "Intégral",
    "Indiana Theory Review",
    "Theory and Practice",
    "Journal of Music Theory Pedagogy",
    "Music Theory and Analysis"
  ];
  const journal = random.pick(journals);
  const volume = random.nextInt(12, 98);
  const issue = random.nextInt(1, 5);
  const year = random.nextInt(2020, 2027);
  const doi = `10.1093/jmta/${year}.${volume}.${issue}.${random.nextInt(1000, 9999)}`;

  // 3. Abstract Generation
  const abstractNouns = [...field.nouns, ...GENERAL_NOUNS];
  const abstractAdjectives = [...field.adjectives, ...GENERAL_ADJECTIVES];
  const abstractVerbs = [...field.verbs, ...GENERAL_VERBS];

  const abstractSentences = [
    `This study maps the systematic structural convergence of the ${random.pick(abstractAdjectives)} ${random.pick(abstractNouns)} and ${random.pick(field.buzzwords)} in ${paperComposer}'s ${paperWork}.`,
    `Applying the formal axioms of ${paperTheoretician}, we demonstrate how ${random.pick(field.buzzwords)} regulates the underlying hierarchy of ${random.pick(abstractNouns)} iterations.`,
    `Our findings indicate that the ${random.pick(abstractAdjectives)} ${random.pick(abstractNouns)} behaves not as a surface phenomenon, but as a deep-structure matrix that directly ${random.pick(abstractVerbs)} the global ${random.pick(GENERAL_NOUNS)} of the composition.`,
    madness > 50 
      ? `Axiomatically, we evaluate the structural ramifications of ${random.pick(MADNESS_ADDITIONS)} on this voice-leading model, charting several highly anomalous coordinates.`
      : `Consequently, we address the pedagogical and analytical repercussions of this model for ${fieldKey.replace('neo','').toUpperCase()} scholarship, proposing a systematic reorientation of current analytical protocols.`
  ];
  const abstract = abstractSentences.join(" ");

  // 4. Section Generation
  const sections: GeneratedPaper['sections'] = [];

  // Helper to append dynamic sentences (with drift injection)
  const getDynSent = () => generateSentence(random, fieldKey, madness, activeComposers, activeTheoreticians, paperWork, drift);

  // Helper to pad a paragraph list to the target count using generated sentences
  const padParagraphs = (base: string[], target: number): string[] => {
    const result = [...base];
    while (result.length < target) {
      // Build an elaboration paragraph from 3-4 generated sentences
      const sentenceCount = random.nextInt(3, 5);
      const sentences: string[] = [];
      for (let i = 0; i < sentenceCount; i++) {
        sentences.push(getDynSent());
      }
      result.push(sentences.join(" "));
    }
    return result.slice(0, target);
  };

  // Pool of middle-section templates that can be inserted for longer manuscripts
  const MIDDLE_SECTION_TEMPLATES = [
    {
      title: (composer: string) => `Historical Context and Reception of ${composer}'s Oeuvre`,
      paragraphs: (c: string, w: string, th: string) => [
        `To properly contextualize the structural features identified above, it is necessary to situate ${c}'s ${w} within the broader reception history of the composer's output. Contemporary accounts of the work's premiere reveal a deeply divided critical response, with commentators alternately praising its ${random.pick(field.adjectives)} innovations and decrying its apparent departure from established compositional practice. ${getDynSent()} ${getDynSent()}`,
        `Subsequent scholarly treatments have tended to oscillate between two interpretive poles: on the one hand, a formalist reading that emphasizes the work's internal ${random.pick(field.nouns)} logic, and on the other, a contextualist approach that foregrounds the biographical and institutional circumstances of its composition. ${th}'s landmark study remains the most thorough attempt to reconcile these perspectives, though its conclusions have been subject to considerable revision in recent decades. ${getDynSent()}`
      ]
    },
    {
      title: (composer: string) => `Comparative Analysis with Related Works by ${composer}`,
      paragraphs: (c: string, w: string) => [
        `A fuller understanding of the ${random.pick(field.adjectives)} features of ${w} emerges when we compare it with other compositions from the same creative period. An examination of ${c}'s contemporaneous works reveals a striking consistency in the deployment of ${random.pick(field.nouns)} structures, suggesting that the analytical model developed here has broader applicability across the composer's output. ${getDynSent()} ${getDynSent()}`,
        `Indeed, certain features that appear anomalous when considered in isolation become entirely explicable when read against the backdrop of the composer's stylistic development. The ${random.pick(field.nouns)} patterns identified in ${w} find clear precedents in earlier works, while simultaneously anticipating more radical formal experiments of the subsequent period. ${getDynSent()}`
      ],
      mayHaveEquation: true
    },
    {
      title: () => `Methodological Considerations and Analytical Protocols`,
      paragraphs: () => [
        `Before proceeding further, it is important to clarify the methodological commitments underlying the analytical procedures employed in this study. Our approach draws on several convergent traditions within ${fieldKey.replace('neo', '')} scholarship, synthesizing formal, phenomenological, and historical modes of inquiry into a unified interpretive framework. ${getDynSent()} ${getDynSent()}`,
        `A potential objection at this stage concerns the relationship between the abstract formalizations of Section 2 and the concrete score-based observations that follow. We contend that this relationship is neither one of simple derivation nor of mere illustration, but rather a dialectical interplay in which each mode of analysis informs and corrects the other. ${getDynSent()}`
      ]
    },
    {
      title: () => `Empirical Validation and Score-Based Evidence`,
      paragraphs: (c: string, w: string) => [
        `The theoretical claims advanced in the preceding sections must ultimately be tested against the empirical evidence of the musical text itself. A systematic examination of the autograph score of ${c}'s ${w} reveals numerous features that corroborate our analytical hypotheses, including the precise distribution of ${random.pick(field.nouns)} events across the work's formal divisions. ${getDynSent()} ${getDynSent()}`,
        `Particularly telling in this regard are the composer's own revisions and corrections, which frequently target precisely those passages where our model predicts structural ambiguity or interpretive openness. This convergence between analytical prediction and documentary evidence provides strong support for the explanatory adequacy of the proposed framework. ${getDynSent()}`
      ],
      mayHaveDiagram: true
    },
    {
      title: () => `Cross-Disciplinary Perspectives`,
      paragraphs: () => [
        `The analytical framework developed in this paper has implications that extend well beyond the immediate confines of ${fieldKey.replace('neo', '')} studies. Recent work in cognitive science, linguistics, and the philosophy of mind has converged on a number of themes that resonate strongly with our treatment of ${random.pick(field.buzzwords)}, suggesting the possibility of a genuinely interdisciplinary research program. ${getDynSent()} ${getDynSent()}`,
        `Of particular interest in this connection is the notion of structural hierarchy as it figures in contemporary theories of language acquisition and perceptual organization. The parallels with the ${random.pick(field.adjectives)} hierarchies analyzed above are, we believe, more than merely metaphorical, and point toward deep commonalities in the cognitive architecture underlying diverse domains of human symbolic activity. ${getDynSent()}`
      ]
    },
    {
      title: (composer: string) => `Extensions to Other Repertoires and the Works of ${composer}'s Contemporaries`,
      paragraphs: (c: string) => [
        `Having established the analytical utility of our framework for ${c}'s music, it is natural to ask whether similar results can be obtained for the works of the composer's contemporaries and immediate successors. Preliminary investigations suggest that the answer is emphatically affirmative, though important qualifications must be introduced to accommodate stylistic differences between composers. ${getDynSent()} ${getDynSent()}`,
        `In particular, the behavior of ${random.pick(field.nouns)} structures appears to be sensitive to certain parametric differences between the works of ${c} and those of the broader stylistic cohort. These differences, far from undermining the general applicability of our model, actually serve to highlight its explanatory flexibility and to suggest promising directions for future comparative research. ${getDynSent()}`
      ]
    },
    {
      title: () => `Archival Sources and Manuscript Evidence`,
      paragraphs: (c: string, w: string) => [
        `A thorough consideration of the archival materials pertaining to ${c}'s ${w} sheds additional light on the compositional processes that gave rise to the structural features analyzed in this study. Sketches, drafts, and correspondence preserved in the relevant repositories reveal a protracted and often arduous process of compositional refinement, in which the ${random.pick(field.nouns)} structures of the finished work emerge only gradually through successive layers of revision. ${getDynSent()}`,
        `Of particular interest are several previously unpublished sketches that document the composer's experimentation with alternative ${random.pick(field.adjectives)} configurations before settling on the version that ultimately appeared in the published score. These sketches provide valuable insight into the composer's structural thinking and offer independent confirmation of the analytical categories deployed in the present study. ${getDynSent()}`
      ]
    },
    {
      title: () => `Pedagogical Implications`,
      paragraphs: () => [
        `The analytical framework developed in this paper carries significant implications for the pedagogy of ${fieldKey.replace('neo', '')} analysis. Traditional instructional approaches have tended to treat ${random.pick(field.nouns)} structures as isolated technical phenomena, abstracted from their broader structural and expressive contexts. Our model suggests an alternative pedagogical strategy, in which these structures are introduced from the outset as elements of an integrated analytical framework. ${getDynSent()} ${getDynSent()}`,
        `We have begun to implement this approach in graduate seminars and have observed marked improvements in students' ability to perceive and articulate the structural relationships that obtain within complex musical works. A fuller account of these pedagogical experiments, including quantitative assessment data, will be presented in a forthcoming publication. ${getDynSent()}`
      ]
    }
  ];

  // Section 1: Introduction
  const introBase = [
    `The scholarly discourse surrounding ${paperComposer}'s ${paperWork} has long been dominated by traditionalist paradigms that fail to account for its underlying structural density. Standard tonal and post-tonal models routinely ignore the ${random.pick(field.adjectives)} ${random.pick(field.nouns)}, dismissing it as a secondary parameter or an arbitrary stylistic eccentricity. However, as ${paperTheoretician} (among others) has hinted, this viewpoint is increasingly untenable in light of contemporary analytical tools. ${getDynSent()} ${getDynSent()}`,
    `In this study, we formalize a unified theory of ${random.pick(field.buzzwords)}. Through a precise reconstruction of structural levels, we show how the ${random.pick(field.nouns)} acts as a binding link between the ${random.pick(field.adjectives)} background and the immediate foreground of ${paperComposer}'s writing. In doing so, we dismantle the conventional dichotomy between syntax and acoustics. ${getDynSent()}`
  ];
  sections.push({
    title: "1. Introduction and Historiography",
    paragraphs: padParagraphs(introBase, paragraphsPerSection)
  });

  // Section 2: Theoretical Framework (With Equations!)
  const frameworkBase = [
    `To construct a mathematically robust model of this structural behavior, we must formalize the relationships using modern academic apparatus. Let $\\mathcal{S}$ denote the space of all active ${random.pick(field.nouns)} states. Following the foundational axioms of ${paperTheoretician}, we map these states onto a multi-dimensional tensor, defined by the coordinate mapping shown in Equation (1). ${getDynSent()}`,
    `This formalization allows us to quantify the exact ${random.pick(GENERAL_ADJECTIVES)} distance between successive structural events. Under conservative assumptions, the voice-leading vector remains bounded within standard parameters; however, as the level of thematic development escalates, we observe a dramatic bifurcation. ${getDynSent()} This bifurcation can be solved by solving the generalized matrix system:`
  ];
  sections.push({
    title: "2. The Theoretical and Mathematical Framework",
    paragraphs: padParagraphs(frameworkBase, paragraphsPerSection),
    equation: random.pick(field.equations),
    equationLabel: "(1)"
  });

  // Section 3: Analysis & Diagram
  const analysisBase = [
    `Having established our mathematical axioms, we now turn to the core analytical evidence within the score of ${paperComposer}'s ${paperWork}. A close reading of the primary thematic material reveals an exquisite alignment with the prediction matrices. As shown in Figure 1, the structural pathway traces an elegant trajectory through the analytical space, manifesting exactly as our model predicted. ${getDynSent()} ${getDynSent()}`,
    `Observe the dramatic shift in tension at the main structural boundary. Here, the ${random.pick(field.adjectives)} ${random.pick(field.nouns)} converges with the ${random.pick(field.buzzwords)}, creating a state of intense harmonic polarization. Traditional analysis is completely blind to this transition, yet it stands out as the structural peak when plotted as an interactive lattice. ${getDynSent()}`
  ];
  sections.push({
    title: `3. Structural Analysis of ${paperComposer}'s ${paperWork}`,
    paragraphs: padParagraphs(analysisBase, paragraphsPerSection),
    diagramType: fieldKey as any,
    equation: madness > 40 ? random.pick(FIELDS[random.pick(Object.keys(FIELDS))].equations) : undefined,
    equationLabel: madness > 40 ? "(2)" : undefined
  });

  // Middle sections (inserted dynamically based on length)
  let equationCounter = madness > 40 ? 3 : 2;
  // For very long papers, cycle through the pool multiple times with varied section numbering
  const middleSectionsToInsert: typeof MIDDLE_SECTION_TEMPLATES = [];
  if (extraMiddleSections > 0) {
    const shuffled = random.shuffle([...MIDDLE_SECTION_TEMPLATES]);
    for (let i = 0; i < extraMiddleSections; i++) {
      middleSectionsToInsert.push(shuffled[i % shuffled.length]);
    }
  }

  middleSectionsToInsert.forEach((template) => {
    const sectionNumber = sections.length + 1;
    const titleRaw = template.title(paperComposer);
    const paragraphsRaw = template.paragraphs(paperComposer, paperWork, paperTheoretician);
    const sectionObj: {
      title: string;
      paragraphs: string[];
      equation?: string;
      equationLabel?: string;
      diagramType?: any;
    } = {
      title: `${sectionNumber}. ${titleRaw}`,
      paragraphs: padParagraphs(paragraphsRaw, paragraphsPerSection)
    };
    if ((template as any).mayHaveEquation && random.next() > 0.4) {
      sectionObj.equation = random.pick(field.equations);
      sectionObj.equationLabel = `(${equationCounter})`;
      equationCounter++;
    }
    if ((template as any).mayHaveDiagram && random.next() > 0.5) {
      sectionObj.diagramType = fieldKey as any;
    }
    sections.push(sectionObj);
  });

  // Hermeneutic Discussion
  const discussionBase = [
    `The analytical results presented above carry profound implications for our broader understanding of music theory. By deconstructing the ${random.pick(field.nouns)} as a dynamic structural field rather than a static object, we escape the reductive dualism of traditional musicology. We are forced to question whether any musical work can truly be analyzed without reference to its ${random.pick(GENERAL_ADJECTIVES)} ${random.pick(GENERAL_NOUNS)}. ${getDynSent()}`,
    madness > 60
      ? `Indeed, the integration of ${random.pick(MADNESS_ADDITIONS)} raises foundational questions for the discipline. If the voice-leading path itself is subject to stochastic fluctuation, then the entire enterprise of static analytical graphing must be replaced by a probabilistic framework of structural states. We welcome this reconceptualization as a vital step toward analytical rigor. ${getDynSent()}`
      : `While some theorists may object to the complexity of this mathematical framework, we contend that the sheer explanatory power of the model justifies its cognitive overhead. The ${random.pick(field.nouns)} is not merely an analytical convenience; it is the ontological core of the composition. ${getDynSent()}`
  ];
  sections.push({
    title: `${sections.length + 1}. Hermeneutic Discussion and Ontological Repercussions`,
    paragraphs: padParagraphs(discussionBase, paragraphsPerSection)
  });

  // Conclusion (scales with length — longer papers get more reflective conclusions)
  const conclusionBase = [
    `In conclusion, we have shown that the structural syntax of ${paperComposer}'s ${paperWork} is governed by a remarkably elegant recursive mapping. By bridging the gap between ${random.pick(field.nouns)} theory and ${random.pick(field.buzzwords)}, we have provided a fresh, empirical foundation for future analytical research. ${getDynSent()}`,
    `Future investigations will aim to generalize this model to other historical periods, perhaps applying stochastic sieve techniques to medieval isorhythm or spectral envelopes to post-tonal jazz. For now, the theoretical framework established here stands as a definitive contribution to the question of how structure and meaning interact in the scholarly musical imagination. ${getDynSent()}`
  ];
  // For long papers, add a reflective synthesis paragraph
  if (length >= 25) {
    conclusionBase.push(
      `Taken as a whole, the findings of this study point toward a broader reorientation of ${fieldKey.replace('neo', '')} studies — one in which formal, historical, and phenomenological modes of inquiry are no longer treated as competing paradigms but as mutually illuminating perspectives on a shared analytical object. ${getDynSent()} ${getDynSent()}`
    );
  }
  sections.push({
    title: `${sections.length + 1}. Conclusion and Directions for Future Scholarship`,
    paragraphs: padParagraphs(conclusionBase, paragraphsPerSection)
  });

  // 5. Bibliography Generation (scales with manuscript length)
  const bibliography: GeneratedPaper['bibliography'] = [];
  const bibEntriesCount = bibCount;
  // Build a large, diverse author pool by mixing theoreticians from all fields
  const allTheoreticians = Object.values(FIELDS).flatMap(f => f.theoreticians);
  const allComposers     = Object.values(FIELDS).flatMap(f => f.composers);
  const bibAuthorsPool   = [...new Set([...allTheoreticians, ...allComposers])];
  const bibTheoreticians = random.shuffle(bibAuthorsPool);
  
  const publishers = [
    "Oxford University Press", "Cambridge University Press", "University of Chicago Press",
    "Indiana University Press", "University of California Press", "Yale University Press",
    "Princeton University Press", "MIT Press", "Routledge", "W. W. Norton & Company"
  ];
  const cities = ["Oxford", "Cambridge, MA", "Chicago", "Bloomington", "New Haven", "Paris", "Vienna", "Berkeley", "Princeton", "New York", "London"];

  for (let i = 0; i < bibEntriesCount; i++) {
    const authorName = bibTheoreticians[i] || `Theorist ${i+1}`;
    const authorLastOnly = authorName.split(" ").pop();
    
    const bibYear = random.nextInt(1960, 2026);
    const bkTitles = [
      `The Structure of Atonal and ${random.pick(field.adjectives)} Music`,
      `Beyond the Ursatz: Studies in ${random.pick(field.adjectives)} Prolongation`,
      `A Theory of ${random.pick(field.nouns).charAt(0).toUpperCase() + random.pick(field.nouns).slice(1)}s and Voice-Leading Spaces`,
      `The Semiotics of ${random.pick(field.buzzwords).charAt(0).toUpperCase() + random.pick(field.buzzwords).slice(1)}`,
      `Speculations on ${random.pick(GENERAL_ADJECTIVES).charAt(0).toUpperCase() + random.pick(GENERAL_ADJECTIVES).slice(1)} Music Theory`,
      `Deconstructing ${random.pick(field.composers)}: An Analytical Treatise`
    ];
    
    const titleBook = bkTitles[i % bkTitles.length];
    const city = random.pick(cities);
    const pub = random.pick(publishers);
    const citeKey = `${authorLastOnly?.toLowerCase() || "author"}${bibYear}`;

    const formatted = `${authorName}. (${bibYear}). *${titleBook}*. ${city}: ${pub}.`;
    const bibtex = `@book{${citeKey},
  author = {${authorName}},
  title = {${titleBook}},
  publisher = {${pub}},
  address = {${city}},
  year = {${bibYear}}
}`;

    bibliography.push({
      citationKey: citeKey,
      formatted,
      bibtex
    });
  }

  // Cross-reference some citations into the paragraphs!
  // We can replace occurrences of [theoretician] references with the actual keys if we want, but simply having them in the text is great.
  // Let's add some citation tags like [citeKey] to text or inject them.
  sections.forEach((sec) => {
    sec.paragraphs = sec.paragraphs.map((para) => {
      // Occasionally inject citations like (Forte 1973) or similar
      let text = para;
      if (random.next() > 0.6 && bibliography.length > 0) {
        const targetBib = random.pick(bibliography);
        const bibKeyName = targetBib.citationKey.replace(/\d+/, "");
        const bibKeyYear = targetBib.citationKey.match(/\d+/)?.[0] || "1994";
        const citeStr = ` (${bibKeyName.charAt(0).toUpperCase() + bibKeyName.slice(1)} ${bibKeyYear})`;
        
        // Inject at a random space or end of sentence
        const sentences = text.split(". ");
        if (sentences.length > 1) {
          sentences[sentences.length - 2] += citeStr;
          text = sentences.join(". ");
        } else {
          text += citeStr;
        }
      }
      return text;
    });
  });

  // 6. Peer Reviews — written in the tone of measured academic correspondence
  const reviewComments = [
    {
      reviewer: "Reviewer 1 — Senior Musicologist, Department of Music Theory",
      verdict: "Major revisions required" as const,
      comments: `The authors undertake an ambitious re-examination of ${random.pick(field.buzzwords)} as it manifests in ${paperComposer}'s ${paperWork}. The scope of the project is admirable, and several of the analytical observations in Section 3 are genuinely illuminating. However, I have three substantial concerns that must be addressed before this manuscript can be considered for publication. First, the theoretical framework in Section 2 relies on a number of unexamined assumptions about the behavior of the ${random.pick(field.nouns)} that are not adequately grounded in the existing literature; the work of ${paperTheoretician} is cited but its implications are not sufficiently integrated into the argument. Second, the formalization in Equation (1), while elegant, requires a more careful justification of its underlying premises — at present, the transition from the descriptive to the algebraic registers of analysis is asserted rather than demonstrated. Third, the hermeneutic discussion in Section 4 introduces a number of claims that would benefit from additional supporting evidence. I would encourage the authors to either expand this section with concrete score-based examples or to temper their conclusions accordingly. With careful revision, this paper has the potential to make a significant contribution to ${fieldKey} studies.`
    },
    {
      reviewer: "Reviewer 2 — Assistant Professor of Music Theory",
      verdict: "Accept with minor revisions" as const,
      comments: `This paper offers a sophisticated and timely contribution to the study of ${fieldKey} analytical methodology. The integration of formal modeling with close score reading in Section 3 is particularly well-executed, and the structural analysis of ${paperComposer}'s ${paperWork} demonstrates considerable analytical care. The prose is generally clear and the argument is well-organized. I have a small number of suggestions that, in my view, would strengthen the manuscript. The notation in Equation (1) should be defined more explicitly at its first occurrence; readers unfamiliar with the specific formal apparatus may find the transition from prose to symbol somewhat abrupt. In Section 4, the authors might consider acknowledging recent work on related topics by other scholars in the field, particularly those addressing comparable repertoires. The bibliography, while solid, could also be updated to reflect publications from the last five years. These are relatively minor concerns, and I would recommend the manuscript for publication contingent on these revisions.`
    },
    {
      reviewer: "Reviewer 3 — Professor Emeritus of Musicology and Aesthetics",
      verdict: "Accept as submitted" as const,
      comments: `This is a thoughtful and well-researched contribution to the ongoing scholarly conversation surrounding ${fieldKey} theory and its intersections with broader analytical and hermeneutic discourses. The authors demonstrate a firm command of the relevant literature and bring a number of original insights to their analysis of ${paperComposer}'s ${paperWork}. I am particularly struck by the elegance of the theoretical apparatus developed in Section 2 and by the care with which the authors have grounded their formal observations in the musical surface. The conclusion is appropriately measured and opens up promising directions for future research. I have no substantive objections to the paper in its current form and would recommend it for publication without reservation.`
    }
  ];

  // 7. Raw LaTeX generation
  const authorTeX = authors.map(a => `\\author{${a.name} \\\\ \\small ${a.institution}}`).join("\n");
  
  const latexSections = sections.map(s => {
    let secStr = `\\section{${s.title.replace(/^\d+\.\s+/, "")}}\n`;
    secStr += s.paragraphs.map(p => p.replace(/([&%_])/g, "\\$1")).join("\n\n") + "\n";
    if (s.equation) {
      secStr += `\\begin{equation}\n${s.equation}\n\\label{eq:${s.equationLabel || "1"}}\n\\end{equation}\n`;
    }
    return secStr;
  }).join("\n");

  const rawLaTeX = `\\documentclass[11pt,twocolumn]{article}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{graphicx}
\\usepackage{times}

\\title{${title}}
${authorTeX}
\\date{${year}}

\\begin{document}
\\maketitle

\\begin{abstract}
${abstract}
\\end{abstract}

\\section*{DOI: ${doi}}

${latexSections}

\\begin{thebibliography}{9}
${bibliography.map(b => `\\bibitem{${b.citationKey}} ${b.formatted.replace(/\*/g, "\\textit")}`).join("\n")}
\\end{thebibliography}

\\end{document}`;

  // 8. Raw Markdown generation
  const mdSections = sections.map(s => {
    let secStr = `## ${s.title}\n\n`;
    secStr += s.paragraphs.join("\n\n") + "\n\n";
    if (s.equation) {
      secStr += `$$\n${s.equation}\n$$\n\n`;
    }
    return secStr;
  }).join("\n");

  const rawMarkdown = `# ${title}

**Authors:**
${authors.map(a => `- ${a.name} (${a.institution})`).join("\n")}

**Journal:** ${journal} | Volume ${volume}, Issue ${issue} (${year})
**DOI:** ${doi}

## Abstract
${abstract}

---

${mdSections}

## Bibliography
${bibliography.map(b => `* ${b.formatted}`).join("\n")}`;

  return {
    title,
    journal,
    volume,
    issue,
    year,
    doi,
    authors,
    abstract,
    sections,
    bibliography,
    peerReviews: reviewComments,
    rawLaTeX,
    rawMarkdown
  };
}
