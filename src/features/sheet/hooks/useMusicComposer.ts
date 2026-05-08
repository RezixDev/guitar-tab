import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { SheetNote } from "@shared/types/sheet";
import { staffConfig } from "../data/music";
import { SheetAudioManager } from "../utils/SheetAudioManager";
import {
  createNoteFromClick,
  findNoteAtPosition,
  sortNotesByPosition,
} from "../utils/noteUtils";

export function useMusicComposer() {
  const [notes, setNotes] = useState<SheetNote[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);
  const [selectedDuration, setSelectedDuration] = useState("quarter");
  const [tempo, setTempo] = useState(120);
  const [volume, setVolume] = useState<number[]>([-10]);
  const [playbackStartIndex, setPlaybackStartIndex] = useState(0);
  const [playheadPosition, setPlayheadPosition] = useState(-1);

  const audioManagerRef = useRef<SheetAudioManager | null>(null);

  useEffect(() => {
    audioManagerRef.current = new SheetAudioManager();
    audioManagerRef.current.initialize(volume[0]);
    const ref = audioManagerRef.current;
    return () => {
      ref?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    audioManagerRef.current?.updateVolume(volume[0]);
  }, [volume]);

  useEffect(() => {
    audioManagerRef.current?.updateTempo(tempo);
  }, [tempo]);

  const stopPlayback = () => {
    audioManagerRef.current?.stopSequence();
    setIsPlaying(false);
    setCurrentNoteIndex(-1);
    setPlayheadPosition(-1);
  };

  const handleCanvasClick = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedIdx = findNoteAtPosition(notes, x, y);
    if (clickedIdx !== -1 && e.shiftKey) {
      setPlaybackStartIndex(clickedIdx);
      return;
    }

    const newNote = createNoteFromClick(x, y, selectedDuration);
    if (!newNote) return;

    audioManagerRef.current?.playPreviewNote(newNote.pitch);
    setNotes((prev) => sortNotesByPosition([...prev, newNote]));
  };

  const playNotes = async () => {
    if (!audioManagerRef.current) return;
    if (isPlaying) {
      stopPlayback();
      return;
    }
    if (notes.length === 0) return;

    await audioManagerRef.current.playSequence(
      notes,
      playbackStartIndex,
      (idx, x) => {
        setCurrentNoteIndex(idx);
        setPlayheadPosition(staffConfig.leftMargin + x);
      },
      stopPlayback,
    );
    setIsPlaying(true);
  };

  const clearNotes = () => {
    stopPlayback();
    setNotes([]);
    setPlaybackStartIndex(0);
  };

  const deleteLastNote = () => {
    if (notes.length === 0) return;
    const next = notes.slice(0, -1);
    setNotes(next);
    if (playbackStartIndex >= next.length) {
      setPlaybackStartIndex(Math.max(0, next.length - 1));
    }
  };

  const moveStartPoint = (direction: "prev" | "next") => {
    if (notes.length === 0) return;
    if (direction === "prev") {
      setPlaybackStartIndex((p) => Math.max(0, p - 1));
    } else {
      setPlaybackStartIndex((p) => Math.min(notes.length - 1, p + 1));
    }
  };

  const resetStartPoint = () => setPlaybackStartIndex(0);

  return {
    notes,
    isPlaying,
    currentNoteIndex,
    selectedDuration,
    tempo,
    volume,
    playbackStartIndex,
    playheadPosition,
    handleCanvasClick,
    playNotes,
    clearNotes,
    deleteLastNote,
    moveStartPoint,
    resetStartPoint,
    setSelectedDuration,
    setTempo,
    setVolume,
  };
}
