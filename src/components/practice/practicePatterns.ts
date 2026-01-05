// Practice pattern definitions and generation logic

export type PracticeType =
    | "chromatic"
    | "scaleRun"
    | "stringSkipping"
    | "legato"
    | "picking";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface PracticePattern {
    type: PracticeType;
    difficulty: Difficulty;
    name: string;
    description: string;
    bpmSuggestion: { min: number; max: number };
    tabs: string[];
}

// Standard tuning string names (high to low)
const STRING_NAMES = ["e", "B", "G", "D", "A", "E"];

// Chromatic patterns (spider exercises)
const CHROMATIC_PATTERNS = {
    beginner: [
        [[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4]],
        [[4, 3, 2, 1], [4, 3, 2, 1], [4, 3, 2, 1], [4, 3, 2, 1], [4, 3, 2, 1], [4, 3, 2, 1]],
    ],
    intermediate: [
        [[1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6], [4, 5, 6, 7], [5, 6, 7, 8], [6, 7, 8, 9]],
        [[1, 3, 2, 4], [1, 3, 2, 4], [1, 3, 2, 4], [1, 3, 2, 4], [1, 3, 2, 4], [1, 3, 2, 4]],
        [[1, 4, 2, 3], [1, 4, 2, 3], [1, 4, 2, 3], [1, 4, 2, 3], [1, 4, 2, 3], [1, 4, 2, 3]],
    ],
    advanced: [
        [[1, 2, 4, 3], [2, 1, 3, 4], [3, 4, 2, 1], [4, 3, 1, 2], [1, 2, 4, 3], [2, 1, 3, 4]],
        [[1, 4, 3, 2], [4, 1, 2, 3], [3, 2, 1, 4], [2, 3, 4, 1], [1, 4, 3, 2], [4, 1, 2, 3]],
    ],
};

// Scale patterns (pentatonic-based)
const SCALE_PATTERNS = {
    beginner: [
        // A minor pentatonic box 1
        [[5, 8], [5, 8], [5, 7], [5, 7], [5, 7], [5, 8]],
    ],
    intermediate: [
        // Extended patterns
        [[5, 8], [5, 7, 8], [5, 7], [5, 7], [5, 7], [5, 8]],
        [[8, 10, 12], [8, 10, 12], [9, 10, 12], [9, 10, 12], [10, 12], [10, 12]],
    ],
    advanced: [
        // 3 notes per string patterns
        [[5, 7, 8], [5, 7, 8], [4, 5, 7], [4, 5, 7], [5, 7], [5, 7, 8]],
        [[12, 14, 15], [12, 14, 15], [12, 14], [12, 14], [12, 14, 15], [12, 15]],
    ],
};

// String skipping patterns
const STRING_SKIPPING_PATTERNS = {
    beginner: [
        // Simple skip
        { strings: [5, 3, 5, 3], frets: [5, 5, 7, 7] },
        { strings: [4, 2, 4, 2], frets: [5, 5, 7, 7] },
    ],
    intermediate: [
        { strings: [5, 3, 1, 3, 5], frets: [5, 5, 5, 7, 7] },
        { strings: [4, 2, 0, 2, 4], frets: [7, 7, 5, 5, 5] },
    ],
    advanced: [
        { strings: [5, 2, 4, 1, 3, 0], frets: [5, 7, 5, 8, 5, 8] },
        { strings: [5, 1, 4, 0, 3, 1], frets: [3, 5, 5, 8, 5, 7] },
    ],
};

// Legato patterns (h = hammer-on, p = pull-off)
const LEGATO_PATTERNS = {
    beginner: [
        { notes: ["5h7", "5h7", "5h7", "5h7", "5h7", "5h7"], strings: [5, 4, 3, 2, 1, 0] },
        { notes: ["7p5", "7p5", "7p5", "7p5", "7p5", "7p5"], strings: [0, 1, 2, 3, 4, 5] },
    ],
    intermediate: [
        { notes: ["5h7h8", "5h7h8", "5h7", "5h7", "5h7h8", "5h7h8"], strings: [5, 4, 3, 2, 1, 0] },
        { notes: ["8p7p5", "8p7p5", "7p5", "7p5", "8p7p5", "8p7p5"], strings: [0, 1, 2, 3, 4, 5] },
    ],
    advanced: [
        { notes: ["5h7p5h8", "5h7p5h8", "4h5p4h7", "4h5p4h7", "5h7p5h8", "5h7p5h8"], strings: [5, 4, 3, 2, 1, 0] },
    ],
};

// Picking patterns (alternate picking exercises)
const PICKING_PATTERNS = {
    beginner: [
        [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
        [[3], [3], [3], [3], [3], [3]],
    ],
    intermediate: [
        // Gallop pattern
        [[5, 5, 7], [5, 5, 7], [5, 5, 7], [5, 5, 7], [5, 5, 7], [5, 5, 7]],
        // Triplet feel
        [[5, 7, 5], [7, 5, 7], [5, 7, 5], [7, 5, 7], [5, 7, 5], [7, 5, 7]],
    ],
    advanced: [
        // Sweep-like pattern
        [[12], [12], [12], [11], [12], [12]],
        // Economy picking
        [[7, 5], [8, 5], [7, 5], [7, 5], [7, 5], [7, 5]],
    ],
};

function formatFret(fret: number | string): string {
    const fretStr = String(fret);
    // Pad single digits for alignment
    return fretStr.length === 1 ? fretStr + "-" : fretStr;
}

function generateChromaticTab(
    difficulty: Difficulty,
    startFret: number
): string[] {
    const patterns = CHROMATIC_PATTERNS[difficulty];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];

    const tabs: string[] = [];
    for (let i = 0; i < 6; i++) {
        const stringName = STRING_NAMES[i];
        const frets = pattern[i].map((f) => f + startFret - 1);
        const fretStr = frets.map((f) => formatFret(f)).join("");
        tabs.push(`${stringName}|--${fretStr}--|`);
    }
    return tabs;
}

