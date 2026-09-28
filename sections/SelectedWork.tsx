'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { useStore } from '@/store/useStore'
import { projects as initialProjects } from '@/data/projects'
import ProjectCard from '@/components/ui/ProjectCard'
import { translations } from '@/data/translations'
import type { Project } from '@/types'

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const language = useStore((s) => s.language)
  const [allProjects, setAllProjects] = useState<Project[]>(initialProjects)

  const t = translations[language].work

  // Fetch custom projects dynamically from API
  useEffect(() => {
    const fetchCustom = async () => {
      try {
        const res = await fetch('/api/projects')
        const data = await res.json()
        if (data.success && Array.isArray(data.projects)) {
          setAllProjects(data.projects)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchCustom()
  }, [])

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

      const cards = cardsRef.current?.querySelectorAll('.project-card-wrapper')
      if (cards) {
        cards.forEach((card) => {
          gsap.from(card, {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            },
          })
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [language, allProjects.length])

  const flagshipProjects = allProjects.filter((p) => p.flagship)
  const supportingProjects = allProjects.filter((p) => !p.flagship)

  return (
    <section
      ref={sectionRef}
      id="work"
      className="py-32 md:py-40 px-6 md:px-16 lg:px-24 max-w-[1600px] mx-auto"
      aria-label="Selected Work"
    >
      <div ref={headerRef} className="mb-24">
        <span className="section-label mb-4 block text-[#c8a97e]">{t.tag}</span>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <h2 className="text-[clamp(2.5rem,5vw,5.5rem)] font-black text-[#f0ede8] tracking-tight leading-tight">
            {t.title}
          </h2>
          <p className="text-[#6b6b70] max-w-sm text-sm md:text-base leading-relaxed font-light">
            {t.subtitle}
          </p>
        </div>
      </div>

      <div ref={cardsRef} className="space-y-8">
        <div className="mb-4">
          <span className="text-[#c8a97e] font-mono text-xs tracking-[0.2em] font-bold">
            {t.flagshipBadge}
          </span>
        </div>

        {flagshipProjects.map((project) => (
          <div key={project.id} className="project-card-wrapper">
            <ProjectCard project={project} />
          </div>
        ))}

        <div className="mb-4 mt-20">
          <span className="text-[#6b6b70] font-mono text-xs tracking-[0.2em]">
            {t.supportingTitle}
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supportingProjects.map((project) => (
            <div key={project.id} className="project-card-wrapper h-full">
              <ProjectCard project={project} compact />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
