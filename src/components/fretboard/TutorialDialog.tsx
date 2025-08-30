import { useState } from "react"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type TutorialDialogProps = {
	isOpen: boolean
	onClose: () => void
	translations: {
		title: string
		steps: readonly string[]
		previous?: string
		next?: string
		start?: string
		skip?: string
	}
}

export function TutorialDialog({ isOpen, onClose, translations }: TutorialDialogProps) {
	const [currentStep, setCurrentStep] = useState(0)
	const lastIndex = translations.steps.length - 1
	const isLast = currentStep === lastIndex

	const handleNext = () => {
		if (!isLast) setCurrentStep((s) => s + 1)
		else handleClose()
	}

	const handlePrev = () => {
		if (currentStep > 0) setCurrentStep((s) => s - 1)
	}

	const handleClose = () => {
		setCurrentStep(0)
		onClose()
	}

	return (
		<Dialog open={isOpen} onOpenChange={(open) => (!open ? handleClose() : null)}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold tracking-tight">
						{translations.title}
					</DialogTitle>
					<DialogDescription className="mt-4 whitespace-pre-line leading-relaxed">
						{translations.steps[currentStep]}
					</DialogDescription>
				</DialogHeader>

				<div className="mt-4 flex justify-center">
					<div className="flex gap-1" aria-label="progress">
						{translations.steps.map((_, i) => (
							<div
								key={i}
								className={`h-1.5 w-8 rounded-full transition-colors ${
									i === currentStep ? "bg-primary" : "bg-muted"
								}`}
							/>
						))}
					</div>
				</div>

				<DialogFooter className="mt-6 flex justify-between gap-2">
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={handlePrev}
							disabled={currentStep === 0}
							className="w-24"
						>
							{translations.previous ?? "Previous"}
						</Button>
						<Button onClick={handleNext} className="w-24">
							{isLast ? translations.start ?? "Start" : translations.next ?? "Next"}
						</Button>
					</div>
					<Button variant="ghost" onClick={handleClose}>
						{translations.skip ?? "Skip Tutorial"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
