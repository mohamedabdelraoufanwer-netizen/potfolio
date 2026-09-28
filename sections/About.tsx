'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useStore } from '@/store/useStore'
import { translations } from '@/data/translations'

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const descRef = useRef<HTMLDivElement>(null)
  const accentsRef = useRef<HTMLDivElement>(null)
  const language = useStore((s) => s.language)

  const t = translations[language].about

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title slides up
      gsap.from(titleRef.current, {
        yPercent: 20,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })

      // Name / role badge
      gsap.from(nameRef.current, {
        yPercent: 20,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        delay: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })

      // Right column description
      gsap.from(descRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'power4.out',
        delay: 0.3,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })

      // Accent lines scale-in
      const accentChildren = accentsRef.current ? Array.from(accentsRef.current.children) : []
      if (accentChildren.length) {
        gsap.from(accentChildren, {
          scaleX: 0,
          transformOrigin: language === 'ar' ? 'right center' : 'left center',
          duration: 1.2,
          stagger: 0.15,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [language])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-32 md:py-40 overflow-hidden"
      aria-label="About Mohamed Abdel Raouf Anwer"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#141415]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(200,169,126,0.03)] to-transparent" />

      <div className="relative z-10 px-6 md:px-16 lg:px-24 max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Column 1: Typography */}
          <div>
            <div className="mb-6">
              <span className="section-label text-[#c8a97e]">{t.tag}</span>
            </div>

            <div ref={titleRef}>
              <h2 className="text-[clamp(2.2rem,4vw,4.5rem)] font-black text-[#f0ede8] leading-tight tracking-tight mb-1">
                {t.titleLine1}
              </h2>
              <h2 className="text-[clamp(2.2rem,4vw,4.5rem)] font-black text-[#f0ede8] leading-tight tracking-tight">
                {t.titleLine2}
              </h2>
            </div>

            {/* Animated accent lines */}
            <div ref={accentsRef} className="flex flex-col gap-2 my-8">
              <div className="w-16 h-px bg-[#c8a97e]" />
              <div className="w-24 h-px bg-[#c8a97e] opacity-50" />
              <div className="w-8  h-px bg-[#c8a97e] opacity-25" />
            </div>

            {/* Name & role */}
            <div ref={nameRef}>
              <p className="text-[#c8a97e] font-mono text-sm tracking-[0.2em] mb-1 font-bold">
                {language === 'ar' ? 'محمد عبد الرؤوف أنور' : 'MOHAMED ABDEL RAOUF ANWER'}
              </p>
              <p className="text-[#6b6b70] font-mono text-xs tracking-[0.15em]">
                {language === 'ar'
                  ? 'مطور ومصمم واجهات إبداعي • مهندس Full-Stack'
                  : 'CREATIVE DEVELOPER / FULL-STACK ENGINEER'}
              </p>
            </div>
          </div>

          {/* Column 2: Description & Stats */}
          <div ref={descRef} className="lg:pt-14">
            <p className="text-[#b8b4ae] text-xl md:text-2xl leading-relaxed mb-6 font-light">
              {t.desc1}
            </p>

            <p className="text-[#6b6b70] text-base leading-relaxed mb-10 font-light">
              {t.desc2}
            </p>

            {/* Real stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#1f1f21]">
              <div>
                <div className="text-[#c8a97e] text-3xl font-black mb-1 font-mono">
                  {t.stat1Number}
                </div>
                <div className="text-[#6b6b70] font-mono text-[10px] tracking-[0.15em] uppercase">
                  {t.stat1Label}
                </div>
              </div>

              <div>
                <div className="text-[#c8a97e] text-3xl font-black mb-1 font-mono">
                  {t.stat2Number}
                </div>
                <div className="text-[#6b6b70] font-mono text-[10px] tracking-[0.15em] uppercase">
                  {t.stat2Label}
                </div>
              </div>

              <div>
                <div className="text-[#c8a97e] text-3xl font-black mb-1 font-mono">
                  {t.stat3Number}
                </div>
                <div className="text-[#6b6b70] font-mono text-[10px] tracking-[0.15em] uppercase">
                  {t.stat3Label}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
