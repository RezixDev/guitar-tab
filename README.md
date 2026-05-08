# Guitar Lab 🎸

A comprehensive interactive toolkit for guitar players, featuring chord visualization, scale exploration, fretboard training, a tuner, sheet-music composer, daily practice generator, and a structured learning module. Built with Astro 5 and React 19.

## Features

### 🎵 Chords
- Interactive chord diagram viewer
- Searchable chord library (standard + extended)
- Customizable positions, fingerings, and themes
- Floating modal view for enlarged diagrams

### 📊 Scale Viewer
- Visual representation of guitar scales (Major, Minor, Pentatonics, Blues)
- Pick a root note and instantly see scale positions on the fretboard
- Color-coded note overlays

### 🎯 Fretboard Training
- Interactive note-recognition game
- Five game modes: Newbie, Easy, Find All, Hard, Time Challenge
- Multiple tunings (Standard, Half Step Down, Drop D)
- Position tracker, completion stats, keyboard shortcuts, and tutorial

### 🎼 Sheet Music Composer
- Click-to-place notes on a treble-clef staff
- Adjustable durations, tempo, and volume
- Tone.js-powered playback with playhead and start-point controls

### 🎚️ Guitar Tuner
- Microphone pitch detection (YIN algorithm via `pitchfinder`)
- Reference-tone playback for each string
- Cents-accurate flat / in-tune / sharp indicator

### 💪 Daily Practice
- Generates randomized exercises across five categories:
  Chromatic, Scale Run, String Skipping, Legato, Picking
- Three difficulty levels with suggested BPM ranges
- One-click copy of generated tabs

### 🎓 Learn
- Structured learning paths grouped by Beginner / Intermediate / Advanced
- Per-path progress display

### 🌐 Internationalization
- Built-in Astro i18n with locales: **en**, **de**, **pl**
- All locale prefixes (`/en/...`, `/de/...`, `/pl/...`) generated as static pages

## Technology Stack

| | |
|---|---|
| Framework | [Astro 5](https://astro.build) |
| UI Runtime | [React 19](https://react.dev) (via `@astrojs/react` islands) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) (`@theme` + CSS custom properties) |
| Primitives | [Radix UI](https://www.radix-ui.com/) — used directly in `src/shared/ui` |
| Icons | [lucide-react](https://lucide.dev) |
| Audio | [Tone.js](https://tonejs.github.io) (sheet) + Web Audio API (tuner / fretboard) |
| Pitch detection | [pitchfinder](https://github.com/peterkhayes/pitchfinder) |
| i18n | Custom React Context + Astro static i18n |

## Getting Started

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm check        # astro check (TypeScript + Astro diagnostics)
pnpm build        # static production build to ./dist
pnpm preview      # preview the production build
```

## Project Structure

```
src/
├── features/                # One folder per feature, self-contained
│   ├── chords/              # Chord library, SVG diagram, theme picker
│   ├── fretboard/           # Note-finding game (modes, hooks, components)
│   ├── learn/               # Learning-path overview
│   ├── practice/            # Daily practice generator
│   ├── scales/              # Scale viewer
│   ├── sheet/               # Sheet-music composer (Tone.js)
│   └── tuner/               # Microphone tuner + reference tones
│
├── shared/                  # Anything reused across features
│   ├── audio/               # AudioManager (note sample loader)
│   ├── hooks/               # useLocalStorage etc.
│   ├── i18n/                # I18nProvider, getMessages, makeTranslator
│   ├── layout/              # Astro Sidebar, TopBar, MobileNav, IslandRoot
│   ├── lib/                 # cn() and small utilities
│   ├── music/               # Note math (calculateNote, scales, tunings)
│   ├── theme/               # ThemeProvider + ThemeToggle (light/dark/system)
│   ├── types/               # Single source of truth for shared TS types
│   └── ui/                  # Reusable UI primitives (Button, Card, Dialog…)
│
├── pages/
│   ├── index.astro          # Redirects to default locale
│   └── [locale]/
│       ├── index.astro      # Localized landing page
│       ├── learn.astro
│       └── tools/
│           ├── chords.astro
│           ├── fretboard.astro
│           ├── practice.astro
│           ├── scales.astro
│           ├── sheet.astro
│           └── tuner.astro
│
├── messages/                # en.json, de.json, pl.json
├── layouts/                 # BaseLayout.astro
├── styles/                  # globals.css (Tailwind v4 + theme tokens)
└── env.d.ts
```

## Architectural Notes

- **No duplicated types.** Every shared TypeScript type lives in `src/shared/types/` and is re-imported by features (e.g. `Note`, `NotePosition`, `Tuning`, `SheetNote`, `PracticePattern`).
- **Astro Islands.** Each feature exports a default React component (`ChordsApp`, `FretboardApp`, …) which is mounted via `client:load` (or `client:only="react"` for tools that touch browser-only APIs like `Tone.js`).
- **i18n boundary.** Pages that need translations pass `messages` and `locale` props to their island, which wraps children in `<I18nProvider>`. Components then call `useTranslations(namespace)`.
- **No shadcn.** UI primitives in `src/shared/ui/` are thin Radix wrappers using `cva` + `cn`. CSS variables (`--color-accent`, `--color-bg-elevated`, …) drive theming and dark mode.

## Contributing

Contributions are welcome — please open a pull request.

## License

MIT — see the LICENSE file.
