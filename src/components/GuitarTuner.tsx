import { useState, useEffect, useRef } from 'react';
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
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface TunerNote {
  note: string;
  frequency: number;
  string: number;
  range: [number, number];
}

// Expanded tuning data with frequency ranges
const STANDARD_TUNING: TunerNote[] = [
  { note: 'E4', frequency: 329.63, string: 1, range: [327, 332] },
  { note: 'B3', frequency: 246.94, string: 2, range: [245, 249] },
  { note: 'G3', frequency: 196.00, string: 3, range: [194, 198] },
  { note: 'D3', frequency: 146.83, string: 4, range: [145, 149] },
  { note: 'A2', frequency: 110.00, string: 5, range: [108, 112] },
  { note: 'E2', frequency: 82.41, string: 6, range: [81, 84] },
];

const autoCorrelate = (buffer: Float32Array, sampleRate: number) => {
  const bufferSize = buffer.length;
  const correlations = new Float32Array(bufferSize);
  
  for (let lag = 0; lag < bufferSize; lag++) {
    let sum = 0;
    for (let i = 0; i < bufferSize - lag; i++) {
      sum += buffer[i] * buffer[i + lag];
    }
    correlations[lag] = sum / (bufferSize - lag);
  }
  
  let maxCorrelation = -1;
  let maxLag = -1;
  
  for (let lag = 1; lag < bufferSize; lag++) {
    if (correlations[lag] > maxCorrelation) {
      maxCorrelation = correlations[lag];
      maxLag = lag;
    }
  }
  
  return sampleRate / maxLag;
};

const detectPitch = (buffer: Float32Array, sampleRate: number): number | null => {
    const minFreq = 70;  // E2 is about 82Hz
    const maxFreq = 350; // E4 is about 330Hz
    const minPeriod = Math.floor(sampleRate / maxFreq);
    const maxPeriod = Math.floor(sampleRate / minFreq);
    
    let bestCorrelation = 0;
    let bestPeriod = 0;
    
    // Find the peak correlation
    for (let period = minPeriod; period < maxPeriod; period++) {
      let correlation = 0;
      
      for (let i = 0; i < buffer.length - period; i++) {
        correlation += Math.abs(buffer[i] - buffer[i + period]);
      }
      
      correlation = 1 - correlation / (buffer.length - period);
      
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestPeriod = period;
      }
    }
    
    if (bestCorrelation > 0.8) { // Correlation threshold
      return sampleRate / bestPeriod;
    }
    
    return null;
  };
  
  const findClosestNote = (frequency: number): { note: TunerNote, cents: number } | null => {
    let closestNote: TunerNote | null = null;
    let minCentsDiff = Infinity;
    
    STANDARD_TUNING.forEach(note => {
      const cents = 1200 * Math.log2(frequency / note.frequency);
      if (Math.abs(cents) < Math.abs(minCentsDiff)) {
        minCentsDiff = cents;
        closestNote = note;
      }
    });
    
    return closestNote ? { note: closestNote, cents: minCentsDiff } : null;
  };
  
