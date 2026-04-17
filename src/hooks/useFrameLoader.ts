import { useEffect, useRef, useState } from 'react'

export function useFrameLoader(frameCount: number, prefix = '/frames/') {
  const frames = useRef<(HTMLImageElement | null)[]>(new Array(frameCount).fill(null))
  const [loadedCount, setLoadedCount] = useState(0)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let loaded = 0

    const loadFrame = (i: number) => {
      const img = new Image()
      img.src = `${prefix}frame_${String(i).padStart(4, '0')}.webp`
      img.onload = () => {
        frames.current[i - 1] = img
        loaded++
        setLoadedCount(loaded)
        if (loaded >= frameCount) setIsReady(true)
      }
      img.onerror = () => {
        loaded++
        setLoadedCount(loaded)
        if (loaded >= frameCount) setIsReady(true)
      }
    }

    // Phase 1: first 10 for fast first paint
    for (let i = 1; i <= 10; i++) loadFrame(i)
    // Phase 2: rest
    for (let i = 11; i <= frameCount; i++) loadFrame(i)
  }, [frameCount])

  return {
    frames: frames.current,
    progress: loadedCount / frameCount,
    isReady,
  }
}
