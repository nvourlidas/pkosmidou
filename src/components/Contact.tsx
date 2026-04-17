import { useEffect, useRef, useState } from 'react'

const SERVICES_OPTIONS = [
  'Αρχιτεκτονική Μελέτη',
  'Στατική Μελέτη',
  'Επίβλεψη Κατασκευής',
  'Ενεργειακή Μελέτη',
  'Τοπογραφική Αποτύπωση',
  'Αδειοδότηση',
  'Άλλο',
]

export default function Contact() {
  const infoRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  useEffect(() => {
    const els = [infoRef.current, formRef.current]
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    setTimeout(() => {
      setStatus('sent')
      setTimeout(() => {
        setStatus('idle');
        (e.target as HTMLFormElement).reset()
      }, 3200)
    }, 900)
  }

  const inputClass = 'w-full bg-pk-dark-input border border-pk-dark-border rounded-lg px-4 py-3.5 text-white text-[0.95rem] font-body outline-none focus:border-pk-purple transition-colors duration-200 placeholder:text-[#5A5A7A]'
  const labelClass = 'block text-[11px] font-bold tracking-[0.1em] uppercase text-[#9CA3AF] mb-2'

  return (
    <section id="contact" className="py-28 bg-pk-dark">
      <div className="max-w-[1200px] mx-auto px-10">
        <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-20 max-lg:gap-12 items-start">

          {/* Info */}
          <div
            ref={infoRef}
            className="opacity-0 translate-y-7 transition-[opacity,transform] duration-700 ease-out [&.revealed]:opacity-100 [&.revealed]:translate-y-0"
          >
            <span className="block text-[11px] font-bold tracking-[0.2em] text-pk-purple-mid uppercase mb-4">
              004 / Επικοινωνία
            </span>
            <h2 className="font-display font-bold leading-[1.1] tracking-tight text-white mt-3.5 mb-5"
              style={{ fontSize: 'clamp(2rem, 3.2vw, 3rem)' }}>
              Ας μιλήσουμε<br />για το έργο σας.
            </h2>
            <p className="text-[1rem] leading-[1.8] text-[#9CA3AF] mb-11">
              Είμαι εδώ για να απαντήσω σε κάθε ερώτηση και να σας καθοδηγήσω στα επόμενα βήματα του έργου σας.
            </p>
            <div className="flex flex-col gap-6">
              {[
                { label: 'Τηλέφωνο', value: '+30 2310 000 000', href: 'tel:+302310000000' },
                { label: 'Email',    value: 'info@pkosmidou.gr', href: 'mailto:info@pkosmidou.gr' },
                { label: 'Διεύθυνση', value: 'Θεσσαλονίκη, Ελλάδα', href: null },
              ].map(({ label, value, href }) => (
                <div key={label}>
                  <span className="block text-[11px] font-bold tracking-[0.16em] uppercase text-pk-purple-mid mb-1">
                    {label}
                  </span>
                  {href
                    ? <a href={href} className="text-[1rem] font-medium text-white hover:text-pk-purple-mid transition-colors duration-200">{value}</a>
                    : <span className="text-[1rem] font-medium text-white">{value}</span>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div
            ref={formRef}
            className="opacity-0 translate-y-7 transition-[opacity,transform] duration-700 ease-out [&.revealed]:opacity-100 [&.revealed]:translate-y-0"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5">
                <div>
                  <label className={labelClass}>Ονοματεπώνυμο</label>
                  <input type="text" name="name" placeholder="Το όνομά σας" required className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" name="email" placeholder="email@παράδειγμα.gr" required className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Τηλέφωνο</label>
                <input type="tel" name="phone" placeholder="+30 6XX XXX XXXX" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Υπηρεσία Ενδιαφέροντος</label>
                <select name="service" className={inputClass} defaultValue="">
                  <option value="" disabled>Επιλέξτε υπηρεσία...</option>
                  {SERVICES_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Μήνυμα</label>
                <textarea name="message" rows={4} placeholder="Περιγράψτε το έργο σας..." className={`${inputClass} resize-y min-h-[120px]`} />
              </div>
              <button
                type="submit"
                disabled={status !== 'idle'}
                className={[
                  'self-start text-[11px] font-bold tracking-[0.1em] uppercase text-white rounded-lg px-8 py-3.5 transition-[background,transform] duration-200',
                  status === 'sent'
                    ? 'bg-green-600 cursor-default'
                    : 'bg-pk-purple hover:bg-pk-purple-hover hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0',
                ].join(' ')}
              >
                {status === 'idle'    && 'Αποστολή Μηνύματος'}
                {status === 'sending' && 'Αποστολή...'}
                {status === 'sent'    && '✓ Εστάλη με επιτυχία'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}
