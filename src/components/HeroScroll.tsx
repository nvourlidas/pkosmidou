import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const FRAME_COUNT = 192
const FRAME_SPEED = 1.6
const IMAGE_SCALE = 0.92

const STAGES = [
  {
    eyebrow: 'Πολιτικός Μηχανικός',
    heading: 'Σχεδιάζουμε\nχώρους που\nαντέχουν\nστον χρόνο.',
    body: 'Ολοκληρωμένες μελέτες και επίβλεψη κατασκευών με ακρίβεια, επιστημονική κατάρτιση και σεβασμό στις ανάγκες σας.',
    cta: null,
  },
  {
    eyebrow: 'Τεχνογνωσία & Ακρίβεια',
    heading: 'Κάθε έργο\nείναι μια\nμοναδική\nπρόκληση.',
    body: 'Από απλές ανακαινίσεις έως σύνθετα κατασκευαστικά έργα, προσφέρω λύσεις που αποδίδουν αποτελέσματα.',
    cta: null,
  },
  {
    eyebrow: 'Από το Σχέδιο στην Πράξη',
    heading: 'Πλήρης\nδιαχείριση\nτου έργου σας,\nαπό την αρχή.',
    body: 'Αναλαμβάνω τη συνολική διαχείριση κάθε φάσης: μελέτη, αδειοδότηση, επίβλεψη και παράδοση.',
    cta: null,
  },
  {
    eyebrow: 'Η Εμπιστοσύνη σας',
    heading: 'Δέσμευση\nστην ποιότητα\nκαι στο\nαποτέλεσμα.',
    body: 'Συνεργάζομαι μαζί σας σε κάθε βήμα, διασφαλίζοντας διαφάνεια, αξιοπιστία και υπέρβαση προσδοκιών.',
    cta: { label: 'Δείτε τις Υπηρεσίες →', href: 'services' },
  },
]

interface Props {
  frames: (HTMLImageElement | null)[]
  isReady: boolean
  onStageChange?: (stage: number) => void
}

