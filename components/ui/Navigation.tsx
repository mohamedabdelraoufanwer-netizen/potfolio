'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCursor } from '@/hooks/useCursor'
import { useStore } from '@/store/useStore'
import { translations } from '@/data/translations'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { cursorHandlers } = useCursor()
  const language = useStore((s) => s.language)
  const setLanguage = useStore((s) => s.setLanguage)

  const t = translations[language].nav

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: t.work, href: '#work' },
    { label: t.about, href: '#about' },
    { label: t.capabilities, href: '#capabilities' },
    { label: t.process, href: '#process' },
    { label: t.contact, href: '#contact' },
  ]

  const scrollTo = (href: string) => {
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en')
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0a0a0b]/90 backdrop-blur-xl border-b border-[#1f1f21] py-3 shadow-2xl'
            : 'bg-[#0a0a0b]/75 backdrop-blur-lg border-b border-[#1f1f21]/60 py-3.5'
        }`}
        role="banner"
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-12 flex items-center justify-between">
          {/* Brand Identity / Logo */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-3 group"
              aria-label="Mohamed Abdel Raouf Anwer Portfolio Home"
              {...cursorHandlers('link')}
            >
              <div className="w-9 h-9 rounded-sm bg-[#141415] border border-[#1f1f21] flex items-center justify-center group-hover:border-[#c8a97e] transition-colors duration-300">
                <span className="text-[#c8a97e] font-black text-sm tracking-wider">MARA</span>
              </div>
              <div className="hidden sm:flex flex-col text-start">
                <span className="text-[#f0ede8] font-bold text-xs tracking-wider group-hover:text-[#c8a97e] transition-colors duration-300 uppercase">
                  {language === 'ar' ? 'محمد عبد الرؤوف أنور' : 'Mohamed Abdel Raouf Anwer'}
                </span>
                <span className="text-[#6b6b70] text-[10px] font-mono tracking-widest uppercase">
                  {language === 'ar' ? 'مطور إبداعي' : 'Creative Developer'}
                </span>
              </div>
            </Link>
          </div>

          {/* Center Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-6 lg:gap-8 bg-[#141415]/70 border border-[#1f1f21] px-6 py-2 rounded-full backdrop-blur-md"
            role="navigation"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-[#8c8c92] hover:text-[#f0ede8] transition-colors duration-200 text-xs tracking-[0.15em] font-medium cursor-pointer"
                {...cursorHandlers('link')}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Controls / Language Toggle / WhatsApp / Time / Admin / CTA */}
          <div className="flex items-center gap-3 lg:gap-5">
            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141415] border border-[#1f1f21] hover:border-[#c8a97e] text-xs font-mono transition-colors cursor-pointer"
              title={language === 'en' ? 'التحويل للغة العربية' : 'Switch to English'}
              {...cursorHandlers('link')}
            >
              <span className="text-base leading-none">🌐</span>
              <span className={language === 'en' ? 'text-[#c8a97e] font-bold' : 'text-[#6b6b70]'}>
                EN
              </span>
              <span className="text-[#3a3a3e]">|</span>
              <span className={language === 'ar' ? 'text-[#c8a97e] font-bold' : 'text-[#6b6b70]'}>
                عربي
              </span>
            </button>

            {/* Start a Project CTA Button */}
            <button
              onClick={() => scrollTo('#contact')}
              className="hidden sm:block px-4 lg:px-5 py-2 bg-[#c8a97e] text-[#0a0a0b] text-xs font-bold tracking-[0.15em] rounded-[2px] hover:bg-[#f0ede8] transition-colors duration-300 cursor-pointer shadow-lg shadow-[#c8a97e]/10 uppercase"
              {...cursorHandlers('link')}
            >
              {t.startProject}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              className="md:hidden flex flex-col justify-center items-center gap-1.5 p-2.5 w-10 h-10 rounded-sm bg-[#141415] border border-[#1f1f21] text-[#f0ede8]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
            >
              <span
                className={`block w-5 h-[1.5px] bg-[#f0ede8] transition-all duration-300 ${
                  menuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`block w-5 h-[1.5px] bg-[#f0ede8] transition-all duration-300 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block w-5 h-[1.5px] bg-[#f0ede8] transition-all duration-300 ${
                  menuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Menu Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-[#0a0a0b]/98 backdrop-blur-2xl flex flex-col items-center justify-center transition-all duration-500 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-6 text-center px-6">
          {/* Mobile Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#141415] border border-[#c8a97e] text-xs font-mono"
          >
            <span>🌐</span>
            <span className={language === 'en' ? 'text-[#c8a97e] font-bold' : 'text-[#6b6b70]'}>
              ENGLISH
            </span>
            <span className="text-[#3a3a3e]">|</span>
            <span className={language === 'ar' ? 'text-[#c8a97e] font-bold' : 'text-[#6b6b70]'}>
              العربية
            </span>
          </button>

          <div className="w-16 h-px bg-[#1f1f21]" />

          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-[#f0ede8] text-2xl font-bold tracking-wider hover:text-[#c8a97e] transition-colors duration-300 cursor-pointer"
            >
              {link.label}
            </button>
          ))}

          <button
            onClick={() => scrollTo('#contact')}
            className="mt-2 px-8 py-4 bg-[#c8a97e] text-[#0a0a0b] text-xs tracking-[0.2em] font-bold uppercase rounded-sm shadow-xl"
          >
            {t.startProject}
          </button>
        </div>
      </div>
    </>
  )
}
