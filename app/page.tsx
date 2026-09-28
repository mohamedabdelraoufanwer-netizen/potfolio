'use client'

import { useLenis } from '@/hooks/useLenis'
import { useGPUTier } from '@/hooks/useGPUTier'
import Cursor from '@/components/ui/Cursor'
import LoadingScreen from '@/components/ui/LoadingScreen'
import Navigation from '@/components/ui/Navigation'
import Hero from '@/sections/Hero'
import Intro from '@/sections/Intro'
import About from '@/sections/About'
import Capabilities from '@/sections/Capabilities'
import SelectedWork from '@/sections/SelectedWork'
import Process from '@/sections/Process'
import Contact from '@/sections/Contact'

import { useStore } from '@/store/useStore'
import { translations } from '@/data/translations'
import Link from 'next/link'

export default function Home() {
  useLenis()
  useGPUTier()
  const language = useStore((s) => s.language)
  const t = translations[language].footer

  return (
    <>
      <LoadingScreen />
      <Cursor />
      <Navigation />

      <main id="main-content" className="relative z-10">
        <Hero />
        <Intro />
        <About />
        <Capabilities />
        <SelectedWork />
        <Process />
        <Contact />
      </main>

      {/* Cinematic Editorial Footer */}
      <footer
        className="border-t border-[#1f1f21] py-14 px-6 md:px-16 lg:px-24 bg-[#0a0a0b] text-[#6b6b70] text-xs font-mono"
        role="contentinfo"
      >
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[#f0ede8] font-bold tracking-[0.2em]">MARA</span>
            <span className="text-[#1f1f21]">/</span>
            <span className="text-[#a09e98] tracking-wider">{t.title}</span>
            <span className="text-[#1f1f21] hidden sm:inline">/</span>
            <span className="hidden sm:inline text-[#7a7a80]">{t.role}</span>
          </div>

          {/* Social Channels & Admin */}
          <div className="flex flex-wrap items-center justify-center gap-5">
            <a
              href="https://wa.me/201093215497"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6b6b70] hover:text-[#25D366] transition-colors"
            >
              WHATSAPP
            </a>
            <span className="text-[#1f1f21]">·</span>
            <a
              href="https://www.linkedin.com/in/mohamed-abdel-raouf-anwar-50536921a"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6b6b70] hover:text-[#0A66C2] transition-colors"
            >
              LINKEDIN
            </a>
            <span className="text-[#1f1f21]">·</span>
            <a
              href="https://www.instagram.com/tohamy83/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6b6b70] hover:text-[#E4405F] transition-colors"
            >
              INSTAGRAM
            </a>
            <span className="text-[#1f1f21]">·</span>
            <a
              href="https://www.facebook.com/profile.php?id=100006572746264"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6b6b70] hover:text-[#1877F2] transition-colors"
            >
              FACEBOOK
            </a>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[#6b6b70] hover:text-[#c8a97e] transition-colors duration-300 tracking-[0.15em] cursor-pointer uppercase"
            >
              {t.backToTop}
            </button>
            <span className="text-[#3a3a3e]">
              © {new Date().getFullYear()} {t.rights}
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
