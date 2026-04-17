import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import { useFrameLoader } from './hooks/useFrameLoader'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import HeroScroll from './components/HeroScroll'
import Services from './components/Services'
import Projects from './components/Projects'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const lenisRef            = useRef<Lenis | null>(null)
  const [lenis, setLenis]   = useState<Lenis | null>(null)
  const [loaderGone, setLoaderGone] = useState(false)

  const framePrefix = window.innerWidth < 768 ? '/frames-mobile/' : '/frames/'
  const { frames, progress, isReady } = useFrameLoader(192, framePrefix)

  // Init Lenis + connect to GSAP ticker
  useEffect(() => {
    const instance = new Lenis({
      duration:    1.2,
      easing:      (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = instance
    setLenis(instance)

    instance.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => instance.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    return () => {
      instance.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
      gsap.ticker.remove((time) => instance.raf(time * 1000))
    }
  }, [])

  return (
    <>
      {!loaderGone && (
        <Loader
          progress={progress}
          isReady={isReady}
          onHidden={() => setLoaderGone(true)}
        />
      )}
      <Navbar lenis={lenis} />
      <main>
        <HeroScroll frames={frames} isReady={isReady} />
        <Services />
        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