function generateScaleTab(difficulty: Difficulty, startFret: number): string[] {
    const patterns = SCALE_PATTERNS[difficulty];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];

    const tabs: string[] = [];
    const offset = startFret - 5; // Patterns are based around 5th fret

    for (let i = 0; i < 6; i++) {
        const stringName = STRING_NAMES[i];
        const frets = pattern[i].map((f) => Math.max(0, f + offset));
        const fretStr = frets.map((f) => formatFret(f)).join("");
        // Pad to maintain alignment
        const padding = "-".repeat(Math.max(0, 16 - fretStr.length));
        tabs.push(`${stringName}|--${fretStr}${padding}--|`);
    }
    return tabs;
}

function generateStringSkippingTab(
    difficulty: Difficulty,
    startFret: number
): string[] {
    const patterns = STRING_SKIPPING_PATTERNS[difficulty];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];

    // Initialize empty strings
    const stringNotes: string[][] = [[], [], [], [], [], []];

    for (let i = 0; i < pattern.strings.length; i++) {
        const stringIdx = pattern.strings[i];
        const fret = pattern.frets[i] + startFret - 5;

        // Add rest markers to other strings
        for (let s = 0; s < 6; s++) {
            if (s === stringIdx) {
                stringNotes[s].push(formatFret(Math.max(0, fret)));
            } else {
                stringNotes[s].push("--");
            }
        }
    }

    return STRING_NAMES.map(
        (name, i) => `${name}|--${stringNotes[i].join("")}--|`
    );
}

function generateLegatoTab(difficulty: Difficulty, startFret: number): string[] {
    const patterns = LEGATO_PATTERNS[difficulty];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];

    const tabs: string[] = [];
    const offset = startFret - 5;

    for (let i = 0; i < 6; i++) {
        const stringName = STRING_NAMES[i];
        const stringIdx = pattern.strings.indexOf(i);

        if (stringIdx !== -1) {
            // Adjust frets in the legato notation
            let note = pattern.notes[stringIdx];
            note = note.replace(/(\d+)/g, (match) => {
                const fret = parseInt(match) + offset;
                return String(Math.max(0, fret));
            });
            const padding = "-".repeat(Math.max(0, 12 - note.length));
            tabs.push(`${stringName}|--${note}${padding}--|`);
        } else {
            tabs.push(`${stringName}|----------------|`);
        }
    }
    return tabs;
}

function generatePickingTab(
    difficulty: Difficulty,
    startFret: number
): string[] {
    const patterns = PICKING_PATTERNS[difficulty];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];

    const tabs: string[] = [];
    const offset = startFret;

    for (let i = 0; i < 6; i++) {
        const stringName = STRING_NAMES[i];
        const frets = pattern[i].map((f) => f + offset);
        const fretStr = frets.map((f) => formatFret(f)).join("");
        const padding = "-".repeat(Math.max(0, 12 - fretStr.length));
        tabs.push(`${stringName}|--${fretStr}${padding}--|`);
    }
    return tabs;
}

export function generatePracticePattern(
    type: PracticeType,
    difficulty: Difficulty,
    startFret: number = 1
): PracticePattern {
    const bpmRanges: Record<Difficulty, { min: number; max: number }> = {
        beginner: { min: 60, max: 80 },
        intermediate: { min: 80, max: 120 },
        advanced: { min: 120, max: 160 },
    };

    const typeNames: Record<PracticeType, string> = {
        chromatic: "Chromatic Exercise",
        scaleRun: "Scale Run",
        stringSkipping: "String Skipping",
        legato: "Legato Pattern",
        picking: "Picking Exercise",
    };

    const typeDescriptions: Record<PracticeType, string> = {
        chromatic: "Spider exercise for finger independence",
        scaleRun: "Scale pattern for melodic fluency",
        stringSkipping: "String skipping for coordination",
        legato: "Hammer-ons and pull-offs for smooth playing",
        picking: "Alternate picking for speed and accuracy",
    };

    let tabs: string[];

    switch (type) {
        case "chromatic":
            tabs = generateChromaticTab(difficulty, startFret);
            break;
        case "scaleRun":
            tabs = generateScaleTab(difficulty, startFret);
            break;
        case "stringSkipping":
            tabs = generateStringSkippingTab(difficulty, startFret);
            break;
        case "legato":
            tabs = generateLegatoTab(difficulty, startFret);
            break;
        case "picking":
            tabs = generatePickingTab(difficulty, startFret);
            break;
        default:
            tabs = generateChromaticTab(difficulty, startFret);
    }

    return {
        type,
        difficulty,
        name: typeNames[type],
        description: typeDescriptions[type],
        bpmSuggestion: bpmRanges[difficulty],
        tabs,
    };
}

export function getRandomPracticeType(): PracticeType {
    const types: PracticeType[] = [
        "chromatic",
        "scaleRun",
        "stringSkipping",
        "legato",
        "picking",
    ];
    return types[Math.floor(Math.random() * types.length)];
}
