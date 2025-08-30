type BaseFretboardProps = {
    tuning: readonly string[]
    width: number
    height: number
    renderNotes: (stringSpacing: number, fretSpacing: number) => React.ReactNode
}

const STRING_COUNT = 6
const FRET_COUNT = 12

export function BaseFretboard({
                                  tuning,
                                  width,
                                  height,
                                  renderNotes,
                              }: BaseFretboardProps) {
    const stringSpacing = height / (STRING_COUNT + 1)
    const fretSpacing = width / (FRET_COUNT + 1)

    return (
        <div className="relative w-full overflow-x-auto">
            <svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
                className="rounded-lg border border-gray-300 shadow-md"
            >
                <g transform="translate(40, 0)">
                    {Array.from({ length: STRING_COUNT }, (_, i) => (
                        <line
                            key={`string-${i}`}
                            x1={0}
                            y1={stringSpacing * (i + 1)}
                            x2={width}
                            y2={stringSpacing * (i + 1)}
                            stroke="black"
                            strokeWidth={2}
                        />
                    ))}

                    {Array.from({ length: FRET_COUNT + 1 }, (_, i) => (
                        <line
                            key={`fret-${i}`}
                            x1={fretSpacing * i}
                            y1={0}
                            x2={fretSpacing * i}
                            y2={height}
                            stroke="black"
                            strokeWidth={i === 0 ? 4 : 2}
                        />
                    ))}

                    {Array.from({ length: FRET_COUNT }, (_, i) => (
                        <text
                            key={`fret-number-${i}`}
                            x={fretSpacing * (i + 1) - fretSpacing / 2}
                            y={height - 10}
                            textAnchor="middle"
                            fontSize={12}
                            fontFamily="Arial"
                            fill="black"
                        >
                            {i + 1}
                        </text>
                    ))}

                    {renderNotes(stringSpacing, fretSpacing)}
                </g>

                <g>
                    {tuning.map((note, i) => (
                        <text
                            key={`string-name-${i}`}
                            x={20}
                            y={stringSpacing * (i + 1) + 5}
                            textAnchor="middle"
                            fontSize={12}
                            fontFamily="Arial"
                            fill="black"
                        >
                            {note}
                        </text>
                    ))}
                </g>
            </svg>
        </div>
    )
}
