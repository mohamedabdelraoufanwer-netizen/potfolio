'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useStore } from '@/store/useStore'
import { translations } from '@/data/translations'

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)
  const language = useStore((s) => s.language)

  const t = translations[language].process

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      })

      const steps = stepsRef.current?.querySelectorAll('.process-step')
      if (steps) {
        gsap.from(steps, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: stepsRef.current,
            start: 'top 80%',
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [language])

  return (
    <section
      ref={sectionRef}
      id="process"
      className="py-32 md:py-40 bg-[#141415] overflow-hidden"
      aria-label="Process"
    >
      <div className="px-6 md:px-16 lg:px-24 max-w-[1600px] mx-auto">
        <div ref={headerRef} className="mb-20">
          <span className="section-label mb-3 block text-[#c8a97e]">{t.tag}</span>
          <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-black text-[#f0ede8] tracking-tight leading-tight">
            {t.title}
          </h2>
          <p className="text-[#6b6b70] text-sm md:text-base mt-4 max-w-xl font-light">
            {t.subtitle}
          </p>
        </div>

        <div
          ref={stepsRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-[#1f1f21]"
        >
          {t.steps.map((step) => (
            <div key={step.number} className="process-step bg-[#141415] p-6 md:p-8 group relative">
              <div
                className="text-5xl md:text-6xl font-black text-[#1f1f21] group-hover:text-[#2a2a2e] transition-colors duration-500 leading-none mb-6 font-mono"
                aria-hidden="true"
              >
                {step.number}
              </div>

              <h3 className="text-[#f0ede8] font-bold text-base md:text-lg mb-3 group-hover:text-[#c8a97e] transition-colors duration-300">
                {step.title}
              </h3>

              <p className="text-[#8c8c92] text-xs leading-relaxed mb-4 font-light">
                {step.description}
              </p>

              <p className="text-[#4a4a50] text-xs leading-relaxed group-hover:text-[#6b6b70] transition-colors duration-500 font-light">
                {step.detail}
              </p>

              <div className="absolute bottom-0 left-0 right-0 h-px bg-[#c8a97e] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