export function GuitarTuner() {
  const [selectedNote, setSelectedNote] = useState<TunerNote | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMicActive, setIsMicActive] = useState(false);
  const [detectedFrequency, setDetectedFrequency] = useState<number | null>(null);
  const [detectedNote, setDetectedNote] = useState<TunerNote | null>(null);
  const [tuningStatus, setTuningStatus] = useState<'flat' | 'sharp' | 'in-tune' | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.connect(audioContextRef.current.destination);
    analyserRef.current = audioContextRef.current.createAnalyser();

    return () => {
      audioContextRef.current?.close();
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const playNote = (note: TunerNote) => {
    if (!audioContextRef.current || !gainNodeRef.current) return;
    
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }

    const osc = audioContextRef.current.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(note.frequency, audioContextRef.current.currentTime);
    osc.connect(gainNodeRef.current);
    gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
    
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
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(newVolume, audioContextRef.current?.currentTime || 0);
    }
  };

  const startMicrophoneInput = async () => {
    try {
      if (!audioContextRef.current || !analyserRef.current) return;
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      
      const micSource = audioContextRef.current.createMediaStreamSource(stream);
      micSource.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 2048;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Float32Array(bufferLength);
      
      setIsMicActive(true);
      setMicError(null);
      
      const analyzePitch = () => {
        if (!isMicActive || !analyserRef.current) return;
        
        analyserRef.current.getFloatTimeDomainData(dataArray);
        const frequency = autoCorrelate(dataArray, audioContextRef.current!.sampleRate);
        
        if (frequency > 0) {
          setDetectedFrequency(frequency);
          
          // Find the closest note
          const closestNote = STANDARD_TUNING.find(note => 
            frequency >= note.range[0] && frequency <= note.range[1]
          );
          
          if (closestNote) {
            setDetectedNote(closestNote);
            
            // Determine if the note is flat, sharp, or in tune
            const cents = 1200 * Math.log2(frequency / closestNote.frequency);
            if (Math.abs(cents) < 5) {
              setTuningStatus('in-tune');
            } else if (cents < -5) {
              setTuningStatus('flat');
            } else {
              setTuningStatus('sharp');
            }
          }
        }
        
        requestAnimationFrame(analyzePitch);
      };
      
      analyzePitch();
      
    } catch (error) {
      console.error('Microphone access error:', error);
      setMicError('Unable to access microphone. Please check permissions.');
      setIsMicActive(false);
    }
  };

  const stopMicrophoneInput = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    setIsMicActive(false);
    setDetectedFrequency(null);
    setDetectedNote(null);
    setTuningStatus(null);
  };

  const toggleMicrophone = () => {
    if (isMicActive) {
      stopMicrophoneInput();
    } else {
      startMicrophoneInput();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Guitar className="w-5 h-5" />
            Guitar Tuner
          </div>
          <Button
            variant={isMicActive ? "default" : "outline"}
            size="sm"
            onClick={toggleMicrophone}
            className="gap-2"
          >
            {isMicActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isMicActive ? 'Stop' : 'Start'} Tuning
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

        {/* Enhanced Tuning Display */}
        {isMicActive && (
          <div className="mb-6 p-6 bg-muted rounded-lg">
            <div className="space-y-4">
              {/* Current Note and Frequency */}
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {detectedNote?.note || '--'}
                </div>
                <div className="text-lg text-muted-foreground">
                  {detectedFrequency ? `${detectedFrequency.toFixed(1)} Hz` : 'Listening...'}
                </div>
              </div>

              {/* Tuning Status Indicator */}
              <div className="flex items-center justify-center gap-4">
                {tuningStatus && (
                  <div className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full font-medium",
                    tuningStatus === 'in-tune' && "bg-green-500/10 text-green-500",
                    tuningStatus === 'flat' && "bg-blue-500/10 text-blue-500",
                    tuningStatus === 'sharp' && "bg-red-500/10 text-red-500"
                  )}>
                    {tuningStatus === 'in-tune' && <Check className="w-5 h-5" />}
                    {tuningStatus === 'flat' && <ArrowDown className="w-5 h-5" />}
                    {tuningStatus === 'sharp' && <ArrowUp className="w-5 h-5" />}
                    <span className="capitalize">{tuningStatus}</span>
                  </div>
                )}
              </div>

              {/* Tuning Meter */}
              {detectedNote && (
                <div className="space-y-2">
                  <Progress 
                    value={50} // This should be calculated based on cents deviation
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>♭ Flat</span>
                    <span>In Tune</span>
                    <span>Sharp ♯</span>
                  </div>
                </div>
              )}

              {/* Closest String Indicator */}
              {detectedNote && (
                <div className="text-center text-sm text-muted-foreground">
                  String {detectedNote.string} • Target: {detectedNote.frequency.toFixed(1)} Hz
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rest of the component remains the same... */}
        {/* Volume Control */}
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

        {/* Reference Tones */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
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
              <span className="mt-1 text-sm text-muted-foreground">
                String {note.string}
              </span>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-sm text-muted-foreground text-center">
          {isMicActive ? (
            "Play a single string to detect its pitch"
          ) : (
            "Click on a note to play/stop the reference tone"
          )}
        </div>
      </CardContent>
    </Card>
  );
}