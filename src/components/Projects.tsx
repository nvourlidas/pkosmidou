import { useEffect, useRef, useState } from 'react'
import ProjectModal, { type ModalProject } from './ProjectModal'

// Folder under public/projects → image URLs. The first file is the card cover.
const photos = (folder: string, files: string[]) =>
  files.map(file => `/projects/${folder}/${file}`)

const PROJECTS: ModalProject[] = [
  {
    num: '01',
    title: 'Ανέγερση μονοκατοικιών στο Λιθότοπο',
    type: 'Έκδοση οικοδομικής άδειας, Επίβλεψη κατασκευής',
    body: '',
    tags: ['Φέρων οργανισμός από οπλισμένο σκυρόδεμα'],
    images: photos('Ανέγερση μονοκατοικιών στο Λιθότοπο', [
      '20241212_094221.jpg',
      '20241212_094241.jpg',
      '20241212_094158.jpg',
      '20241212_094011.jpg',
      '20241212_093730.jpg',
      '20241212_093930.jpg',
    ]),
    placeholderHue: 230,
  },
  {
    num: '02',
    title: 'Ανέγερση Πολυώροφης Οικοδομής Θεοφάνους, Σέρρες',
    type: 'Εκπόνηση στατικής μελέτης, Επίβλεψη κατασκευής',
    body: '',
    tags: [],
    images: photos('Ανέγερση Πολυώροφης Οικοδομής Θεοφάνους, Σέρρες', [
      '20260329_163644.jpg',
      '20260329_163631.jpg',
      'IMG_20260329_201205_732.jpg',
    ]),
    placeholderHue: 260,
  },
  {
    num: '03',
    title: 'Ανέγερση Πολυώροφης Οικοδομής Καραμανλή, Σέρρες',
    type: 'Εκπόνηση στατικής μελέτης, Επίβλεψη κατασκευής',
    body: '',
    tags: [],
    images: photos('Ανέγερση Πολυώροφης Οικοδομής Καραμανλή, Σέρρες', [
      '20251112_151107.jpg',
      '20251112_151133.jpg',
    ]),
    placeholderHue: 210,
  },
  {
    num: '04',
    title: 'Ανέγερση Πολυώροφης Οικοδομής Σίνδο, Θεσσαλονίκης',
    type: 'Εκπόνηση στατικής μελέτης',
    body: '',
    tags: [],
    images: photos('Ανέγερση Πολυώροφης Οικοδομής Σίνδο, Θεσσαλονίκης', [
      'εικόνα_Viber_2026-11-01_20-51-21-622.jpg',
      'εικόνα_Viber_2026-11-01_20-51-48-986.jpg',
      'εικόνα_Viber_2026-11-01_20-52-31-203.jpg',
    ]),
    placeholderHue: 245,
  },
  {
    num: '05',
    title: 'Ανέγερση Πολυώροφης Οικοδομής Σιγής, Σέρρες',
    type: 'Εκπόνηση στατικής μελέτης',
    body: '',
    tags: [],
    images: photos('Ανέγερση Πολυώροφης Οικοδομής Σιγής, Σέρρες', [
      'εικόνα_Viber_2026-11-01_20-56-53-272.jpg',
      'εικόνα_Viber_2026-11-01_20-56-53-257.jpg',
      'εικόνα_Viber_2026-11-01_20-56-53-291.jpg',
      'εικόνα_Viber_2026-11-01_20-56-53-346.jpg',
      'εικόνα_Viber_2026-11-01_20-56-53-334.jpg',
      'εικόνα_Viber_2026-11-01_20-56-53-370.jpg',
    ]),
    placeholderHue: 220,
  },
  {
    num: '06',
    title: 'Ενίσχυση και Ανακαίνιση Παλαιάς Διώροφης Οικοδομής',
    type: 'Εκδοση οικοδομικής άδειας, Επίβλεψη Εργου',
    body: '',
    tags: [],
    images: photos('Ενίσχυση και Ανακαίνιση Παλαιάς Δίώροφης Οικοδομής', [
      '20250606_103310.jpg',
      '20250108_120858.jpg',
      '20250417_134826.jpg',
      '20250417_135029.jpg',
      '20250606_102947.jpg',
      '20250417_135138.jpg',
      '20250417_135927.jpg',
    ]),
    placeholderHue: 250,
  },
  {
    num: '07',
    title: 'Ανέγερση Πολυώροφης Οικοδομής Κομνηνών, Σέρρες',
    type: 'Εκδοση οικοδομικής άδειας,Εκπόνηση στατικής μελέτης, Επίβλεψη κατασκευής',
    body: '',
    tags: [],
    images: photos('Ανέγερση Πολυώροφης Οικοδομής Κομνηνών, Σέρρες', []),
    placeholderHue: 235,
  },
  {
    num: '08',
    title: 'Ανέγερση Πολυώροφης Οικοδομής Μιαούλη, Σέρρες',
    type: 'Εκπόνηση στατικής μελέτης',
    body: '',
    tags: [],
    images: photos('Ανέγερση Πολυώροφης Οικοδομής Μιαούλη, Σέρρες', []),
    placeholderHue: 215,
  },
]

