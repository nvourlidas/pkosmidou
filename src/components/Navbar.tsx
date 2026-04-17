import { useEffect, useRef, useState } from 'react'
import type Lenis from 'lenis'

const NAV_LINKS = [
  { href: 'services', label: 'Υπηρεσίες' },
  { href: 'projects', label: 'Έργα' },
  { href: 'about',   label: 'Σχετικά' },
  { href: 'contact', label: 'Επικοινωνία' },
]

interface Props {
  lenis: Lenis | null
}

export default function Navbar({ lenis }: Props) {
  const [scrolled, setScrolled]       = useState(false)
  const [hidden, setHidden]           = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [activeSection, setActive]    = useState('')
  const lastY = useRef(0)

  // Hide/show on scroll direction via Lenis
  useEffect(() => {
    if (!lenis) return
    const onScroll = ({ scroll }: { scroll: number }) => {
      setScrolled(scroll > 50)
      setHidden(scroll > lastY.current && scroll > 120)
      lastY.current = scroll
    }
    lenis.on('scroll', onScroll)
    return () => lenis.off('scroll', onScroll)
  }, [lenis])

  // Active section via IntersectionObserver
  useEffect(() => {
    const observers = NAV_LINKS.map(({ href }) => {
      const el = document.getElementById(href)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(href) },
        { threshold: 0.4 },
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el && lenis) lenis.scrollTo(el, { offset: -80, duration: 1.6 })
    setMobileOpen(false)
  }

  return (
    <nav
      className={[
        'fixed top-0 inset-x-0 z-[900] h-[72px]',
        'bg-white/90 backdrop-blur-xl border-b',
        'transition-[transform,border-color,box-shadow] duration-400',
        scrolled ? 'border-gray-200 shadow-sm' : 'border-transparent',
        hidden  ? '-translate-y-full' : 'translate-y-0',
      ].join(' ')}
    >
      <div className="max-w-[1400px] mx-auto px-10 h-full flex items-center gap-6">
        {/* Logo */}
        <button
          onClick={() => lenis?.scrollTo(0, { duration: 1.4 })}
          className="flex items-center gap-2.5 flex-shrink-0 hover:opacity-75 transition-opacity"
        >
          <span className="font-display text-xl font-bold text-pk-purple leading-none">Π.Κ.</span>
          <span className="text-sm font-bold text-gray-800">Πασχαλία Κοσμίδου</span>
        </button>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-0.5 ml-auto">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <button
                onClick={() => scrollTo(href)}
                className={[
                  'text-sm font-bold tracking-wide px-3.5 py-2 rounded-md transition-colors duration-200',
                  activeSection === href
                    ? 'text-pk-purple bg-pk-purple-pale'
                    : 'text-gray-600 hover:text-pk-purple hover:bg-pk-purple-pale',
                ].join(' ')}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={() => scrollTo('contact')}
          className="hidden md:block flex-shrink-0 text-[11px] font-bold tracking-[0.08em] uppercase text-white bg-pk-purple px-5 py-2.5 rounded-md hover:bg-pk-purple-hover transition-colors duration-200"
        >
          Επικοινωνήστε
        </button>

        {/* Hamburger */}
        <button
          className="md:hidden ml-auto flex flex-col gap-[5px] p-1.5"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Μενού"
        >
          <span className="block w-[22px] h-px bg-gray-900 rounded" />
          <span className="block w-[22px] h-px bg-gray-900 rounded" />
          <span className="block w-[22px] h-px bg-gray-900 rounded" />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-10 py-4">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <button
                  onClick={() => scrollTo(href)}
                  className="w-full text-left text-base font-bold text-gray-800 px-4 py-3 rounded-lg hover:bg-pk-purple-pale hover:text-pk-purple transition-colors duration-200"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  )
}
