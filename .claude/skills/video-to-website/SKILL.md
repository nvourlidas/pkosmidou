---
name: video-to-website
description: Turn a video into a premium scroll-driven animated website with GSAP, canvas frame rendering, and layered animation choreography.
---

# Video to Premium Scroll-Driven Website

Turn a video file into a scroll-driven animated website with **animation variety and choreography** — multiple animation types working together, not one repeated effect.

## Stack

**React + Vite + TypeScript + Tailwind CSS**. GSAP and Lenis installed as npm packages. No CDN scripts. No separate HTML/CSS/JS files in `public/`.

```
npm install gsap lenis
```

## Project Structure

```
src/
├── App.tsx                    # Root: Lenis init, frame loading, renders all sections
├── main.tsx                   # Entry point
├── index.css                  # Tailwind directives + custom @keyframes only
├── hooks/
│   └── useFrameLoader.ts      # Loads frames, returns { frames, progress, isReady }
└── components/
    ├── Loader.tsx             # Progress bar, fades out when isReady
    ├── Navbar.tsx             # Sticky nav, hide/show on scroll, active section
    ├── HeroScroll.tsx         # Canvas + text stages, scroll-driven
    ├── Services.tsx
    ├── Projects.tsx
    ├── Contact.tsx
    └── Footer.tsx
```

## Input

The user provides: a video file path (MP4, MOV, etc.) and optionally:
- A theme/brand name
- Desired text sections and where they appear
- Color scheme preferences
- Any specific design direction

If the user doesn't specify these, ask briefly or use sensible creative defaults.

## Premium Checklist (Non-Negotiable)

1. **Lenis smooth scroll** — `npm install lenis`, import as `import Lenis from 'lenis'`
2. **4+ animation types** — never repeat the same entrance animation consecutively
3. **Staggered reveals** — label → heading → body → CTA, never all at once
4. **No glassmorphism cards** — text on clean backgrounds, hierarchy via font size/weight/color
5. **Direction variety** — sections enter from different directions (left, right, up, scale, clip)
6. **Horizontal text marquee** — at least one oversized text element sliding on scroll (12vw+)
7. **Counter animations** — all numbers count up from 0, never appear statically
8. **Massive typography** — hero 12rem+, section headings 4rem+, marquee 10vw+
9. **CTA persists** — final section stays visible, never disappears
10. **Hero prominence** — hero gets 20%+ scroll range, 400vh+ total for text stages
11. **Frame speed 1.6–2.0** — product animation completes by ~55% scroll
12. **Canvas blending** — white fill behind frames, gradient overlays (left edge, top/bottom) so video bleeds into page rather than sitting in a box

## Workflow

**FFmpeg extraction** — use `ffmpeg-static` npm package if ffmpeg is not on PATH:
```js
const ffmpeg = require('ffmpeg-static') // → path to binary
```

### Step 1: Analyze the Video

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration,r_frame_rate,nb_frames -of csv=p=0 "<VIDEO_PATH>"
```

Determine resolution, duration, frame rate, total frames. Decide:
- **Target frame count**: 150–300 frames for good scroll experience
- **Output resolution**: Match aspect ratio, cap width at 1280px

### Step 2: Extract Frames

```bash
mkdir -p public/frames
ffmpeg -i "<VIDEO_PATH>" -vf "fps=<FPS>,scale=1280:-1" -c:v libwebp -quality 82 "public/frames/frame_%04d.webp"
```

Frames go in `public/frames/` so Vite serves them at `/frames/frame_0001.webp`.

### Step 3: Tailwind Config

Define custom colors and fonts so components use semantic names:

```js
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pk: {
          purple:         '#7C3AED',
          'purple-hover': '#6D28D9',
          'purple-mid':   '#9B6FEA',
          'purple-pale':  '#F3EEFF',
          // add brand-specific colors here
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Lato', '"Segoe UI"', 'Helvetica', 'sans-serif'],
      },
    },
  },
}
```

### Step 4: App.tsx — Root Setup

`App.tsx` owns Lenis, connects it to GSAP ScrollTrigger, and passes instances down:

```tsx
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useFrameLoader } from './hooks/useFrameLoader'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const { frames, progress, isReady } = useFrameLoader(FRAME_COUNT)

  useEffect(() => {
    const instance = new Lenis({ duration: 1.2, smoothWheel: true })
    setLenis(instance)
    instance.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => instance.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
    return () => { instance.destroy(); ScrollTrigger.getAll().forEach(t => t.kill()) }
  }, [])

  return (
    <>
      <Loader progress={progress} isReady={isReady} onHidden={...} />
      <Navbar lenis={lenis} />
      <HeroScroll frames={frames} isReady={isReady} />
      <Services />
      <Projects />
      <Contact />
      <Footer />
    </>
  )
}
```

### Step 5: useFrameLoader Hook

```ts
// src/hooks/useFrameLoader.ts
import { useEffect, useRef, useState } from 'react'

