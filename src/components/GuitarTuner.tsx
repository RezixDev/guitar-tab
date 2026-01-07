"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
	Guitar,
	Volume2,
	VolumeX,
	Mic,
	MicOff,
	AlertCircle,
	ArrowDown,
	ArrowUp,
	Check,
	Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import * as Pitchfinder from "pitchfinder";

type TunerNote = {
	note: string;
	frequency: number;
	string: number;
};

const STANDARD_TUNING: TunerNote[] = [
	{ note: "E4", frequency: 329.63, string: 1 },
	{ note: "B3", frequency: 246.94, string: 2 },
	{ note: "G3", frequency: 196.0, string: 3 },
	{ note: "D3", frequency: 146.83, string: 4 },
	{ note: "A2", frequency: 110.0, string: 5 },
	{ note: "E2", frequency: 82.41, string: 6 },
];

type TuningStatus = "flat" | "sharp" | "in-tune" | null;

const SMOOTHING_COUNT = 5;
const IN_TUNE_THRESHOLD_CENTS = 5;
const MIN_GUITAR_FREQUENCY = 70;
const MAX_GUITAR_FREQUENCY = 400;

export function GuitarTuner() {
	const [selectedNote, setSelectedNote] = useState<TunerNote | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(0.5);
	const [isMicActive, setIsMicActive] = useState(false);
	const [detectedFrequency, setDetectedFrequency] = useState<number | null>(null);
	const [detectedNote, setDetectedNote] = useState<TunerNote | null>(null);
	const [tuningStatus, setTuningStatus] = useState<TuningStatus>(null);
	const [micError, setMicError] = useState<string | null>(null);
	const [tuningAccuracy, setTuningAccuracy] = useState(50);
	const [isAudioContextInitialized, setIsAudioContextInitialized] = useState(false);

	const audioContextRef = useRef<AudioContext | null>(null);
	const oscillatorRef = useRef<OscillatorNode | null>(null);
	const gainNodeRef = useRef<GainNode | null>(null);
	const analyserRef = useRef<AnalyserNode | null>(null);
	const micStreamRef = useRef<MediaStream | null>(null);
	const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
	const pitchDetectorRef = useRef<((input: Float32Array) => number | null) | null>(null);
	const pitchHistoryRef = useRef<number[]>([]);
	const animationFrameRef = useRef<number | null>(null);

	const calculateCentsOffPitch = useCallback((detectedFreq: number, targetFreq: number): number => {
		return 1200 * Math.log2(detectedFreq / targetFreq);
	}, []);

	const findClosestNote = useCallback((frequency: number): TunerNote => {
		return STANDARD_TUNING.reduce((closest, note) => {
			const currentCents = Math.abs(calculateCentsOffPitch(frequency, note.frequency));
			const closestCents = Math.abs(calculateCentsOffPitch(frequency, closest.frequency));
			return currentCents < closestCents ? note : closest;
		});
	}, [calculateCentsOffPitch]);

	const initializeAudioContext = useCallback(() => {
		if (!audioContextRef.current) {
			try {
				audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
				gainNodeRef.current = audioContextRef.current.createGain();
				analyserRef.current = audioContextRef.current.createAnalyser();
				gainNodeRef.current.connect(audioContextRef.current.destination);

				const detector = Pitchfinder.YIN({
					sampleRate: audioContextRef.current.sampleRate,
					threshold: 0.15,
					probabilityThreshold: 0.1,
				});

				pitchDetectorRef.current = detector;
				setIsAudioContextInitialized(true);
			} catch (error) {
				console.error("Error initializing AudioContext:", error);
			}
		}
	}, []);

	useEffect(() => {
		return () => {
			if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
			if (micStreamRef.current) micStreamRef.current.getTracks().forEach((track) => track.stop());
			if (audioContextRef.current) audioContextRef.current.close();
		};
	}, []);

	const updateTuningStatus = useCallback((frequency: number, closestNote: TunerNote) => {
		const cents = calculateCentsOffPitch(frequency, closestNote.frequency);
		const accuracy = Math.max(0, Math.min(100, 50 + cents));
		setTuningAccuracy(accuracy);

		if (Math.abs(cents) < IN_TUNE_THRESHOLD_CENTS) {
			setTuningStatus("in-tune");
		} else if (cents < -IN_TUNE_THRESHOLD_CENTS) {
			setTuningStatus("flat");
		} else {
			setTuningStatus("sharp");
		}
	}, [calculateCentsOffPitch]);

	const startMicrophoneInput = async () => {
		try {
			if (!isAudioContextInitialized) initializeAudioContext();
			if (audioContextRef.current?.state === "suspended") await audioContextRef.current.resume();

			const stream = await navigator.mediaDevices.getUserMedia({
				audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
			});
			micStreamRef.current = stream;

			if (!audioContextRef.current || !analyserRef.current || !pitchDetectorRef.current) return;

			micSourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
			micSourceRef.current.connect(analyserRef.current);
			analyserRef.current.fftSize = 4096;
			const dataArray = new Float32Array(analyserRef.current.fftSize);

			pitchHistoryRef.current = [];
			setIsMicActive(true);
			setMicError(null);

			const analyzePitch = () => {
				if (!analyserRef.current || !pitchDetectorRef.current) return;
				analyserRef.current.getFloatTimeDomainData(dataArray);
				const frequency = pitchDetectorRef.current(dataArray);

				if (frequency && frequency > MIN_GUITAR_FREQUENCY && frequency < MAX_GUITAR_FREQUENCY) {
					pitchHistoryRef.current.push(frequency);
					if (pitchHistoryRef.current.length > SMOOTHING_COUNT) pitchHistoryRef.current.shift();
					const smoothedFrequency = pitchHistoryRef.current.reduce((a, b) => a + b, 0) / pitchHistoryRef.current.length;
					setDetectedFrequency(smoothedFrequency);
					const closestNote = findClosestNote(smoothedFrequency);
					setDetectedNote(closestNote);
					updateTuningStatus(smoothedFrequency, closestNote);
				} else if (!frequency && pitchHistoryRef.current.length === 0) {
					setDetectedFrequency(null);
					setDetectedNote(null);
					setTuningStatus(null);
				}
				animationFrameRef.current = requestAnimationFrame(analyzePitch);
			};
			analyzePitch();
		} catch (error) {
			setMicError("Unable to access microphone. Please check permissions.");
			setIsMicActive(false);
		}
	};

	const stopMicrophoneInput = useCallback(() => {
		if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
		if (micSourceRef.current) micSourceRef.current.disconnect();
		if (micStreamRef.current) micStreamRef.current.getTracks().forEach((t) => t.stop());
		pitchHistoryRef.current = [];
		setIsMicActive(false);
		setDetectedFrequency(null);
		setDetectedNote(null);
		setTuningStatus(null);
	}, []);

	const playNote = (note: TunerNote) => {
		if (!isAudioContextInitialized) initializeAudioContext();
		if (!audioContextRef.current || !gainNodeRef.current) return;
		if (audioContextRef.current.state === "suspended") audioContextRef.current.resume();

		if (oscillatorRef.current) oscillatorRef.current.stop();
		const osc = audioContextRef.current.createOscillator();
		osc.type = "sine";
		osc.frequency.setValueAtTime(note.frequency, audioContextRef.current.currentTime);
		osc.connect(gainNodeRef.current);
		gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
		osc.start();
		oscillatorRef.current = osc;
		setSelectedNote(note);
		setIsPlaying(true);
	};

	const stopNote = () => {
		if (oscillatorRef.current) oscillatorRef.current.stop();
		setIsPlaying(false);
		setSelectedNote(null);
	};

	const handleVolumeChange = (value: number[]) => {
		setVolume(value[0]);
		if (gainNodeRef.current && audioContextRef.current) {
			gainNodeRef.current.gain.setValueAtTime(value[0], audioContextRef.current.currentTime);
		}
	};

	const toggleMicrophone = () => isMicActive ? stopMicrophoneInput() : startMicrophoneInput();

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<div className="lg:col-span-2">
				<Card className="w-full">
					<CardHeader>
						<CardTitle className="flex flex-col sm:flex-row items-center justify-between gap-4">
							<div className="flex items-center gap-2">
								<Guitar className="w-5 h-5" />
								Guitar Tuner
							</div>
							<Button variant={isMicActive ? "default" : "outline"} size="sm" onClick={toggleMicrophone} className="w-full sm:w-auto gap-2">
								{isMicActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
								{isMicActive ? "Stop" : "Start"} Tuning
							</Button>
						</CardTitle>
					</CardHeader>
					<CardContent>
						{micError && (
							<Alert variant="destructive" className="mb-6">
								<AlertCircle className="h-4 w-4" />
								<AlertTitle>Error</AlertTitle>
								<AlertDescription>{micError}</AlertDescription>
							</Alert>
						)}

						{isMicActive && (
							<div className="mb-6 p-4 sm:p-6 bg-muted rounded-lg">
								<div className="space-y-4 text-center">
									<div className="text-3xl sm:text-4xl font-bold mb-2">{detectedNote?.note || "--"}</div>
									<div className="text-base sm:text-lg text-muted-foreground">
										{detectedFrequency ? `${detectedFrequency.toFixed(1)} Hz` : "Listening..."}
									</div>

									{tuningStatus && (
										<div
											role="status"
											aria-live="polite"
											className={cn(
												"inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium mx-auto",
												tuningStatus === "in-tune" && "bg-green-500/10 text-green-500",
												tuningStatus === "flat" && "bg-blue-500/10 text-blue-500",
												tuningStatus === "sharp" && "bg-red-500/10 text-red-500"
											)}
										>
											{tuningStatus === "in-tune" && <Check className="w-5 h-5" />}
											{tuningStatus === "flat" && <ArrowDown className="w-5 h-5" />}
											{tuningStatus === "sharp" && <ArrowUp className="w-5 h-5" />}
											<span className="capitalize">{tuningStatus}</span>
										</div>
									)}

									{detectedNote && (
										<div className="space-y-2 mt-4">
											<Progress
												value={tuningAccuracy}
												className="h-2"
												aria-label="Tuning accuracy"
												aria-valuetext={
													tuningStatus === "in-tune" ? "In Tune" :
														tuningStatus === "flat" ? "Flat" :
															tuningStatus === "sharp" ? "Sharp" : undefined
												}
											/>
											<div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
												<span>♭ Flat</span>
												<span>In Tune</span>
												<span>Sharp ♯</span>
											</div>
											<div className="text-xs sm:text-sm text-muted-foreground">
												String {detectedNote.string} • Target: {detectedNote.frequency.toFixed(1)} Hz
											</div>
										</div>
									)}
								</div>
							</div>
						)}

						<div className="flex items-center gap-4 mb-6">
							<VolumeX className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
							<Slider value={[volume]} max={1} step={0.01} onValueChange={handleVolumeChange} className="w-full" aria-label="Volume" />
							<Volume2 className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
						</div>

						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
							{STANDARD_TUNING.map((note) => (
								<div key={note.string} className="flex flex-col items-center">
									<Button
										variant={selectedNote?.note === note.note ? "default" : "outline"}
										size="lg"
										className={cn(
											"w-full aspect-square text-lg font-bold transition-all",
											selectedNote?.note === note.note && "bg-primary text-primary-foreground ring-4 ring-primary/30",
											detectedNote?.note === note.note && !selectedNote && "ring-4 ring-green-500/30"
										)}
										onClick={() => isPlaying && selectedNote?.note === note.note ? stopNote() : playNote(note)}
										aria-label={`Play reference note ${note.note}`}
										aria-pressed={selectedNote?.note === note.note}
									>
										{note.note}
									</Button>
									<span className="mt-1 text-xs sm:text-sm text-muted-foreground">String {note.string}</span>
								</div>
							))}
						</div>

						<div className="mt-6 text-xs sm:text-sm text-muted-foreground text-center">
							{isMicActive ? "Play a single string to detect its pitch" : "Click on a note to play/stop the reference tone"}
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="lg:col-span-1">
				<Card>
					<CardHeader><CardTitle className="flex items-center gap-2"><Info className="w-5 h-5" />Tuning Guide</CardTitle></CardHeader>
					<CardContent>
						<Accordion type="single" collapsible className="w-full">
							<AccordionItem value="standard-tuning">
								<AccordionTrigger>Standard Tuning (EADGBe)</AccordionTrigger>
								<AccordionContent>
									<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
										<li>6th (thickest): E2 (82.41 Hz)</li>
										<li>5th: A2 (110.00 Hz)</li>
										<li>4th: D3 (146.83 Hz)</li>
										<li>3rd: G3 (196.00 Hz)</li>
										<li>2nd: B3 (246.94 Hz)</li>
										<li>1st (thinnest): E4 (329.63 Hz)</li>
									</ul>
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="how-to-tune">
								<AccordionTrigger>How to Tune</AccordionTrigger>
								<AccordionContent>
									<ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
										<li>Click "Start Tuning"</li>
										<li>Play a single string</li>
										<li>Adjust peg until "In Tune" appears</li>
									</ol>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}