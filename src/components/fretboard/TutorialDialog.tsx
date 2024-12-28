import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TutorialDialogProps {
	isOpen: boolean;
	onClose: () => void;
	translations: {
		title: string;
		steps: string[];
		previous?: string;
		next?: string;
		start?: string;
		skip?: string;
	};
}

export const TutorialDialog: React.FC<TutorialDialogProps> = ({
	isOpen,
	onClose,
	translations,
}) => {
	const [currentStep, setCurrentStep] = useState(0);

	const handleNext = () => {
		if (currentStep < translations.steps.length - 1) {
			setCurrentStep((prev) => prev + 1);
		} else {
			handleClose();
		}
	};

	const handlePrevious = () => {
		if (currentStep > 0) {
			setCurrentStep((prev) => prev - 1);
		}
	};

	const handleClose = () => {
		setCurrentStep(0);
		onClose();
	};

	const isLastStep = currentStep === translations.steps.length - 1;

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold tracking-tight">
						{translations.title}
					</DialogTitle>
					<DialogDescription className="mt-4 leading-relaxed whitespace-pre-line">
						{translations.steps[currentStep]}
					</DialogDescription>
				</DialogHeader>

				<div className="flex justify-center mt-4">
					<div className="flex gap-1">
						{translations.steps.map((_, index) => (
							<div
								key={index}
								className={`h-1.5 w-8 rounded-full transition-colors ${
									index === currentStep ? "bg-primary" : "bg-muted"
								}`}
							/>
						))}
					</div>
				</div>

				<DialogFooter className="mt-6 flex justify-between gap-2">
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={handlePrevious}
							disabled={currentStep === 0}
							className="w-24"
						>
							{translations.previous || "Previous"}
						</Button>
						<Button onClick={handleNext} className="w-24">
							{isLastStep
								? translations.start || "Start"
								: translations.next || "Next"}
						</Button>
					</div>
					<Button variant="ghost" onClick={handleClose}>
						{translations.skip || "Skip Tutorial"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
