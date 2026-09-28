'use client'

import { useEffect, useRef, Suspense, lazy } from 'react'
import { gsap } from '@/lib/gsap'
import { useStore } from '@/store/useStore'
import { capabilities } from '@/data/capabilities'
import { useCursor } from '@/hooks/useCursor'
import { translations } from '@/data/translations'

const Scene = lazy(() => import('@/components/3d/Scene'))
const CapabilityEnvironment = lazy(() => import('@/components/3d/CapabilityEnvironment'))

export default function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const activeCapability = useStore((s) => s.activeCapability)
  const setActiveCapability = useStore((s) => s.setActiveCapability)
  const language = useStore((s) => s.language)
  const { cursorHandlers } = useCursor()

  const t = translations[language].capabilities

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      gsap.from(headerRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })

      // Grid cells stagger reveal
      const items = gridRef.current?.querySelectorAll('.capability-item')
      if (items) {
        gsap.from(items, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 75%',
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [language])

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="relative py-32 md:py-40"
      aria-label="Capabilities"
    >
      {/* 3D background — reactive to hovered capability */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Suspense fallback={null}>
          <Scene style={{ width: '100%', height: '100%' }}>
            <CapabilityEnvironment activeCapability={activeCapability} />
          </Scene>
        </Suspense>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0a0a0b] via-[rgba(10,10,11,0.75)] to-[rgba(10,10,11,0.35)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-t from-[#0a0a0b] to-transparent pointer-events-none" />

      <div className="relative z-20 px-6 md:px-16 lg:px-24 max-w-[1600px] mx-auto">
        {/* Header */}
        <div ref={headerRef} className="mb-20">
          <span className="section-label mb-3 block text-[#c8a97e]">{t.tag}</span>
          <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-black text-[#f0ede8] tracking-tight leading-tight">
            {t.title}
          </h2>
          <p className="text-[#6b6b70] text-sm md:text-base mt-4 max-w-xl font-light">
            {t.subtitle}
          </p>
        </div>

        {/* Capabilities grid */}
        <div
          ref={gridRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1f1f21]"
          role="list"
          aria-label="Capability areas"
        >
          {capabilities.map((cap, index) => {
            const groupTranslation =
              t.groups[cap.id as keyof typeof t.groups] || {
                label: cap.label,
                desc: cap.description,
              }

            return (
              <div
                key={cap.id}
                role="listitem"
                className="capability-item bg-[#0a0a0b] p-8 group relative overflow-hidden transition-colors"
                onMouseEnter={() => {
                  setActiveCapability(cap.id)
                  cursorHandlers('view').onMouseEnter()
                }}
                onMouseLeave={() => {
                  setActiveCapability(null)
                  cursorHandlers('view').onMouseLeave()
                }}
              >
                {/* Per-colour gradient glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${cap.color}0a 0%, transparent 65%)`,
                  }}
                />

                {/* Left border accent */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: cap.color }}
                />

                <div className="relative z-10">
                  {/* Category label + index */}
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className="font-mono text-xs tracking-[0.2em] font-bold"
                      style={{ color: cap.color }}
                    >
                      {groupTranslation.label}
                    </span>
                    <span className="text-[#1f1f21] text-4xl font-black group-hover:text-[#2a2a2e] transition-colors duration-300">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Short description */}
                  <p className="text-[#6b6b70] text-xs tracking-wide mb-6 group-hover:text-[#b8b4ae] transition-colors duration-300">
                    {groupTranslation.desc}
                  </p>

                  {/* Skills list */}
                  <ul className="flex flex-wrap gap-2" aria-label={`${cap.label} skills`}>
                    {cap.skills.map((skill) => (
                      <li
                        key={skill}
                        className="text-xs px-2.5 py-1 bg-[#141415] border border-[#1f1f21] text-[#8c8c92] font-mono group-hover:border-[#2a2a2e] transition-colors duration-300"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
