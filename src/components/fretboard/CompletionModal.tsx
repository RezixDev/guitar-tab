import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trophy, Clock, Target, Star } from "lucide-react"
import { Progress } from "@/components/ui/progress"

type CompletionModalProps = {
  isOpen: boolean
  onClose: () => void
	stats: {
    correctGuesses: number
    totalGuesses: number
    time: number // seconds
    streak: number
    bestTime?: number // seconds
  }
	translations: {
    title: string
    subtitle: string
    correct: string
    time: string
    streak: string
    bestTime: string
    accuracy: string
    close: string
    playAgain: string
  }
}

export function CompletionModal({ isOpen, onClose, stats, translations }: CompletionModalProps) {
  const accuracy = stats.totalGuesses > 0 ? (stats.correctGuesses / stats.totalGuesses) * 100 : 0

  const formatSeconds = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.round(s % 60)
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`
  }

	return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Trophy className="w-6 h-6 text-yellow-500" />
						{translations.title}
					</DialogTitle>
					<DialogDescription>{translations.subtitle}</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
						<div className="flex items-center gap-2">
							<Target className="w-4 h-4 text-blue-500" />
              <span>
                {translations.correct}: {stats.correctGuesses}/{stats.totalGuesses}
              </span>
						</div>
						<div className="flex items-center gap-2">
							<Clock className="w-4 h-4 text-green-500" />
              <span>
                {translations.time}: {formatSeconds(stats.time)}
              </span>
						</div>
						<div className="flex items-center gap-2">
							<Star className="w-4 h-4 text-purple-500" />
              <span>
                {translations.streak}: {stats.streak}
              </span>
						</div>
            {typeof stats.bestTime === "number" && (
							<div className="flex items-center gap-2">
								<Trophy className="w-4 h-4 text-yellow-500" />
                <span>
                  {translations.bestTime}: {formatSeconds(stats.bestTime)}
                </span>
							</div>
						)}
					</div>

					<div className="space-y-2">
						<div className="flex justify-between text-sm">
							<span>{translations.accuracy}</span>
							<span>{accuracy.toFixed(1)}%</span>
						</div>
            <Progress value={accuracy} className="h-2" aria-label={translations.accuracy} />
					</div>
				</div>

				<DialogFooter className="flex gap-2">
					<Button variant="secondary" onClick={onClose}>
						{translations.close}
					</Button>
					<Button onClick={onClose}>{translations.playAgain}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
  )
}
