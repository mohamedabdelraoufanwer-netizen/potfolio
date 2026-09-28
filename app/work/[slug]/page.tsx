import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { projects } from '@/data/projects'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return projects
    .filter((p) => p.caseStudy !== undefined)
    .map((p) => ({
      slug: p.id,
    }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.id === slug)

  if (!project) {
    return {
      title: 'Case Study Not Found — Mohamed Abdel Raouf Anwer',
    }
  }

  return {
    title: `${project.title} — Case Study | Mohamed Abdel Raouf Anwer`,
    description: project.description,
    openGraph: {
      title: `${project.title} — Case Study | Mohamed Abdel Raouf Anwer`,
      description: project.longDescription,
      type: 'article',
    },
  }
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params
  const project = projects.find((p) => p.id === slug)

  if (!project || !project.caseStudy) {
    notFound()
  }

  const { caseStudy } = project

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#f0ede8] selection:bg-[#c8a97e] selection:text-[#0a0a0b]">
      {/* Top Floating Bar */}
      <header className="sticky top-0 z-40 bg-[#0a0a0b]/90 backdrop-blur-xl border-b border-[#1f1f21] px-6 md:px-12 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link
            href="/#work"
            className="flex items-center gap-3 text-xs tracking-[0.2em] font-mono text-[#6b6b70] hover:text-[#c8a97e] transition-colors duration-300"
          >
            <span>←</span> BACK TO SELECTED WORK
          </Link>

          <div className="flex items-center gap-3 font-mono text-xs text-[#6b6b70]">
            <span>{project.number}</span>
            <span>/</span>
            <span className="text-[#f0ede8] font-bold">{project.title}</span>
          </div>

          <div className="flex items-center gap-3">
            {project.githubUrl && project.githubUrl !== project.url && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-[#1f1f21] hover:border-[#c8a97e] text-[#b8b4ae] hover:text-[#c8a97e] text-xs font-mono tracking-[0.1em] transition-colors duration-300 flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GITHUB REPO ↗
              </a>
            )}
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#c8a97e] text-[#0a0a0b] text-xs font-bold tracking-[0.15em] hover:bg-[#f0ede8] transition-colors duration-300"
            >
              {project.url.includes('github.com') ? 'OPEN GITHUB ↗' : 'VISIT LIVE ↗'}
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Hero Section */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="section-label">{project.category}</span>
            <span className="text-[#1f1f21]">|</span>
            <span
              className="font-mono text-xs tracking-[0.15em] font-bold"
              style={{ color: project.accentColor }}
            >
              {project.flagship ? 'FLAGSHIP CASE STUDY' : 'PROJECT CASE STUDY'}
            </span>
          </div>

          <h1 className="text-[clamp(2.5rem,6vw,6.5rem)] font-black leading-[0.95] tracking-tight mb-8">
            {project.title}
          </h1>

          <p className="text-xl md:text-2xl text-[#b8b4ae] max-w-3xl leading-relaxed font-light mb-12">
            {project.subtitle}
          </p>

          {/* Quick Meta Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-[#1f1f21] font-mono text-xs">
            <div>
              <div className="text-[#6b6b70] mb-2 uppercase tracking-wider">Category</div>
              <div className="text-[#f0ede8] font-medium">{project.category}</div>
            </div>
            <div>
              <div className="text-[#6b6b70] mb-2 uppercase tracking-wider">Role</div>
              <div className="text-[#f0ede8] font-medium">Full Architecture & Engineering</div>
            </div>
            <div>
              <div className="text-[#6b6b70] mb-2 uppercase tracking-wider">Environment</div>
              <div className="text-[#c8a97e] font-medium uppercase">{project.environmentType}</div>
            </div>
            <div>
              <div className="text-[#6b6b70] mb-2 uppercase tracking-wider">Deployment</div>
              <div className="text-[#f0ede8] font-medium">Production Live</div>
            </div>
          </div>
        </section>

        {/* Live Interactive Preview Container */}
        <section className="mb-28">
          <div className="rounded-lg overflow-hidden border border-[#1f1f21] bg-[#141415] shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d0f] border-b border-[#1f1f21]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="font-mono text-[11px] text-[#6b6b70] bg-[#1a1a1c] px-4 py-1 rounded-sm">
                {project.url}
              </div>
              <div className="text-xs font-mono text-[#6b6b70]">PREVIEW</div>
            </div>

            <div className="relative w-full aspect-[16/9] min-h-[380px] max-h-[640px] bg-[#090909] overflow-hidden group">
              <img
                src={project.image}
                alt={`${project.title} live interface preview`}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </section>

        {/* 9 Structured Case Study Sections */}
        <div className="space-y-24 max-w-4xl">
          {/* 01 — Overview */}
          <section className="border-t border-[#1f1f21] pt-12">
            <span className="section-label mb-4 block">01 — OVERVIEW</span>
            <h2 className="text-3xl font-bold mb-6 text-[#f0ede8]">The Project Scope</h2>
            <p className="text-lg text-[#b8b4ae] leading-relaxed font-light">
              {caseStudy.overview}
            </p>
          </section>

          {/* 02 — Objective */}
          <section className="border-t border-[#1f1f21] pt-12">
            <span className="section-label mb-4 block">02 — OBJECTIVE</span>
            <h2 className="text-3xl font-bold mb-6 text-[#f0ede8]">Core Mission & Requirements</h2>
            <p className="text-lg text-[#b8b4ae] leading-relaxed font-light">
              {caseStudy.objective}
            </p>
          </section>

          {/* 03 — Challenge */}
          <section className="border-t border-[#1f1f21] pt-12">
            <span className="section-label mb-4 block">03 — CHALLENGE</span>
            <h2 className="text-3xl font-bold mb-6 text-[#f0ede8]">Architectural & Technical Obstacles</h2>
            <div className="p-8 rounded-sm bg-[#141415] border-l-2 border-[#c8a97e] text-base text-[#b8b4ae] leading-relaxed">
              {caseStudy.challenge}
            </div>
          </section>

          {/* 04 — Solution */}
          <section className="border-t border-[#1f1f21] pt-12">
            <span className="section-label mb-4 block">04 — SOLUTION</span>
            <h2 className="text-3xl font-bold mb-6 text-[#f0ede8]">Engineered Resolution</h2>
            <p className="text-lg text-[#b8b4ae] leading-relaxed font-light">
              {caseStudy.solution}
            </p>
          </section>

          {/* 05 — Design */}
          <section className="border-t border-[#1f1f21] pt-12">
            <span className="section-label mb-4 block">05 — DESIGN</span>
            <h2 className="text-3xl font-bold mb-6 text-[#f0ede8]">Visual Identity & Motion Philosophy</h2>
            <p className="text-lg text-[#b8b4ae] leading-relaxed font-light">
              {caseStudy.design}
            </p>
          </section>

          {/* 06 — Technology */}
          <section className="border-t border-[#1f1f21] pt-12">
            <span className="section-label mb-4 block">06 — TECHNOLOGY</span>
            <h2 className="text-3xl font-bold mb-6 text-[#f0ede8]">Production Tech Stack</h2>
            <div className="flex flex-wrap gap-3">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-4 py-2 border border-[#1f1f21] bg-[#141415] text-[#f0ede8] font-mono text-xs tracking-wider"
                >
                  {t}
                </span>
              ))}
            </div>
          </section>

          {/* 07 — Implementation */}
          <section className="border-t border-[#1f1f21] pt-12">
            <span className="section-label mb-4 block">07 — IMPLEMENTATION</span>
            <h2 className="text-3xl font-bold mb-6 text-[#f0ede8]">Code & Infrastructure Details</h2>
            <p className="text-lg text-[#b8b4ae] leading-relaxed font-light">
              {caseStudy.implementation}
            </p>
          </section>

          {/* 08 — Features */}
          <section className="border-t border-[#1f1f21] pt-12">
            <span className="section-label mb-4 block">08 — FEATURES</span>
            <h2 className="text-3xl font-bold mb-8 text-[#f0ede8]">Key Functional Deliverables</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {caseStudy.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-5 rounded-sm border border-[#1f1f21] bg-[#141415]"
                >
                  <span
                    className="font-mono text-xs font-bold mt-0.5"
                    style={{ color: project.accentColor }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm text-[#f0ede8]">{feature}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 09 — Live Project CTA */}
          <section className="border-t border-[#1f1f21] pt-16 pb-12">
            <span className="section-label mb-4 block">09 — LIVE PROJECT</span>
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-[#f0ede8]">
              Experience the Platform Live
            </h2>
            <p className="text-base text-[#6b6b70] mb-8">
              Explore the deployed project directly on the live production server.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={caseStudy.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#c8a97e] text-[#0a0a0b] font-bold text-sm tracking-[0.2em] hover:bg-[#f0ede8] transition-colors duration-300 flex items-center gap-2"
              >
                {caseStudy.liveUrl.includes('github.com') ? (
                  <>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    OPEN GITHUB REPOSITORY ↗
                  </>
                ) : (
                  'OPEN LIVE SITE ↗'
                )}
              </a>
              {project.githubUrl && project.githubUrl !== caseStudy.liveUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-8 py-4 border border-[#1f1f21] hover:border-[#c8a97e] text-[#f0ede8] hover:text-[#c8a97e] font-bold text-sm tracking-[0.2em] transition-colors duration-300"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  GITHUB CODE ↗
                </a>
              )}
              <Link
                href="/#work"
                className="px-8 py-4 border border-[#1f1f21] text-[#f0ede8] font-bold text-sm tracking-[0.2em] hover:border-[#c8a97e] transition-colors duration-300"
              >
                BACK TO PORTFOLIO
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
