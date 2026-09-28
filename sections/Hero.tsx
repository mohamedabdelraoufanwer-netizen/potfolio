'use client'

import { useEffect, useRef, Suspense, lazy } from 'react'
import { gsap } from '@/lib/gsap'
import { useStore } from '@/store/useStore'
import { useCursor } from '@/hooks/useCursor'
import { translations } from '@/data/translations'

const Scene = lazy(() => import('@/components/3d/Scene'))
const HeroEnvironment = lazy(() => import('@/components/3d/HeroEnvironment'))

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const isLoaded = useStore((s) => s.isLoaded)
  const language = useStore((s) => s.language)
  const { cursorHandlers } = useCursor()

  const t = translations[language].hero

  useEffect(() => {
    if (!isLoaded) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 })

      // Headline lines animate up
      const lines = headlineRef.current?.querySelectorAll('.hero-line')
      if (lines) {
        tl.from(lines, {
          yPercent: 110,
          opacity: 0,
          duration: 1.0,
          stagger: 0.08,
          ease: 'power4.out',
        })
      }

      tl.from(
        subRef.current,
        { y: 20, opacity: 0, duration: 0.8, ease: 'power4.out' },
        '-=0.6'
      )

      tl.from(
        ctaRef.current,
        { y: 20, opacity: 0, duration: 0.8, ease: 'power4.out' },
        '-=0.5'
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [isLoaded, language])

  const headlineLines = [t.line1, t.line2, t.line3]

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen w-full overflow-hidden"
      aria-label="Hero section"
    >
      {/* 3D Canvas — behind everything */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <Scene style={{ width: '100%', height: '100%' }}>
            <HeroEnvironment />
          </Scene>
        </Suspense>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[rgba(10,10,11,0.3)] via-transparent to-[rgba(10,10,11,0.85)] pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[rgba(10,10,11,0.6)] via-transparent to-transparent pointer-events-none" />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-[1600px] mx-auto">
        {/* Label */}
        <div className="mb-6">
          <span className="section-label text-[#c8a97e] tracking-[0.25em]">
            {t.tag}
          </span>
        </div>

        {/* Headline */}
        <div ref={headlineRef} className="mb-6">
          {headlineLines.map((line, i) => (
            <div key={i} className="clip-text">
              <div className="hero-line">
                <h1
                  className="text-[clamp(2.8rem,9vw,9.5rem)] font-black leading-[0.92] tracking-tight text-[#f0ede8]"
                  style={{ fontStyle: i === 1 && language === 'en' ? 'italic' : 'normal' }}
                >
                  {i === 1 ? (
                    <span className="text-accent-gradient">{line}</span>
                  ) : (
                    line
                  )}
                </h1>
              </div>
            </div>
          ))}
        </div>

        {/* Supporting text */}
        <div ref={subRef} className="mb-10 max-w-[540px]">
          <p className="text-[#b8b4ae] text-base md:text-lg leading-relaxed font-light">
            {t.sub}
          </p>
        </div>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() =>
              document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#c8a97e] text-[#0a0a0b] text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#f0ede8] transition-colors duration-300 cursor-pointer"
            {...cursorHandlers('link')}
          >
            {t.ctaWork}
          </button>
          <button
            onClick={() =>
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="group flex items-center justify-center gap-3 px-8 py-4 border border-[#f0ede8] text-[#f0ede8] text-xs font-bold tracking-[0.15em] uppercase hover:border-[#c8a97e] hover:text-[#c8a97e] transition-all duration-300 cursor-pointer"
            {...cursorHandlers('link')}
          >
            {t.ctaContact}
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-[#6b6b70] text-[10px] tracking-[0.25em] font-mono uppercase">
          {t.scroll}
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-[#c8a97e] to-transparent animate-pulse" />
      </div>
    </section>
  )
}