export function useFrameLoader(frameCount: number) {
  const frames = useRef<(HTMLImageElement | null)[]>(new Array(frameCount).fill(null))
  const [loadedCount, setLoadedCount] = useState(0)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let loaded = 0
    const load = (i: number) => {
      const img = new Image()
      img.src = `/frames/frame_${String(i).padStart(4, '0')}.webp`
      img.onload = img.onerror = () => {
        if (img.complete && img.naturalWidth) frames.current[i - 1] = img
        if (++loaded >= frameCount) setIsReady(true)
        setLoadedCount(loaded)
      }
    }
    for (let i = 1; i <= frameCount; i++) load(i)
  }, [frameCount])

  return { frames: frames.current, progress: loadedCount / frameCount, isReady }
}
```

### Step 6: HeroScroll Component

Key patterns:
- **Do not use React state for scroll-driven animation** — use `useRef` + GSAP directly on DOM elements
- **Canvas sizing**: apply `devicePixelRatio` scaling on mount and resize
- **Canvas blending**: use absolutely-positioned `<div>` overlays inside the canvas panel (not CSS pseudo-elements)

```tsx
// Canvas right panel with blending overlays
<div className="relative flex-[0_0_55%] overflow-hidden bg-white">
  {/* Left-edge blend into text panel */}
  <div className="absolute inset-y-0 left-0 w-[28%] bg-gradient-to-r from-white via-white/60 to-transparent z-10 pointer-events-none" />
  {/* Top/bottom edge blend into page */}
  <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
  <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
</div>
```

#### Canvas draw function

```ts
const drawFrame = (index: number) => {
  const canvas = canvasRef.current
  const img    = frames[index]
  if (!canvas || !img) return
  const ctx   = canvas.getContext('2d')!
  const dpr   = window.devicePixelRatio || 1
  const cw    = canvas.width  / dpr
  const ch    = canvas.height / dpr
  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * IMAGE_SCALE // 0.87–0.92
  const dw = img.naturalWidth  * scale
  const dh = img.naturalHeight * scale
  ctx.fillStyle = '#FFFFFF' // always white — blends with page bg
  ctx.fillRect(0, 0, cw, ch)
  ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
}
```

#### Stage transitions (GSAP, not React state)

```tsx
const transitionStage = (prev: number, next: number) => {
  const dir    = next > prev ? 1 : -1
  const prevEl = stageRefs.current[prev]
  const nextEl = stageRefs.current[next]

  if (prevEl) gsap.to(prevEl, { opacity: 0, y: -28 * dir, duration: 0.4, ease: 'power2.in',
    onComplete: () => gsap.set(prevEl, { y: 0 }) })

  if (nextEl) {
    gsap.set(nextEl, { opacity: 0, y: 32 * dir })
    gsap.to(nextEl, { opacity: 1, y: 0, duration: 0.55, delay: 0.22, ease: 'power3.out' })
    const children = nextEl.querySelectorAll('[data-child]')
    gsap.fromTo(children, { opacity: 0, y: 22 * dir },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.65, delay: 0.26, ease: 'power3.out' })
  }
}
```

Tag individual animated children with `data-child` so GSAP can stagger them without coupling to class names.

### Step 7: Section Reveal Animations

Use `IntersectionObserver` (not ScrollTrigger) for simpler one-shot section reveals:

```tsx
useEffect(() => {
  const el = ref.current
  if (!el) return
  const obs = new IntersectionObserver(
    ([e]) => { if (e.isIntersecting) { el.classList.add('revealed'); obs.disconnect() } },
    { threshold: 0.2 },
  )
  obs.observe(el)
  return () => obs.disconnect()
}, [])
```

Drive the animation entirely from Tailwind utility classes toggled by `revealed`:

```tsx
<div className="opacity-0 translate-y-6 transition-[opacity,transform] duration-700 ease-out [&.revealed]:opacity-100 [&.revealed]:translate-y-0">
```

### Step 8: Navbar

- Hide/show on scroll direction via `lenis.on('scroll', ...)`
- Active section detection via `IntersectionObserver` (not ScrollTrigger)
- Smooth scroll to sections via `lenis.scrollTo(el, { offset: -80, duration: 1.6 })`

### Step 9: index.css

Only put things here that Tailwind cannot express — custom `@keyframes` and `@layer base` resets:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { scroll-behavior: auto; } /* Lenis owns scroll */
  body { -webkit-font-smoothing: antialiased; }
}

@layer utilities {
  @keyframes scrollPulse {
    0%, 100% { transform: scaleY(0.6); opacity: 0.5; }
    50%       { transform: scaleY(1);   opacity: 1;   }
  }
  .animate-scroll-pulse { animation: scrollPulse 2s ease-in-out infinite; }
}
```

## Anti-Patterns

- **Vanilla HTML/JS files in `public/`** — all logic belongs in `src/` React components
- **CDN `<script>` tags** — use npm packages (`gsap`, `lenis`) and import them
- **React state for scroll-driven animations** — causes re-renders mid-scroll; use refs + GSAP directly
- **CSS pseudo-elements for canvas overlays** — use absolutely-positioned `<div>` overlays in JSX instead
- **Gray/colored canvas background** — always fill with `#FFFFFF` so frame edges blend with white page
- **`body { font-family: theme('fontFamily.xxx') }` in CSS** — the `theme()` function only resolves top-level config keys, not `extend`; write the font stack directly or use `@apply`
- **Pure cover mode canvas (`Math.max` at 1.0)** — use `IMAGE_SCALE` 0.87–0.92 to avoid clipping into header
- **FRAME_SPEED < 1.6** — animation feels sluggish
- **Scroll height < 400vh** for 4 text stages — everything feels rushed

## Troubleshooting

- **Frames not loading**: Must be served via HTTP (`npm run dev`), not `file://`
- **Lenis + ScrollTrigger conflict**: Ensure `lenis.on('scroll', ScrollTrigger.update)` is connected in `App.tsx`
- **Canvas blurry on retina**: Apply `devicePixelRatio` scaling (`canvas.width = rect.width * dpr`) and `ctx.scale(dpr, dpr)` after resize
- **tsconfig error "No inputs found"**: Appears until `.tsx` files exist in `src/` — safe to ignore during scaffolding
- **Tailwind custom colors not resolving**: Verify `content` glob in `tailwind.config.js` includes `./src/**/*.{ts,tsx}`
