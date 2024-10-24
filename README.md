# Guitar Learning Tools 🎸

A comprehensive web application for guitar players featuring chord visualization, scale learning, and fretboard mastery tools. Built with Next.js and React.

## Features

### 🎵 Guitar Chord Tool
- Interactive chord diagram viewer
- Searchable chord library (Standard & Extended chords)
- Customizable chord positions and fingerings
- Modal view for enlarged chord diagrams
- Responsive design for all devices

### 📊 Scale Viewer
- Visual representation of guitar scales
- Interactive scale pattern display
- Major scale patterns built-in
- Clean, intuitive interface
- Gradient background design for better visibility

### 🎯 Fretboard Learning Game
- Interactive fretboard note recognition game
- Practice mode for learning note positions
- Clean card-based interface
- Progress tracking capabilities

## Technology Stack

- **Framework**: Next.js
- **UI Library**: React
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **State Management**: Custom React Hooks

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/RezixDev/guitar-tab
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application

## Project Structure

```
components/
├── chords/
│   ├── ChordSearch.tsx
│   ├── ChordList.tsx
│   ├── ChordDetails.tsx
│   ├── ChordModal.tsx
│   ├── ChordSVG.tsx
│   └── useChordState.ts
├── fretboard/
│   └── FretboardGame.tsx
└── ScaleViewer.tsx

app/
├── page.tsx
├── fretboard/
│   └── page.tsx
└── utils/
    └── noteUtils.ts
```

## Key Components

### Chord Tool
- `ChordSearch`: Searchable interface for finding chords
- `ChordList`: Displays available chords in categories
- `ChordDetails`: Shows detailed chord information
- `ChordModal`: Popup view for enlarged chord diagrams
- `ChordSVG`: SVG renderer for chord diagrams

### Scale Viewer
- Interactive scale visualization
- Support for various scale patterns
- Visual fretboard representation

### Fretboard Game
- Interactive note recognition
- Practice mode
- Progress tracking

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)