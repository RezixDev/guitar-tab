import { useEffect } from "react"
import { getAudioContext } from "../utils/audioContext"

export function AudioComponent() {
  useEffect(() => {
    const audioContext = getAudioContext()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime)

    oscillator.start()
    oscillator.stop(audioContext.currentTime + 1)

      return () => {
      oscillator.disconnect()
      gainNode.disconnect()
      // don't close shared context if your app reuses it
      if (audioContext.state !== "closed") {
        void audioContext.close()
      }
    }
  }, [])

  return <div>Audio Component</div>
}