export default function HeroScroll({ frames, isReady }: Props) {
  const scrollRef    = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const stageRefs    = useRef<(HTMLDivElement | null)[]>([])
  const dotRefs      = useRef<(HTMLSpanElement | null)[]>([])
  const hintRef      = useRef<HTMLDivElement>(null)
  const currentFrame = useRef(0)
  const currentStage = useRef(-1)

  const [activeStage, setActiveStage] = useState(0)

  // ── Canvas helpers ──────────────────────────────────────────
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current
    const img    = frames[index]
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')!
    const dpr = window.devicePixelRatio || 1
    const cw  = canvas.width  / dpr
    const ch  = canvas.height / dpr
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * IMAGE_SCALE
    const dw  = img.naturalWidth  * scale
    const dh  = img.naturalHeight * scale
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, cw, ch)
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
  }

  const resizeCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr  = window.devicePixelRatio || 1
    const rect = canvas.parentElement!.getBoundingClientRect()
    canvas.width  = rect.width  * dpr
    canvas.height = rect.height * dpr
    canvas.getContext('2d')!.scale(dpr, dpr)
    if (frames[currentFrame.current]) drawFrame(currentFrame.current)
  }

  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  // ── Animate first stage in after loader ─────────────────────
  useEffect(() => {
    if (!isReady) return
    drawFrame(0)
    const el = stageRefs.current[0]
    if (!el) return
    currentStage.current = 0
    gsap.set(el, { opacity: 1 })
    const children = el.querySelectorAll('[data-child]')
    gsap.fromTo(children,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.9, ease: 'power3.out', delay: 0.1 },
    )
  }, [isReady])

  // ── ScrollTrigger: frames + stage switching ──────────────────
  useEffect(() => {
    if (!isReady || !scrollRef.current) return

    const trigger = ScrollTrigger.create({
      trigger: scrollRef.current,
      start:   'top top',
      end:     'bottom bottom',
      scrub:   true,
      onUpdate(self) {
        const p = self.progress

        const idx = Math.min(
          Math.floor(Math.min(p * FRAME_SPEED, 1) * FRAME_COUNT),
          FRAME_COUNT - 1,
        )
        if (idx !== currentFrame.current) {
          currentFrame.current = idx
          requestAnimationFrame(() => drawFrame(idx))
        }

        let next = 0
        if      (p < 0.25) next = 0
        else if (p < 0.50) next = 1
        else if (p < 0.75) next = 2
        else               next = 3

        if (next !== currentStage.current) {
          transitionStage(currentStage.current, next)
          currentStage.current = next
          setActiveStage(next)
          if (next > 0 && hintRef.current) gsap.to(hintRef.current, { opacity: 0, duration: 0.3 })
        }
      },
    })

    return () => trigger.kill()
  }, [isReady])

  const transitionStage = (prev: number, next: number) => {
    const dir        = next > prev ? 1 : -1
    const isFastJump = Math.abs(next - prev) > 1

    stageRefs.current.forEach(el => {
      if (!el) return
      gsap.killTweensOf(el)
      el.querySelectorAll('[data-child]').forEach(c => gsap.killTweensOf(c))
    })

    stageRefs.current.forEach((el, i) => {
      if (!el || i === prev || i === next) return
      gsap.set(el, { opacity: 0, y: 0 })
      gsap.set(el.querySelectorAll('[data-child]'), { opacity: 1, y: 0 })
    })

    const prevEl = stageRefs.current[prev]
    const nextEl = stageRefs.current[next]

    if (isFastJump) {
      if (prevEl) gsap.set(prevEl, { opacity: 0, y: 0 })
      if (nextEl) {
        gsap.set(nextEl, { opacity: 1, y: 0 })
        gsap.set(nextEl.querySelectorAll('[data-child]'), { opacity: 1, y: 0 })
      }
      return
    }

    if (prevEl) {
      gsap.to(prevEl, {
        opacity: 0, y: -28 * dir, duration: 0.4, ease: 'power2.in',
        onComplete: () => { gsap.set(prevEl, { y: 0 }) },
      })
    }
    if (nextEl) {
      gsap.set(nextEl, { opacity: 0, y: 32 * dir })
      gsap.to(nextEl, { opacity: 1, y: 0, duration: 0.55, delay: 0.22, ease: 'power3.out' })
      const children = nextEl.querySelectorAll('[data-child]')
      gsap.fromTo(children,
        { opacity: 0, y: 22 * dir },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.65, delay: 0.26, ease: 'power3.out' },
      )
    }
  }

  return (
    <div ref={scrollRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── Canvas — full-screen on mobile, right 55% on desktop ── */}
        <div className="absolute inset-0 md:left-[45%] overflow-hidden bg-white">
          {/* Mobile: gradient overlay so text is readable over the image */}
          <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/5 z-10 pointer-events-none" />
          {/* Desktop: left-edge blend into white text panel */}
          <div className="hidden md:block absolute inset-y-0 left-0 w-[28%] bg-gradient-to-r from-white via-white/60 to-transparent z-10 pointer-events-none" />
          {/* Desktop: top/bottom edge fades */}
          <div className="hidden md:block absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
          <div className="hidden md:block absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>

        {/* ── Text panel — bottom strip on mobile, left 45% on desktop ── */}
        {/*   On mobile: top-[42vh] anchors it to the lower ~58% of the screen */}
        <div className="absolute left-0 right-0 bottom-0 top-[42vh] z-20 md:top-0 md:right-[55%] overflow-hidden">
          {STAGES.map((stage, i) => (
            <div
              key={i}
              ref={el => { stageRefs.current[i] = el }}
              className="hero-stage opacity-0
                px-6 pb-14 pt-2
                md:px-[5vw] md:pr-14 md:pt-[calc(72px+4rem)] md:pb-20"
            >
              <span
                data-child
                className="block text-[11px] font-bold tracking-[0.2em] uppercase mb-4 md:mb-6
                  text-pk-purple-mid md:text-pk-purple"
              >
                {stage.eyebrow}
              </span>
              <h2
                data-child
                className="font-display font-bold leading-[1.08] tracking-tight mb-4 md:mb-7
                  text-white md:text-gray-900"
                style={{ fontSize: 'clamp(1.9rem, 5vw, 4.75rem)' }}
              >
                {stage.heading.split('\n').map((line, j) => (
                  <span key={j} className="block">{line}</span>
                ))}
              </h2>
              <p
                data-child
                className="leading-[1.8] max-w-[38ch] mb-6 md:mb-8
                  text-[0.88rem] text-white/75
                  md:text-[1.05rem] md:text-gray-600"
              >
                {stage.body}
              </p>
              {stage.cta && (
                <button
                  data-child
                  onClick={() => {
                    const el = document.getElementById(stage.cta!.href)
                    el?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-[11px] font-bold tracking-[0.1em] uppercase pb-0.5 border-b-2 transition-all duration-250
                    text-pk-purple-mid border-pk-purple-border hover:border-pk-purple-mid
                    md:text-pk-purple md:border-pk-purple-border md:hover:border-pk-purple md:hover:tracking-[0.14em]"
                >
                  {stage.cta.label}
                </button>
              )}
            </div>
          ))}

          {/* Progress dots — centred on mobile, left-anchored on desktop */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5 items-center
            md:left-[5vw] md:translate-x-0 md:bottom-9">
            {STAGES.map((_, i) => (
              <span
                key={i}
                ref={el => { dotRefs.current[i] = el }}
                className={[
                  'block w-[5px] h-[5px] rounded-full transition-all duration-300',
                  activeStage === i
                    ? 'bg-white md:bg-pk-purple scale-150'
                    : 'bg-white/40 md:bg-gray-200',
                ].join(' ')}
              />
            ))}
          </div>

          {/* Scroll hint — desktop only */}
          <div ref={hintRef} className="hidden md:flex absolute bottom-9 right-12 flex-col items-center gap-2">
            <div className="w-px h-10 bg-gradient-to-b from-transparent to-pk-purple animate-scroll-pulse" />
            <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-gray-400">Κυλήστε</span>
          </div>
        </div>

      </div>
    </div>
  )
}