export default function Projects() {
  const headerRef = useRef<HTMLDivElement>(null)
  const cardRefs  = useRef<(HTMLDivElement | null)[]>([])
  const [selected, setSelected] = useState<ModalProject | null>(null)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { header.classList.add('revealed'); obs.disconnect() } },
      { threshold: 0.2 },
    )
    obs.observe(header)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const obs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setTimeout(() => card.classList.add('revealed'), i * 60)
            obs.disconnect()
          }
        },
        { threshold: 0.1 },
      )
      obs.observe(card)
    })
  }, [])

  return (
    <section id="projects" className="py-28 bg-white">
      <div className="max-w-[1200px] mx-auto px-10">

        {/* Header */}
        <div
          ref={headerRef}
          className="mb-14 [&.revealed_.label]:opacity-100 [&.revealed_.label]:translate-y-0 [&.revealed_.title]:opacity-100 [&.revealed_.title]:[transition-delay:80ms] [&.revealed_.title]:translate-y-0 [&.revealed_.sub]:opacity-100 [&.revealed_.sub]:[transition-delay:160ms] [&.revealed_.sub]:translate-y-0"
        >
          <span className="label block text-[11px] font-bold tracking-[0.2em] text-pk-purple uppercase mb-4 opacity-0 translate-y-6 transition-[opacity,transform] duration-700 ease-out">
            002 / Έργα
          </span>
          <h2
            className="title font-display font-bold leading-[1.1] tracking-tight text-gray-900 mb-5 opacity-0 translate-y-6 transition-[opacity,transform] duration-700 ease-out"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
          >
            Επιλεγμένα<br />έργα
          </h2>
          <p className="sub text-[1.05rem] leading-[1.8] text-gray-600 max-w-[54ch] opacity-0 translate-y-6 transition-[opacity,transform] duration-700 ease-out">
            Μια ματιά σε μερικά από τα έργα που έχω υλοποιήσει με υπερηφάνεια και επαγγελματισμό.
          </p>
        </div>

        {/* 3×3 Grid */}
        <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-6">
          {PROJECTS.map((p, i) => (
            <div
              key={i}
              ref={el => { cardRefs.current[i] = el }}
              onClick={() => setSelected(p)}
              className="group opacity-0 translate-y-6 transition-[opacity,transform] duration-700 ease-out [&.revealed]:opacity-100 [&.revealed]:translate-y-0 cursor-pointer"
            >
              {/* Image / placeholder */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">

                {p.images[0]
                  ? <img src={p.images[0]} alt={p.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  : (
                    <div
                      className="absolute inset-0"
                      style={{ background: `hsl(${p.placeholderHue} 18% 94%)` }}
                    >
                      <div
                        className="absolute inset-0 opacity-[0.06]"
                        style={{
                          backgroundImage: 'repeating-linear-gradient(0deg,#000 0,#000 1px,transparent 0,transparent 40px),repeating-linear-gradient(90deg,#000 0,#000 1px,transparent 0,transparent 40px)',
                        }}
                      />
                      <span
                        className="absolute bottom-4 right-5 font-display font-bold leading-none select-none"
                        style={{
                          fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                          color: `hsl(${p.placeholderHue} 25% 82%)`,
                        }}
                      >
                        {p.num}
                      </span>
                    </div>
                  )
                }

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gray-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <span className="block text-[10px] font-bold tracking-[0.14em] uppercase text-pk-purple-mid mb-2">
                    {p.type}
                  </span>
                  <p className="text-[0.82rem] leading-[1.65] text-gray-300 mb-4">
                    {p.body}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[9px] font-bold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full border border-pk-purple-border text-pk-purple-mid whitespace-nowrap"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* "View" hint */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </div>
                </div>

              </div>

              {/* Card footer */}
              <div className="pt-3.5 pb-1">
                <h3 className="font-display text-[1.05rem] font-bold leading-snug text-gray-900 mb-1 tracking-tight group-hover:text-pk-purple transition-colors duration-200">
                  {p.title}
                </h3>
                <span className="text-[10px] font-bold tracking-[0.13em] uppercase text-gray-400">
                  {p.type}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal */}
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
