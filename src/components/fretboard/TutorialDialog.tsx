
// components/TutorialDialog.tsx
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { tutorialSteps } from '@/constants/tutorialSteps';

interface TutorialDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TutorialDialog: React.FC<TutorialDialogProps> = ({
                                                                  isOpen,
                                                                  onClose,
                                                              }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleClose();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleClose = () => {
        setCurrentStep(0);
        onClose();
    };

    const isLastStep = currentStep === tutorialSteps.length - 1;
    const currentTutorialStep = tutorialSteps[currentStep];

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold tracking-tight">
                        {currentTutorialStep.title}
                    </DialogTitle>
                    <DialogDescription className="mt-4 leading-relaxed whitespace-pre-line">
                        {currentTutorialStep.content}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-center mt-4">
                    <div className="flex gap-1">
                        {tutorialSteps.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1.5 w-8 rounded-full transition-colors ${
                                    index === currentStep
                                        ? 'bg-primary'
                                        : 'bg-muted'
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
                            Previous
                        </Button>
                        <Button
                            onClick={handleNext}
                            className="w-24"
                        >
                            {isLastStep ? 'Start' : 'Next'}
                        </Button>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={handleClose}
                    >
                        Skip Tutorial
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// Optional: Progress Indicator Component for reusability
interface ProgressIndicatorProps {
    steps: number;
    currentStep: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
                                                                 steps,
                                                                 currentStep,
                                                             }) => {
    return (
        <div className="flex justify-center mt-4">
            <div className="flex gap-1">
                {Array.from({ length: steps }).map((_, index) => (
                    <div
                        key={index}
                        className={`h-1.5 w-8 rounded-full transition-colors ${
                            index === currentStep
                                ? 'bg-primary'
                                : 'bg-muted'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};