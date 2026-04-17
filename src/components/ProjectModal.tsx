import { useEffect, useRef, useState } from 'react'

export interface ModalProject {
  num: string
  title: string
  type: string
  body: string
  tags: string[]
  images: string[]
  placeholderHue: number
}

interface Props {
  project: ModalProject | null
  onClose: () => void
}

// ── Shared: decorative placeholder slide ────────────────────────
function Placeholder({ hue, num }: { hue: number; num: string }) {
  return (
    <div
      className="absolute inset-0 flex items-end justify-end"
      style={{ background: `hsl(${hue} 14% 16%)` }}
    >
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 0,transparent 44px),' +
            'repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 0,transparent 44px)',
        }}
      />
      <span
        className="relative font-display font-bold leading-none select-none pr-6 pb-5"
        style={{
          fontSize: 'clamp(4rem, 10vw, 9rem)',
          color: `hsl(${hue} 18% 26%)`,
        }}
      >
        {num}
      </span>
    </div>
  )
}

// ── Shared: carousel arrows ──────────────────────────────────────
function CarouselArrow({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={[
        'absolute top-1/2 -translate-y-1/2 z-10',
        'w-8 h-8 rounded-full bg-black/55 hover:bg-black/80 flex items-center justify-center transition-colors',
        dir === 'prev' ? 'left-3' : 'right-3',
      ].join(' ')}
      aria-label={dir === 'prev' ? 'Προηγούμενο' : 'Επόμενο'}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {dir === 'prev'
          ? <polyline points="15 18 9 12 15 6" />
          : <polyline points="9 18 15 12 9 6" />
        }
      </svg>
    </button>
  )
}

// ── Shared: slide dots ───────────────────────────────────────────
function SlideDots({ count, current, onGo }: { count: number; current: number; onGo: (i: number) => void }) {
  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onGo(i)}
          className={[
            'rounded-full transition-all duration-200',
            i === current
              ? 'bg-white w-4 h-1.5'
              : 'bg-white/40 hover:bg-white/70 w-1.5 h-1.5',
          ].join(' ')}
          aria-label={`Slide ${i + 1}`}
        />
      ))}
    </div>
  )
}

