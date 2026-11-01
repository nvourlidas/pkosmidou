import { useEffect, useRef } from 'react'

const STATS = [
  { value: 5, suffix: '+', label: 'Χρόνια Εμπειρίας' },
  { value: 35, suffix: '+', label: 'Ολοκληρωμένα Έργα' },
  { value: 100, suffix: '%', label: 'Ικανοποίηση Πελατών' },
]

function useCounter(ref: React.RefObject<HTMLSpanElement | null>, target: number) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        obs.disconnect()
        let start: number | null = null
        const duration = 1800
        const step = (ts: number) => {
          if (!start) start = ts
          const progress = Math.min((ts - start) / duration, 1)
          const ease = 1 - Math.pow(1 - progress, 3)
          el.textContent = String(Math.round(ease * target))
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      },
      { threshold: 0.5 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, target])
}

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const numRef = useRef<HTMLSpanElement>(null)
  useCounter(numRef, value)
  return (
    <div className="flex flex-col gap-1.5">
      <div className="font-display font-bold text-pk-purple leading-none" style={{ fontSize: 'clamp(2.8rem, 4vw, 4rem)' }}>
        <span ref={numRef}>0</span>{suffix}
      </div>
      <span className="text-[0.85rem] font-bold tracking-[0.12em] uppercase text-gray-500">{label}</span>
    </div>
  )
}

export default function About() {
  const leftRef  = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const els = [leftRef.current, rightRef.current]
    els.forEach((el, i) => {
      if (!el) return
      const obs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setTimeout(() => el.classList.add('revealed'), i * 150)
            obs.disconnect()
          }
        },
        { threshold: 0.2 },
      )
      obs.observe(el)
    })
  }, [])

  return (
    <section id="about" className="py-28 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-10">
        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-20 max-lg:gap-14 items-center">

          {/* Left — text */}
          <div
            ref={leftRef}
            className="opacity-0 -translate-x-8 transition-[opacity,transform] duration-700 ease-out [&.revealed]:opacity-100 [&.revealed]:translate-x-0"
          >
            <span className="block text-[11px] font-bold tracking-[0.2em] text-pk-purple uppercase mb-4">
              003 / Σχετικά
            </span>
            <h2
              className="font-display font-bold leading-[1.1] tracking-tight text-gray-900 mb-6"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
            >
              Μηχανικός με<br />όραμα και ακρίβεια.
            </h2>
            <p className="text-[1rem] leading-[1.85] text-gray-600 mb-5">
              Ονομάζομαι Πασχαλία Κοσμίδου και είμαι Διπλωματούχος Πολιτικός Μηχανικός (ΑΠΘ) με μεταπτυχιακές σπουδές στη Διοίκηση Επιχειρήσεων (MBA ΠΑΜΑΚ). Ως Μελετητής Δημοσίων Έργων και Ενεργειακός Επιθεωρητής Β' Τάξης, το γραφείο μου προσφέρει ένα ολοκληρωμένο φάσμα υπηρεσιών, από στατικές μελέτες νέων κατασκευών και ελέγχους στατικής επάρκειας υφιστάμενων κτιρίων, μέχρι τακτοποιήσεις αυθαιρέτων, άδειες και επιδοτούμενα προγράμματα.
            </p>
            <p className="text-[1rem] leading-[1.85] text-gray-600 mb-10">
              Στο επίκεντρο της δουλειάς μου βρίσκεται πάντα η ασφάλεια και η τεχνική αρτιότητα, έχοντας όμως ως οδηγό μια βαθιά ανθρωποκεντρική φιλοσοφία. Πιστεύω ακράδαντα στο σοφό ρητό: <em>"It takes hands to build a house, but hearts to build a home"</em>. Ένα κτίριο δεν αποτελείται μόνο από μπετόν, σίδερο και κανονισμούς. Στόχος μου είναι να σας προσφέρω απόλυτη σιγουριά και στατική αρτιότητα, βάζοντας τα θεμέλια για να στεγάσετε με ασφάλεια τη ζωή και τα όνειρά σας.
            </p>

            {/* Stats */}
            <div className="flex gap-10 max-sm:gap-7 flex-wrap">
              {STATS.map(s => (
                <StatCounter key={s.label} {...s} />
              ))}
            </div>
          </div>

          {/* Right — image placeholder / accent block */}
          <div
            ref={rightRef}
            className="opacity-0 translate-x-8 transition-[opacity,transform] duration-700 ease-out [&.revealed]:opacity-100 [&.revealed]:translate-x-0"
          >
            <div className="relative aspect-[4/5] max-lg:aspect-[16/9] rounded-2xl overflow-hidden bg-gray-200">
              {/* Purple accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-pk-purple rounded-l-2xl z-10" />
              {/* Decorative grid */}
              <div className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg,#000 0,#000 1px,transparent 0,transparent 48px),repeating-linear-gradient(90deg,#000 0,#000 1px,transparent 0,transparent 48px)',
                }}
              />
              {/* Quote */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-12 text-center">
                <svg className="text-pk-purple mb-6 opacity-30" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <p className="font-display text-[1.15rem] italic leading-[1.7] text-gray-700">
                  "It takes hands to build a house, but hearts to build a home."
                </p>
                <span className="mt-6 text-[11px] font-bold tracking-[0.18em] uppercase text-pk-purple">
                  Πασχαλία Κοσμίδου
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
