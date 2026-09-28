'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { gsap } from '@/lib/gsap'
import { useCursor } from '@/hooks/useCursor'
import { useStore } from '@/store/useStore'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  compact?: boolean
}

export default function ProjectCard({ project, compact = false }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const { cursorHandlers } = useCursor()
  const language = useStore((s) => s.language)
  const isAr = language === 'ar'

  const title = isAr && project.titleAr ? project.titleAr : project.title
  const subtitle = isAr && project.subtitleAr ? project.subtitleAr : project.subtitle
  const category = isAr && project.categoryAr ? project.categoryAr : project.category
  const description = isAr && project.descriptionAr ? project.descriptionAr : project.description
  const longDescription = isAr && project.longDescriptionAr ? project.longDescriptionAr : project.longDescription

  const handleMouseEnter = () => {
    setHovered(true)
    if (imageRef.current) {
      gsap.to(imageRef.current, { scale: 1.02, duration: 0.6, ease: 'power3.out' })
    }
  }

  const handleMouseLeave = () => {
    setHovered(false)
    if (imageRef.current) {
      gsap.to(imageRef.current, { scale: 1, duration: 0.6, ease: 'power3.out' })
    }
  }

  if (compact) {
    return (
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-6 md:p-8 group relative overflow-hidden cursor-pointer bg-[#0a0a0b] border border-[#1f1f21] hover:border-[#c8a97e]/40 transition-colors h-full flex flex-col justify-between"
        onMouseEnter={() => {
          handleMouseEnter()
          cursorHandlers('open').onMouseEnter()
        }}
        onMouseLeave={() => {
          handleMouseLeave()
          cursorHandlers('open').onMouseLeave()
        }}
        aria-label={`View ${title} project`}
      >
        {/* Hover background wash */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${project.accentColor}0a 0%, transparent 70%)`,
          }}
        />
        {/* Left accent stripe */}
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: project.accentColor }}
        />

        <div className="relative z-10">
          {/* Project Image Preview Header */}
          <div className="relative w-full aspect-[16/10] mb-6 rounded-sm overflow-hidden bg-[#141415] border border-[#1f1f21] group-hover:border-[#c8a97e]/40 transition-colors duration-300">
            <img
              src={project.image}
              alt={`${title} preview`}
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent opacity-50 group-hover:opacity-20 transition-opacity duration-300" />
          </div>

          <div className="flex items-start justify-between mb-3">
            <span className="font-mono text-xs text-[#6b6b70] tracking-[0.15em]">
              {project.number}
            </span>
            <div className="flex items-center gap-2">
              {project.githubUrl && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    window.open(project.githubUrl, '_blank')
                  }}
                  className="inline-flex items-center gap-1 font-mono text-[10px] tracking-wider px-2 py-0.5 rounded-[2px] bg-[#1a1a1c] border border-[#2a2a2d] hover:bg-[#c8a97e] hover:text-[#0a0a0b] text-[#b8b4ae] transition-colors cursor-pointer"
                  title="View GitHub Repository"
                >
                  <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  GITHUB ↗
                </span>
              )}
              <span
                className="font-mono text-xs tracking-[0.1em] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ color: project.accentColor }}
              >
                {isAr ? 'معاينة ↗' : 'OPEN ↗'}
              </span>
            </div>
          </div>

          <h3 className="text-[#f0ede8] font-bold text-lg mb-2 group-hover:text-[#c8a97e] transition-colors duration-300 leading-tight">
            {title}
          </h3>

          <p className="text-[#6b6b70] text-xs mb-6 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Tech tags and Case Study link */}
        <div className="relative z-10 flex items-center justify-between gap-2 pt-4 border-t border-[#1f1f21]/60">
          <div className="flex flex-wrap gap-1.5">
            {project.tech.slice(0, 3).map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-[2px] bg-[#141415] border border-[#1f1f21] text-[#b8b4ae] text-[10px] font-mono"
              >
                {t}
              </span>
            ))}
            {project.tech.length > 3 && (
              <span className="px-2 py-0.5 rounded-[2px] bg-[#141415] border border-[#1f1f21] text-[#6b6b70] text-[10px] font-mono">
                +{project.tech.length - 3}
              </span>
            )}
          </div>
          {project.caseStudy && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                window.location.href = `/work/${project.id}`
              }}
              className="inline-flex items-center gap-1 font-mono text-[11px] text-[#c8a97e] hover:text-[#f0ede8] transition-colors tracking-wider font-semibold cursor-pointer shrink-0"
              title="Read Case Study"
            >
              {isAr ? 'دراسة الحالة ←' : 'CASE STUDY →'}
            </span>
          )}
        </div>
      </a>
    )
  }

  const hasCaseStudy = Boolean(project.caseStudy)

  return (
    <div
      ref={cardRef}
      className="relative grid lg:grid-cols-2 gap-0 border border-[#1f1f21] bg-[#0a0a0b] overflow-hidden group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left / Right based on dir — Project Details & Meta */}
      <div className="p-8 md:p-14 flex flex-col justify-between min-h-[460px] relative z-10">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${project.accentColor}08 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10">
          {/* Project Number & Category */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-xs text-[#6b6b70] tracking-[0.2em]">
              {project.number}
            </span>
            <div className="flex-1 h-px bg-[#1f1f21]" />
            <span
              className="font-mono text-xs tracking-[0.15em] font-semibold"
              style={{ color: project.accentColor }}
            >
              {category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-[#f0ede8] font-black text-[clamp(1.8rem,3.2vw,2.8rem)] leading-tight tracking-tight mb-4">
            {title}
          </h3>

          {/* Subtitle / Description */}
          <p className="text-[#b8b4ae] text-base leading-relaxed mb-8 font-light">
            {longDescription}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-[#141415] border border-[#1f1f21] text-[#6b6b70] font-mono text-xs tracking-[0.1em]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Tech Stack List */}
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {project.tech.map((t) => (
              <span key={t} className="text-[#4a4a50] font-mono text-xs">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Action CTAs */}
        <div className="relative z-10 flex gap-4 flex-wrap mt-10">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn flex items-center gap-2 px-6 py-3.5 bg-[#f0ede8] text-[#0a0a0b] text-xs font-bold tracking-[0.15em] hover:bg-[#c8a97e] transition-colors duration-300"
            {...cursorHandlers('open')}
            aria-label={`Visit ${title}`}
          >
            {project.url.includes('github.com')
              ? (isAr ? 'عرض الكود على GITHUB' : 'VIEW ON GITHUB')
              : (isAr ? 'زيارة الموقع المباشر' : 'VIEW LIVE PROJECT')}
            <span className="group-hover/btn:translate-x-0.5 transition-transform duration-200">
              ↗
            </span>
          </a>
          {project.githubUrl && project.githubUrl !== project.url && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3.5 border border-[#1f1f21] text-[#b8b4ae] text-xs font-mono tracking-[0.1em] hover:border-[#c8a97e] hover:text-[#c8a97e] transition-all duration-300"
              {...cursorHandlers('link')}
              aria-label={`View ${title} on GitHub`}
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GITHUB ↗
            </a>
          )}
          {hasCaseStudy && (
            <Link
              href={`/work/${project.id}`}
              className="flex items-center gap-2 px-6 py-3.5 border border-[#1f1f21] text-[#f0ede8] text-xs font-bold tracking-[0.15em] hover:border-[#c8a97e] hover:text-[#c8a97e] transition-all duration-300"
              {...cursorHandlers('link')}
              aria-label={`Read ${title} case study`}
            >
              {isAr ? 'دراسة الحالة ←' : 'CASE STUDY →'}
            </Link>
          )}
        </div>
      </div>

      {/* Browser Interface Visual Mockup with Real Screenshot */}
      <div
        ref={imageRef}
        className="relative bg-[#141415] overflow-hidden min-h-[340px] lg:min-h-[460px] flex items-center justify-center p-4 md:p-8"
      >
        <div className="absolute inset-0 z-10 bg-gradient-to-bl from-transparent to-[#0a0a0b]/40 pointer-events-none" />

        {/* macOS Style Window Frame */}
        <div className="relative z-20 w-full h-full rounded-md overflow-hidden border border-[#1f1f21] bg-[#0d0d0f] shadow-2xl flex flex-col group/mockup">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#111113] border-b border-[#1f1f21]">
            <div className="flex items-center gap-1.5" dir="ltr">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div
              dir="ltr"
              className="flex-1 mx-4 px-3 py-1 rounded-sm bg-[#1a1a1c] text-[#6b6b70] font-mono text-[10px] truncate max-w-[260px] text-center"
            >
              {project.url}
            </div>
            <div
              className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-[2px]"
              style={{ color: project.accentColor }}
            >
              {isAr ? 'معاينة حية' : 'PREVIEW'}
            </div>
          </div>

          {/* Screenshot Display Area */}
          <div className="relative w-full flex-1 min-h-[260px] md:min-h-[320px] overflow-hidden bg-[#090909]">
            <img
              src={project.image}
              alt={`${title} interface snapshot`}
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover/mockup:scale-105"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Bottom Accent Bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: project.accentColor }}
        />
      </div>
    </div>
  )
}
