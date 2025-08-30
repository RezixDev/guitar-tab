import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Clock, Target, Music, Play, RefreshCcw } from "lucide-react"
import type { Note } from "@/utils/noteUtils"

type GameControlsProps = {
	points: number
	targetPoints: number
	streak: number
	bestTime: number | null
	timeChallenge: boolean
	elapsedTime: number
	showNext: boolean
	currentNote: Note
	isGameStarted: boolean
	feedback?: string
	onNextNote: () => void
	onStartGame: () => void
	onReset: () => void
	translations: {
		ready: string
		startGame: string
		findNote: string
		pressEnter: string
		nextNote: string
		resetGame: string
		streak: string
		score: string
		time: string
		best: string
	}
}

const formatSeconds = (s: number) => {
	const m = Math.floor(s / 60)
	const sec = Math.round(s % 60).toString().padStart(2, "0")
	return m > 0 ? `${m}:${sec}` : `${parseInt(sec, 10)}s`
}

export function GameControls({
								 points,
								 targetPoints,
								 streak,
								 bestTime,
								 timeChallenge,
								 elapsedTime,
								 showNext,
								 currentNote,
								 isGameStarted,
								 feedback = "",
								 onNextNote,
								 onStartGame,
								 onReset,
								 translations,
							 }: GameControlsProps) {
	if (!isGameStarted) {
		return (
			<div className="flex flex-col items-center justify-center space-y-4 py-8">
				<h2 className="text-center text-2xl font-bold">{translations.ready}</h2>
				<Button size="lg" onClick={onStartGame} className="flex items-center gap-2">
					<Play className="h-5 w-5" />
					{translations.startGame}
				</Button>
			</div>
		)
	}

	const isPositive =
		/correct|perfect|great/i.test(feedback) // more robust than includes with case sensitivity

	return (
		<div className="space-y-6">
			<div className="flex flex-col items-center justify-center rounded-lg bg-muted p-6">
				<div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
					<Music className="h-4 w-4" />
					{translations.findNote}
				</div>

				<div className="mb-2 text-5xl font-bold tracking-wider">{currentNote.note}</div>

				{feedback && (
					<div
						className={`mt-2 text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}
						aria-live="polite"
					>
						{feedback}
					</div>
				)}

				{showNext && (
					<div className="mt-2 text-sm text-muted-foreground">{translations.pressEnter}</div>
				)}
			</div>

			<div className="space-y-4">
				<div className="flex flex-wrap items-center gap-2">
					<Badge variant="outline" className="flex items-center gap-1">
						<Target className="h-4 w-4" />
						<span>
              {translations.score}: {points}/{targetPoints}
            </span>
					</Badge>

					<Badge variant="secondary" className="flex items-center gap-1">
						<Trophy className="h-4 w-4" />
						<span>
              {translations.streak}: {streak}
            </span>
					</Badge>

					{timeChallenge && (
						<Badge variant="secondary" className="flex items-center gap-1">
							<Clock className="h-4 w-4" />
							<span>
                {translations.time}: {formatSeconds(elapsedTime)}
              </span>
						</Badge>
					)}

					{typeof bestTime === "number" && (
						<Badge variant="outline" className="flex items-center gap-1">
							<Trophy className="h-4 w-4" />
							<span>
                {translations.best}: {formatSeconds(bestTime)}
              </span>
						</Badge>
					)}
				</div>

				<div className="flex gap-4">
					<Button variant="outline" onClick={onReset} className="flex items-center gap-2">
						<RefreshCcw className="h-4 w-4" />
						{translations.resetGame}
					</Button>

					{showNext && (
						<Button onClick={onNextNote} className="flex-1">
							{translations.nextNote}
							<kbd className="ml-2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
								<span className="text-xs">⏎</span>
								Enter
							</kbd>
						</Button>
					)}
				</div>
			</div>
		</div>
	)
}
