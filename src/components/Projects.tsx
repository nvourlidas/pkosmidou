import { useEffect, useRef, useState } from 'react'
import ProjectModal, { type ModalProject } from './ProjectModal'

const PROJECTS: (ModalProject & { image: string | null })[] = [
  {
    num: '01',
    title: 'Μονοκατοικία στη Θεσσαλονίκη',
    type: 'Αρχιτεκτονική & Στατική Μελέτη',
    body: 'Σχεδιασμός σύγχρονης μονοκατοικίας 220 τ.μ. με ενεργειακή αξιολόγηση κατηγορίας Α+. Ολοκληρώθηκε εντός προϋπολογισμού και χρονοδιαγράμματος με πλήρη αντισεισμική προστασία.',
    tags: ['Κατοικία', '220 τ.μ.', 'Α+ Ενέργεια'],
    images: [],
    image: null,
    placeholderHue: 230,
  },
  {
    num: '02',
    title: 'Εμπορικό Κτίριο Γραφείων',
    type: 'Πλήρης Επίβλεψη Κατασκευής',
    body: 'Επίβλεψη ανέγερσης τριώροφου κτιρίου γραφείων 650 τ.μ. Συντονισμός υπεργολάβων, έλεγχος ποιότητας υλικών και τήρηση ασφαλιστικών διατάξεων.',
    tags: ['Εμπορικό', '650 τ.μ.', '3 Όροφοι'],
    images: [],
    image: null,
    placeholderHue: 260,
  },
  {
    num: '03',
    title: 'Ανακαίνιση Βιομηχανικής Αποθήκης',
    type: 'Μελέτη Αποκατάστασης & Αδειοδότηση',
    body: 'Μετατροπή παλιάς αποθήκης 1.200 τ.μ. σε σύγχρονο εμπορικό χώρο. Ενίσχυση φέροντος οργανισμού και πλήρης αδειοδότηση αλλαγής χρήσης.',
    tags: ['Βιομηχανικό', '1.200 τ.μ.', 'Αναστήλωση'],
    images: [],
    image: null,
    placeholderHue: 210,
  },
  {
    num: '04',
    title: 'Πολυκατοικία 12 Διαμερισμάτων',
    type: 'Αρχιτεκτονική, Στατική & Η/Μ Μελέτη',
    body: 'Ολοκληρωμένη μελέτη πολυκατοικίας 5 ορόφων με 12 διαμερίσματα. Αντισεισμικός σχεδιασμός κατά ΕΚ8, ενεργειακή κατηγορία Β+.',
    tags: ['Πολυκατοικία', '12 Διαμ.', '5 Όροφοι'],
    images: [],
    image: null,
    placeholderHue: 245,
  },
  {
    num: '05',
    title: 'Τοπογραφική Αποτύπωση Αγροτεμαχίου',
    type: 'Τοπογραφική Μελέτη',
    body: 'Αποτύπωση και διανομή αγροτεμαχίου 8 στρεμμάτων με σύνταξη κτηματολογικών διαγραμμάτων και συντεταγμένων ΕΓΣΑ87.',
    tags: ['Τοπογραφία', '8 Στρέμ.', 'Κτηματολόγιο'],
    images: [],
    image: null,
    placeholderHue: 220,
  },
  {
    num: '06',
    title: 'Ενεργειακή Αναβάθμιση Κτιρίου',
    type: 'Ενεργειακή Μελέτη & Επίβλεψη',
    body: 'Ενεργειακή αναβάθμιση διώροφης κατοικίας με εγκατάσταση θερμομόνωσης, κουφωμάτων και φωτοβολταϊκού συστήματος.',
    tags: ['Ενέργεια', 'Κατοικία', 'Φ/Β'],
    images: [],
    image: null,
    placeholderHue: 250,
  },
  {
    num: '07',
    title: 'Ξενοδοχειακή Μονάδα',
    type: 'Αρχιτεκτονική Μελέτη & Αδειοδότηση',
    body: 'Σχεδιασμός ξενοδοχειακής μονάδας 24 δωματίων με πλήρη αδειοδότηση ΕΟΤ και περιβαλλοντική μελέτη.',
    tags: ['Τουρισμός', '24 Δωμάτια', 'ΕΟΤ'],
    images: [],
    image: null,
    placeholderHue: 235,
  },
  {
    num: '08',
    title: 'Αποθήκη Logistics',
    type: 'Στατική Μελέτη & Επίβλεψη',
    body: 'Μελέτη και επίβλεψη αποθηκευτικής εγκατάστασης 2.400 τ.μ. με μεταλλικό σκελετό και σύστημα πυρόσβεσης.',
    tags: ['Logistics', '2.400 τ.μ.', 'Μέταλλο'],
    images: [],
    image: null,
    placeholderHue: 215,
  },
  {
    num: '09',
    title: 'Κατεδάφιση & Ανοικοδόμηση',
    type: 'Πλήρης Διαχείριση Έργου',
    body: 'Ολοκληρωμένη διαχείριση κατεδάφισης παλαιού κτιρίου και ανοικοδόμησης νέας πολυκατοικίας από τη μελέτη ως την παράδοση.',
    tags: ['Κατεδάφιση', 'Ανοικοδόμηση', 'Full PM'],
    images: [],
    image: null,
    placeholderHue: 255,
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

                {p.image
                  ? <img src={p.image} alt={p.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
