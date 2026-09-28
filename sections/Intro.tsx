'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useStore } from '@/store/useStore'
import { translations } from '@/data/translations'

export default function Intro() {
  const sectionRef = useRef<HTMLElement>(null)
  const line1Ref = useRef<HTMLDivElement>(null)
  const line2Ref = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const language = useStore((s) => s.language)

  const t = translations[language].intro

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      })

      // First statement reveal
      const items1 = line1Ref.current?.querySelectorAll('.text-chunk')
      if (items1) {
        tl.from(items1, {
          yPercent: 120,
          opacity: 0,
          duration: 0.7,
          stagger: 0.04,
          ease: 'power4.out',
        })
      }

      // Hold, then transform to second statement
      tl.to(
        line1Ref.current,
        { opacity: 0, y: -30, duration: 0.5, ease: 'power2.in' },
        '+=0.8'
      )

      const items2 = line2Ref.current?.querySelectorAll('.text-chunk')
      if (items2) {
        tl.from(line2Ref.current, { opacity: 0, y: 30, duration: 0 }, '<')
        tl.from(
          items2,
          {
            yPercent: 120,
            opacity: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: 'power4.out',
          },
          '<+0.05'
        )
      }

      // Body text fades in
      tl.from(
        bodyRef.current,
        { y: 30, opacity: 0, duration: 0.8, ease: 'power4.out' },
        '-=0.4'
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [language])

  /**
   * For English: character split; For Arabic: word split (to preserve Arabic cursive joining)
   */
  const splitContent = (text: string) => {
    if (language === 'ar') {
      return text.split(' ').map((word, i) => (
        <span key={i} className="text-chunk inline-block mx-1.5">
          {word}
        </span>
      ))
    }
    return text.split('').map((char, i) => (
      <span
        key={i}
        className="text-chunk inline-block"
        style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-40 px-6 md:px-16 lg:px-24 max-w-[1600px] mx-auto overflow-hidden"
      aria-label="Introduction"
    >
      <div className="mb-6">
        <span className="section-label text-[#c8a97e] tracking-[0.25em]">{t.tag}</span>
      </div>

      {/* Statement container — fixed height to prevent layout shift during swap */}
      <div className="relative h-36 md:h-52">
        {/* Statement 1 */}
        <div ref={line1Ref} className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="clip-text">
            <h2 className="text-[clamp(2.2rem,6.5vw,6.5rem)] font-black text-[#f0ede8] leading-none tracking-tight">
              {splitContent(t.statement1)}
            </h2>
          </div>
        </div>

        {/* Statement 2 — starts hidden, swaps in */}
        <div ref={line2Ref} className="absolute inset-0 flex items-center opacity-0">
          <div className="clip-text">
            <h2 className="text-[clamp(2.2rem,6.5vw,6.5rem)] font-black leading-none tracking-tight">
              <span className="text-accent-gradient">{splitContent(t.statement2)}</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Body text */}
      <div ref={bodyRef} className="mt-14 max-w-3xl">
        <p className="text-[#b8b4ae] text-lg md:text-xl leading-relaxed font-light">{t.body}</p>
      </div>

      {/* Decorative vertical rule */}
      <div className="absolute right-6 md:right-16 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 pointer-events-none">
        <div className="w-px h-24 bg-gradient-to-b from-transparent to-[#c8a97e]" />
        <span className="section-label rotate-90 origin-center">EST. 2023</span>
        <div className="w-px h-24 bg-gradient-to-b from-[#c8a97e] to-transparent" />
      </div>
    </section>
  )
}
