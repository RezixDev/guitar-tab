"use client"

import { useEffect, useMemo } from "react"
import * as Tone from "tone"

const URLS = {
  A2: "A2.mp3",
  "A#2": "A#2.mp3",
  B2: "B2.mp3",
  C3: "C3.mp3",
  "C#3": "C#3.mp3",
  D3: "D3.mp3",
  "D#3": "D#3.mp3",
  E3: "E3.mp3",
  F3: "F3.mp3",
  "F#3": "F#3.mp3",
  G3: "G3.mp3",
  "G#3": "G#3.mp3",
  A3: "A3.mp3",
  "A#3": "A#3.mp3",
  B3: "B3.mp3",
  C4: "C4.mp3",
  "C#4": "C#4.mp3",
  D4: "D4.mp3",
  "D#4": "D#4.mp3",
  E4: "E4.mp3",
  F4: "F4.mp3",
  "F#4": "F#4.mp3",
  G4: "G4.mp3",
  "G#4": "G#4.mp3",
  A4: "A4.mp3",
  "A#4": "A#4.mp3",
  B4: "B4.mp3",
  C5: "C5.mp3",
  "C#5": "C#5.mp3",
  D5: "D5.mp3",
  "D#5": "D#5.mp3",
} as const

type Note = keyof typeof URLS

type AudioPlayerProps = {
  notes: readonly Note[]
}

export default function AudioPlayer({ notes }: AudioPlayerProps) {
  const sampler = useMemo(
    () => new Tone.Sampler(URLS, () => {}, "samples/").toDestination(),
    []
  )

  useEffect(() => {
    if (!sampler.loaded || notes.length === 0) return
    const now = Tone.now()
    notes.forEach((n, i) => {
      sampler.triggerAttackRelease(n, "8n", now + i * 0.1)
    })
  }, [notes, sampler])

  useEffect(() => {
    return () => {
      sampler.disconnect()
      sampler.dispose()
    }
  }, [sampler])

  return null
}