export default function ProjectModal({ project, onClose }: Props) {
  const [slide, setSlide]   = useState(0)
  const [fading, setFading] = useState(false)
  const touchStartX         = useRef<number | null>(null)

  const slideCount = project ? (project.images.length || 1) : 1

  const goTo = (next: number) => {
    if (next === slide || fading) return
    setFading(true)
    setTimeout(() => { setSlide(next); setFading(false) }, 150)
  }
  const prev = () => goTo((slide - 1 + slideCount) % slideCount)
  const next = () => goTo((slide + 1) % slideCount)

  useEffect(() => { setSlide(0); setFading(false) }, [project])

  // Keyboard
  useEffect(() => {
    if (!project) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft')  prev()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [project, slide, fading])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = project ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [project])

  if (!project) return null

  const currentImg = project.images[slide] ?? null

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev()
    touchStartX.current = null
  }

  // ── Shared carousel panel content ────────────────────────────
  const carouselContent = (
    <div
      className="absolute inset-0"
      style={{ opacity: fading ? 0 : 1, transition: 'opacity 150ms' }}
    >
      {currentImg
        ? <img src={currentImg} alt={project.title} className="absolute inset-0 w-full h-full object-contain" />
        : <Placeholder hue={project.placeholderHue} num={project.num} />
      }
    </div>
  )

  // ── Shared info body content ──────────────────────────────────
  const infoBody = (
    <div className="flex flex-col gap-5">
      <p className="text-[0.9rem] leading-[1.85] text-gray-700">{project.body}</p>
      <hr className="border-gray-100" />
      <div>
        <span className="block text-[10px] font-bold tracking-[0.16em] uppercase text-gray-400 mb-3">
          Χαρακτηριστικά
        </span>
        <div className="flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <span
              key={tag}
              className="text-[10px] font-bold tracking-[0.1em] uppercase px-3 py-1.5 rounded-full border border-pk-purple-border bg-pk-purple-pale text-pk-purple whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <hr className="border-gray-100" />
      <button
        onClick={onClose}
        className="self-start text-[11px] font-bold tracking-[0.08em] uppercase text-white bg-pk-purple px-5 py-2.5 rounded-lg hover:bg-pk-purple-hover transition-colors duration-200"
      >
        Επικοινωνήστε →
      </button>
    </div>
  )

  return (
    <div
      className="fixed inset-0 z-[1000]"
      role="dialog"
      aria-modal="true"
    >

      {/* ═══════════════════════════════════════════════
          DESKTOP  (md+): centred dialog with backdrop
          ═══════════════════════════════════════════════ */}
      <div className="hidden md:flex absolute inset-0 items-center justify-center p-6">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

        {/* Dialog */}
        <div className="relative z-10 flex w-full max-w-[1200px] rounded-2xl overflow-hidden shadow-2xl" style={{ height: 'min(90vh, 760px)' }}>

          {/* Left: carousel */}
          <div
            className="relative flex-1 bg-[#111] flex items-center justify-center overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {carouselContent}
            {slideCount > 1 && (
              <>
                <CarouselArrow dir="prev" onClick={prev} />
                <CarouselArrow dir="next" onClick={next} />
                <SlideDots count={slideCount} current={slide} onGo={goTo} />
                <span className="absolute top-3 right-3 text-[11px] font-bold text-white/75 bg-black/50 px-2.5 py-1 rounded-full z-10">
                  {slide + 1} / {slideCount}
                </span>
              </>
            )}
          </div>

          {/* Right: info panel */}
          <div className="flex-[0_0_400px] bg-white flex flex-col overflow-hidden border-l border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-pk-purple-pale border-2 border-pk-purple flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-[0.72rem] font-bold text-pk-purple leading-none">{project.num}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[0.85rem] font-bold text-gray-900 leading-tight truncate">{project.title}</p>
                  <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-pk-purple mt-0.5 truncate">{project.type}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 ml-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Κλείσιμο"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 py-6">
              {infoBody}
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          MOBILE  (< md): full-screen Instagram sheet
          ═══════════════════════════════════════════════ */}
      <div className="md:hidden absolute inset-0 bg-white flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 h-[52px] border-b border-gray-100">
          {/* Back arrow */}
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Πίσω"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="text-[0.85rem] font-bold text-gray-900">Έργο</span>
          {/* Spacer to balance layout */}
          <div className="w-9" />
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">

          {/* Image carousel – square like Instagram */}
          <div
            className="relative w-full bg-[#111] overflow-hidden"
            style={{ aspectRatio: '1 / 1' }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {carouselContent}
            {slideCount > 1 && (
              <>
                <SlideDots count={slideCount} current={slide} onGo={goTo} />
                <span className="absolute top-3 right-3 text-[11px] font-bold text-white/75 bg-black/50 px-2.5 py-1 rounded-full z-10">
                  {slide + 1} / {slideCount}
                </span>
              </>
            )}
          </div>

          {/* Post header (avatar + title) — below image, like Instagram */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
            <div className="w-9 h-9 rounded-full bg-pk-purple-pale border-2 border-pk-purple flex items-center justify-center flex-shrink-0">
              <span className="font-display text-[0.65rem] font-bold text-pk-purple leading-none">{project.num}</span>
            </div>
            <div className="min-w-0">
              <p className="text-[0.82rem] font-bold text-gray-900 leading-tight truncate">{project.title}</p>
              <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-pk-purple mt-0.5 truncate">{project.type}</p>
            </div>
          </div>

          {/* Caption & tags */}
          <div className="px-4 py-5">
            {infoBody}
          </div>

        </div>
      </div>

    </div>
  )
}
