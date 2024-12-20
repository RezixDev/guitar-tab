"use client";

import React, { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import * as Pitchfinder from "pitchfinder";

interface TunerNote {
	note: string;
	frequency: number;
	string: number;
	range: [number, number];
}

const STANDARD_TUNING: TunerNote[] = [
	{ note: "E4", frequency: 329.63, string: 1, range: [327, 332] },
	{ note: "B3", frequency: 246.94, string: 2, range: [245, 249] },
	{ note: "G3", frequency: 196.0, string: 3, range: [194, 198] },
	{ note: "D3", frequency: 146.83, string: 4, range: [145, 149] },
	{ note: "A2", frequency: 110.0, string: 5, range: [108, 112] },
	{ note: "E2", frequency: 82.41, string: 6, range: [81, 84] },
];

type TuningStatus = "flat" | "sharp" | "in-tune" | null;

export function GuitarTuner() {
	const [selectedNote, setSelectedNote] = useState<TunerNote | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [volume, setVolume] = useState(0.5);
	const [isMicActive, setIsMicActive] = useState(false);
	const [detectedFrequency, setDetectedFrequency] = useState<number | null>(
		null
	);
	const [detectedNote, setDetectedNote] = useState<TunerNote | null>(null);
	const [tuningStatus, setTuningStatus] = useState<TuningStatus>(null);
	const [micError, setMicError] = useState<string | null>(null);
	const [tuningAccuracy, setTuningAccuracy] = useState(50);
	const [isAudioContextInitialized, setIsAudioContextInitialized] =
		useState(false);

	const audioContextRef = useRef<AudioContext | null>(null);
	const oscillatorRef = useRef<OscillatorNode | null>(null);
	const gainNodeRef = useRef<GainNode | null>(null);
	const analyserRef = useRef<AnalyserNode | null>(null);
	const micStreamRef = useRef<MediaStream | null>(null);
	const pitchDetectorRef = useRef<
		((input: Float32Array) => number | null) | null
	>(null);

	const initializeAudioContext = () => {
		console.log("Initializing AudioContext...");
		if (!audioContextRef.current) {
			try {
				audioContextRef.current = new (window.AudioContext ||
					(window as any).webkitAudioContext)();
				console.log("AudioContext created:", audioContextRef.current.state);
				console.log("Sample rate:", audioContextRef.current.sampleRate);

				gainNodeRef.current = audioContextRef.current.createGain();
				console.log("Gain node created");

				analyserRef.current = audioContextRef.current.createAnalyser();
				console.log("Analyser node created");

				gainNodeRef.current.connect(audioContextRef.current.destination);
				console.log("Audio nodes connected");

				// Initialize Pitchfinder with YIN algorithm
				const detector = Pitchfinder.YIN({
					sampleRate: audioContextRef.current.sampleRate,
					threshold: 0.2,
					probabilityThreshold: 0.5,
				});

				console.log("Pitch detector configured with:", {
					sampleRate: audioContextRef.current.sampleRate,
					threshold: 0.1,
					probabilityThreshold: 0.3,
				});

				pitchDetectorRef.current = detector;
				setIsAudioContextInitialized(true);
				console.log("AudioContext initialization complete");
			} catch (error) {
				console.error("Error initializing AudioContext:", error);
			}
		}

		// Resume AudioContext if it's in suspended state
		if (audioContextRef.current.state === "suspended") {
			audioContextRef.current.resume();
		}
	};

	useEffect(() => {
		return () => {
			if (micStreamRef.current) {
				micStreamRef.current.getTracks().forEach((track) => track.stop());
			}
			if (audioContextRef.current) {
				audioContextRef.current.close();
			}
		};
	}, []);

	const calculateCentsOffPitch = (
		detectedFreq: number,
		targetFreq: number
	): number => {
		return 1200 * Math.log2(detectedFreq / targetFreq);
	};

	const updateTuningStatus = (frequency: number, closestNote: TunerNote) => {
		const cents = calculateCentsOffPitch(frequency, closestNote.frequency);
		const accuracy = Math.max(0, Math.min(100, 50 + cents * 2));
		setTuningAccuracy(accuracy);

		if (Math.abs(cents) < 5) {
			setTuningStatus("in-tune");
		} else if (cents < -5) {
			setTuningStatus("flat");
		} else {
			setTuningStatus("sharp");
		}
	};

	const startMicrophoneInput = async () => {
		console.log("Starting microphone input...");
		try {
			if (!isAudioContextInitialized) {
				console.log("AudioContext not initialized, initializing...");
				initializeAudioContext();
			}

			console.log("Requesting microphone access...");
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: {
					echoCancellation: true,
					noiseSuppression: true,
					autoGainControl: true,
				},
			});
			console.log("Microphone access granted");
			micStreamRef.current = stream;

			if (
				!audioContextRef.current ||
				!analyserRef.current ||
				!pitchDetectorRef.current
			) {
				console.error("Required audio components not initialized:", {
					hasAudioContext: !!audioContextRef.current,
					hasAnalyser: !!analyserRef.current,
					hasDetector: !!pitchDetectorRef.current,
				});
				return;
			}

			console.log("Creating media stream source...");
			const micSource = audioContextRef.current.createMediaStreamSource(stream);
			micSource.connect(analyserRef.current);
			console.log("Microphone connected to analyser");

			analyserRef.current.fftSize = 2048;
			console.log("Analyser FFT size set to:", analyserRef.current.fftSize);
			const bufferLength = analyserRef.current.frequencyBinCount;
			const dataArray = new Float32Array(bufferLength);
			console.log("Buffer length:", bufferLength);

			// Set mic active first and create analysis function
			setIsMicActive(true);
			setMicError(null);

			// Small delay to ensure state is updated before starting analysis
			await new Promise((resolve) => setTimeout(resolve, 100));

			console.log("Starting pitch analysis loop");
			let isAnalyzing = true; // Local flag to control the analysis loop

			const analyzePitch = () => {
				if (!isAnalyzing || !analyserRef.current || !pitchDetectorRef.current) {
					console.log("Pitch analysis skipped:", {
						isAnalyzing,
						hasAnalyser: !!analyserRef.current,
						hasDetector: !!pitchDetectorRef.current,
					});
					return;
				}

				analyserRef.current.getFloatTimeDomainData(dataArray);

				// Log the first few values of the data array to verify we're getting audio data
				console.log("Audio buffer sample:", dataArray.slice(0, 5));

				const frequency = pitchDetectorRef.current(dataArray);
				console.log("Detected frequency:", frequency);

				if (frequency && frequency > 0) {
					setDetectedFrequency(frequency);

					const closestNote = STANDARD_TUNING.find(
						(note) => frequency >= note.range[0] && frequency <= note.range[1]
					);

					if (closestNote) {
						setDetectedNote(closestNote);
						updateTuningStatus(frequency, closestNote);
					}
				} else {
					setDetectedFrequency(null);
					setDetectedNote(null);
					setTuningStatus(null);
				}

				requestAnimationFrame(analyzePitch);
			};

			analyzePitch();
		} catch (error) {
			console.error("Microphone access error:", error);
			setMicError("Unable to access microphone. Please check permissions.");
			setIsMicActive(false);
		}
	};

	const stopMicrophoneInput = () => {
		console.log("Stopping microphone input");
		if (micStreamRef.current) {
			micStreamRef.current.getTracks().forEach((track) => {
				track.stop();
				console.log("Audio track stopped:", track.label);
			});
			micStreamRef.current = null;
		}

		// Disconnect any existing audio nodes
		if (analyserRef.current) {
			analyserRef.current.disconnect();
			console.log("Analyser disconnected");
		}

		setIsMicActive(false);
		setDetectedFrequency(null);
		setDetectedNote(null);
		setTuningStatus(null);
		console.log("Microphone input stopped completely");
	};

	const playNote = (note: TunerNote) => {
		if (!isAudioContextInitialized) {
			initializeAudioContext();
		}

		if (!audioContextRef.current || !gainNodeRef.current) return;

		if (oscillatorRef.current) {
			oscillatorRef.current.stop();
			oscillatorRef.current = null;
		}

		const osc = audioContextRef.current.createOscillator();
		osc.type = "sine";
		osc.frequency.setValueAtTime(
			note.frequency,
			audioContextRef.current.currentTime
		);
		osc.connect(gainNodeRef.current);
		gainNodeRef.current.gain.setValueAtTime(
			volume,
			audioContextRef.current.currentTime
		);

		osc.start();
		oscillatorRef.current = osc;
		setSelectedNote(note);
		setIsPlaying(true);
	};

	const stopNote = () => {
		if (oscillatorRef.current) {
			oscillatorRef.current.stop();
			oscillatorRef.current = null;
		}
		setIsPlaying(false);
		setSelectedNote(null);
	};

	const handleVolumeChange = (value: number[]) => {
		const newVolume = value[0];
		setVolume(newVolume);
		if (gainNodeRef.current && audioContextRef.current) {
			gainNodeRef.current.gain.setValueAtTime(
				newVolume,
				audioContextRef.current.currentTime
			);
		}
	};

	const toggleMicrophone = () => {
		console.log("Toggling microphone, current state:", isMicActive);
		if (isMicActive) {
			console.log("Stopping microphone input...");
			stopMicrophoneInput();
		} else {
			console.log("Starting microphone input...");
			startMicrophoneInput();
		}
	};

	return (
		<Card className="w-full max-w-screen-md mx-auto">
			<CardHeader>
				<CardTitle className="flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						<Guitar className="w-5 h-5" />
						Guitar Tuner
					</div>
					<Button
						variant={isMicActive ? "default" : "outline"}
						size="sm"
						onClick={toggleMicrophone}
						className="w-full sm:w-auto gap-2"
					>
						{isMicActive ? (
							<MicOff className="w-4 h-4" />
						) : (
							<Mic className="w-4 h-4" />
						)}
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
						<div className="space-y-4">
							<div className="text-center">
								<div className="text-3xl sm:text-4xl font-bold mb-2">
									{detectedNote?.note || "--"}
								</div>
								<div className="text-base sm:text-lg text-muted-foreground">
									{detectedFrequency
										? `${detectedFrequency.toFixed(1)} Hz`
										: "Listening..."}
								</div>
							</div>

							<div className="flex items-center justify-center gap-4">
								{tuningStatus && (
									<div
										className={cn(
											"flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-medium text-sm sm:text-base",
											tuningStatus === "in-tune" &&
												"bg-green-500/10 text-green-500",
											tuningStatus === "flat" && "bg-blue-500/10 text-blue-500",
											tuningStatus === "sharp" && "bg-red-500/10 text-red-500"
										)}
									>
										{tuningStatus === "in-tune" && (
											<Check className="w-4 h-4 sm:w-5 sm:h-5" />
										)}
										{tuningStatus === "flat" && (
											<ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
										)}
										{tuningStatus === "sharp" && (
											<ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
										)}
										<span className="capitalize">{tuningStatus}</span>
									</div>
								)}
							</div>

							{detectedNote && (
								<div className="space-y-2">
									<Progress value={tuningAccuracy} className="h-2" />
									<div className="flex justify-between text-xs text-muted-foreground">
										<span>♭ Flat</span>
										<span>In Tune</span>
										<span>Sharp ♯</span>
									</div>
								</div>
							)}

							{detectedNote && (
								<div className="text-center text-xs sm:text-sm text-muted-foreground">
									String {detectedNote.string} • Target:{" "}
									{detectedNote.frequency.toFixed(1)} Hz
								</div>
							)}
						</div>
					</div>
				)}

				<div className="flex items-center gap-4 mb-6">
					<VolumeX className="w-4 h-4 text-muted-foreground" />
					<Slider
						value={[volume]}
						max={1}
						step={0.01}
						onValueChange={handleVolumeChange}
						className="w-full"
					/>
					<Volume2 className="w-4 h-4 text-muted-foreground" />
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
					{STANDARD_TUNING.map((note) => (
						<div key={note.string} className="flex flex-col items-center">
							<Button
								variant={
									selectedNote?.note === note.note ? "default" : "outline"
								}
								size="lg"
								className={cn(
									"w-full aspect-square text-lg font-bold transition-all",
									selectedNote?.note === note.note &&
										"bg-primary text-primary-foreground ring-4 ring-primary/30",
									detectedNote?.note === note.note &&
										!selectedNote &&
										"ring-4 ring-green-500/30"
								)}
								onClick={() => {
									if (isPlaying && selectedNote?.note === note.note) {
										stopNote();
									} else {
										playNote(note);
									}
								}}
							>
								{note.note}
							</Button>
							<span className="mt-1 text-xs sm:text-sm text-muted-foreground">
								String {note.string}
							</span>
						</div>
					))}
				</div>

				<div className="mt-6 text-xs sm:text-sm text-muted-foreground text-center">
					{isMicActive
						? "Play a single string to detect its pitch"
						: "Click on a note to play/stop the reference tone"}
				</div>
			</CardContent>
		</Card>
	);
}
