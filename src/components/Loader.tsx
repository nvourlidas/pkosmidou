import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface Props {
  progress: number
  isReady: boolean
  onHidden: () => void
}

export default function Loader({ progress, isReady, onHidden }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isReady || !ref.current) return
    gsap.to(ref.current, {
      opacity: 0,
      duration: 0.55,
      delay: 0.2,
      ease: 'power2.out',
      onComplete: onHidden,
    })
  }, [isReady, onHidden])

  const pct = Math.round(progress * 100)

  return (
    <div
      ref={ref}
      className="fixed inset-0 bg-white z-[9999] flex items-center justify-center"
    >
      <div className="text-center w-64">
        <span className="block font-display text-xl font-bold tracking-wide text-gray-900 mb-7">
          Πασχαλία Κοσμίδου
        </span>
        <div className="w-full h-px bg-gray-200 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-pk-purple rounded-full transition-[width] duration-150 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-[11px] font-bold tracking-[0.16em] text-gray-400 uppercase">
          {pct}%
        </span>
      </div>
    </div>
  )
}
