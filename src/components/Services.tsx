import { useEffect, useRef } from 'react'

const SERVICES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
      </svg>
    ),
    title: 'Αρχιτεκτονικές\nΜελέτες',
    body: 'Σχεδιασμός κτιρίων και χώρων με λειτουργικότητα, αισθητική και πλήρη συμμόρφωση με τις κανονιστικές απαιτήσεις.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'Στατικές\nΜελέτες',
    body: 'Υπολογισμός και σχεδιασμός φέροντος οργανισμού με σύγχρονες μεθόδους ανάλυσης και αντισεισμικό σχεδιασμό.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 20h20M4 20V10l8-8 8 8v10"/><path d="M9 20v-5h6v5"/>
      </svg>
    ),
    title: 'Επίβλεψη\nΚατασκευών',
    body: 'Παρακολούθηση και έλεγχος κάθε φάσης κατασκευής για τη διασφάλιση ποιότητας, ασφάλειας και τήρησης προδιαγραφών.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    title: 'Ενεργειακές\nΜελέτες',
    body: 'Εκπόνηση ενεργειακής μελέτης και Πιστοποιητικού Ενεργειακής Απόδοσης (ΠΕΑ) σύμφωνα με τον ΚΕΝΑΚ.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
      </svg>
    ),
    title: 'Τοπογραφικές\nΑποτυπώσεις',
    body: 'Τοπογραφικές αποτυπώσεις, χαράξεις και κτηματολογικές εργασίες με υψηλή ακρίβεια και σύγχρονο εξοπλισμό.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
    title: 'Αδειοδοτήσεις',
    body: 'Διεκπεραίωση αδειών δόμησης, νομιμοποιήσεων αυθαιρέτων και κάθε είδους διοικητικών διαδικασιών.',
  },
]

export default function Services() {
  const headerRef = useRef<HTMLDivElement>(null)
  const cardRefs  = useRef<(HTMLDivElement | null)[]>([])

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
            setTimeout(() => card.classList.add('revealed'), i * 75)
            obs.disconnect()
          }
        },
        { threshold: 0.1 },
      )
      obs.observe(card)
    })
  }, [])

  return (
    <section id="services" className="py-28 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-10">

        {/* Header */}
        <div
          ref={headerRef}
          className="mb-16 [&.revealed_.label]:opacity-100 [&.revealed_.label]:translate-y-0 [&.revealed_.title]:opacity-100 [&.revealed_.title]:[transition-delay:80ms] [&.revealed_.title]:translate-y-0 [&.revealed_.sub]:opacity-100 [&.revealed_.sub]:[transition-delay:160ms] [&.revealed_.sub]:translate-y-0"
        >
          <span className="label block text-[11px] font-bold tracking-[0.2em] text-pk-purple uppercase mb-4 opacity-0 translate-y-6 transition-[opacity,transform] duration-700 ease-out">
            001 / Υπηρεσίες
          </span>
          <h2 className="title font-display font-bold leading-[1.1] tracking-tight text-gray-900 mb-5 opacity-0 translate-y-6 transition-[opacity,transform] duration-700 ease-out"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}>
            Τι μπορώ<br />να κάνω για εσάς
          </h2>
          <p className="sub text-[1.05rem] leading-[1.8] text-gray-600 max-w-[54ch] opacity-0 translate-y-6 transition-[opacity,transform] duration-700 ease-out">
            Παρέχω ολοκληρωμένες υπηρεσίες πολιτικού μηχανικού, καλύπτοντας κάθε στάδιο του έργου σας.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-px bg-gray-200 border border-gray-200 rounded-xl overflow-hidden">
          {SERVICES.map((s, i) => (
            <div
              key={i}
              ref={el => { cardRefs.current[i] = el }}
              className="bg-white p-10 pb-9 opacity-0 translate-y-6 transition-[opacity,transform,background] duration-700 ease-out hover:bg-pk-purple-pale group [&.revealed]:opacity-100 [&.revealed]:translate-y-0"
            >
              <div className="text-pk-purple mb-5 group-hover:text-pk-purple-hover transition-colors duration-200">
                {s.icon}
              </div>
              <h3 className="font-display text-[1.2rem] font-bold leading-snug text-gray-900 mb-3.5">
                {s.title.split('\n').map((line, j) => <span key={j} className="block">{line}</span>)}
              </h3>
              <p className="text-[0.9rem] leading-[1.75] text-gray-600">{s.body}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
