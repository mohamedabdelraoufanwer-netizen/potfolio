'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { useCursor } from '@/hooks/useCursor'
import { useStore } from '@/store/useStore'
import { translations } from '@/data/translations'

interface FormData {
  name: string
  email: string
  company: string
  projectType: string
  budget: string
  description: string
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const language = useStore((s) => s.language)
  const addInquiry = useStore((s) => s.addInquiry)
  const { cursorHandlers } = useCursor()

  const t = translations[language].contact

  const projectTypes =
    language === 'ar'
      ? [
          'تطبيق ويب متكامل (Full-Stack)',
          'تجربة 3D و WebGL تفاعلية',
          'متجر إلكتروني متقدم E-Commerce',
          'منصة تعليم إلكتروني LMS',
          'موقع تعريفي للشركات Corporate',
          'بورتفوليو إبداعي Creative Portfolio',
          'أخرى',
        ]
      : [
          'Full-Stack Web Application',
          'Interactive 3D Experience',
          'E-commerce Platform',
          'LMS / Educational Platform',
          'Corporate Website',
          'Creative Portfolio',
          'Other',
        ]

  const budgetRanges =
    language === 'ar'
      ? [
          'أقل من $1,000',
          '$1,000 – $3,000',
          '$3,000 – $8,000',
          '$8,000 – $20,000',
          '$20,000+',
          'نحددها بالنقاش',
        ]
      : [
          'Under $1,000',
          '$1,000 – $3,000',
          '$3,000 – $8,000',
          '$8,000 – $20,000',
          '$20,000+',
          "Let's discuss",
        ]

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    projectType: projectTypes[0],
    budget: budgetRanges[1],
    description: '',
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = headlineRef.current?.querySelectorAll('.contact-line')
      if (lines) {
        gsap.from(lines, {
          yPercent: 110,
          opacity: 0,
          duration: 1.1,
          stagger: 0.08,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [language])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        addInquiry(formData)
        setSubmitted(true)
      }
    } catch {
      // Fallback save to client state
      addInquiry(formData)
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  const inputClasses = `
    w-full bg-transparent border-b border-[#1f1f21] py-4 px-0
    text-[#f0ede8] text-sm placeholder-[#3a3a3e]
    focus:outline-none focus:border-[#c8a97e]
    transition-colors duration-300 font-light
  `

  const selectClasses = `
    w-full bg-[#0a0a0b] border-b border-[#1f1f21] py-4 px-0
    text-[#f0ede8] text-sm focus:outline-none focus:border-[#c8a97e]
    transition-colors duration-300 font-light appearance-none cursor-pointer
  `

  const headlineLines = [t.line1, t.line2, t.line3]

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-32 md:py-48 overflow-hidden"
      aria-label="Contact"
    >
      <div className="absolute inset-0 bg-[#0a0a0b]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(200,169,126,0.04)] to-transparent pointer-events-none" />

      <div className="relative z-10 px-6 md:px-16 lg:px-24 max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-start">
          {/* Left — Headline & Direct Contact Channels */}
          <div>
            <span className="section-label mb-8 block text-[#c8a97e]">{t.tag}</span>

            <div ref={headlineRef} className="mb-10">
              {headlineLines.map((line, i) => (
                <div key={i} className="overflow-hidden">
                  <div className="contact-line">
                    <h2
                      className="text-[clamp(2.5rem,6vw,6.5rem)] font-black leading-[0.9] tracking-tight"
                      style={{
                        color: i === 2 ? 'transparent' : undefined,
                        WebkitTextStroke: i === 2 ? '1px #f0ede8' : undefined,
                      }}
                    >
                      {i === 1 ? (
                        <span className="text-accent-gradient">{line}</span>
                      ) : (
                        line
                      )}
                    </h2>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[#b8b4ae] text-lg leading-relaxed mb-10 max-w-md font-light">
              {t.sub}
            </p>

            {/* Direct Communication Channels */}
            <div className="space-y-4">
              {/* WhatsApp Direct Action */}
              <a
                href="https://wa.me/201093215497"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-[#f0ede8] hover:text-[#25D366] transition-colors duration-300 text-sm font-mono tracking-wide font-medium"
                {...cursorHandlers('link')}
              >
                <span className="w-8 h-px bg-[#6b6b70] group-hover:bg-[#25D366] group-hover:w-12 transition-all duration-300 inline-block" />
                <span>{t.whatsApp} (01093215497)</span>
              </a>

              {/* Direct Mailto */}
              <a
                href="mailto:mohamedabdelraoufanwer@gmail.com"
                className="group flex items-center gap-3 text-[#6b6b70] hover:text-[#c8a97e] transition-colors duration-300 text-sm font-mono tracking-wide"
                {...cursorHandlers('link')}
              >
                <span className="w-8 h-px bg-[#6b6b70] group-hover:bg-[#c8a97e] group-hover:w-12 transition-all duration-300 inline-block" />
                <span>{t.sayHello} (mohamedabdelraoufanwer@gmail.com)</span>
              </a>

              {/* Real Social Links Matrix */}
              <div className="flex flex-wrap gap-5 pt-6">
                {[
                  {
                    label: 'LINKEDIN',
                    href: 'https://www.linkedin.com/in/mohamed-abdel-raouf-anwar-50536921a',
                  },
                  {
                    label: 'INSTAGRAM',
                    href: 'https://www.instagram.com/tohamy83/',
                  },
                  {
                    label: 'FACEBOOK',
                    href: 'https://www.facebook.com/profile.php?id=100006572746264',
                  },
                  {
                    label: 'WHATSAPP',
                    href: 'https://wa.me/201093215497',
                  },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#6b6b70] hover:text-[#c8a97e] transition-colors duration-300 font-mono text-xs tracking-[0.15em] uppercase border-b border-transparent hover:border-[#c8a97e]"
                    {...cursorHandlers('link')}
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>

              {/* Availability Indicator */}
              <div className="flex items-center gap-3 pt-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-[#b8b4ae] font-mono text-xs tracking-[0.15em]">
                  {language === 'ar'
                    ? 'متاح لبدء مشاريع جديدة'
                    : 'AVAILABLE FOR NEW PROJECTS'}
                </span>
              </div>
            </div>
          </div>

          {/* Right — Contact Form Connected to Admin Dashboard */}
          <div>
            {submitted ? (
              <div className="p-10 md:p-14 text-center rounded-sm bg-[#141415] border border-[#1f1f21]">
                <div className="text-[#c8a97e] text-6xl font-black mb-4">✓</div>
                <h3 className="text-[#f0ede8] text-2xl font-bold mb-3">{t.form.successTitle}</h3>
                <p className="text-[#b8b4ae] text-sm leading-relaxed mb-8 max-w-sm mx-auto font-light">
                  {t.form.successDesc}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {/* Option to also send via WhatsApp */}
                  <a
                    href={`https://wa.me/201093215497?text=${encodeURIComponent(
                      `Hello Mohamed Abdel Raouf Anwer, I just sent a project inquiry from your portfolio website.\n\nName: ${formData.name}\nProject: ${formData.projectType}\nBudget: ${formData.budget}\nDetails: ${formData.description}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold tracking-wider uppercase transition-colors"
                  >
                    CHAT ON WHATSAPP NOW ↗
                  </a>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 border border-[#1f1f21] text-[#6b6b70] hover:text-[#c8a97e] hover:border-[#c8a97e] font-mono text-xs tracking-[0.15em] transition-colors cursor-pointer uppercase"
                  >
                    {t.form.sendAnother}
                  </button>
                </div>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-8 bg-[#141415]/60 p-8 md:p-12 rounded-sm border border-[#1f1f21]"
              >
                <div>
                  <label className="block section-label mb-2 text-[#6b6b70]">
                    {t.form.nameLabel} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t.form.namePlaceholder}
                    className={inputClasses}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block section-label mb-2 text-[#6b6b70]">
                      {t.form.emailLabel} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t.form.emailPlaceholder}
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className="block section-label mb-2 text-[#6b6b70]">
                      {t.form.companyLabel}
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder={t.form.companyPlaceholder}
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block section-label mb-2 text-[#6b6b70]">
                      {t.form.typeLabel}
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className={selectClasses}
                    >
                      {projectTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block section-label mb-2 text-[#6b6b70]">
                      {t.form.budgetLabel}
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className={selectClasses}
                    >
                      {budgetRanges.map((range) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block section-label mb-2 text-[#6b6b70]">
                    {t.form.descLabel}
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={t.form.descPlaceholder}
                    className={`${inputClasses} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-5 bg-[#c8a97e] text-[#0a0a0b] font-bold text-xs tracking-[0.2em] uppercase hover:bg-[#f0ede8] transition-colors duration-300 cursor-pointer shadow-xl disabled:opacity-50"
                  {...cursorHandlers('link')}
                >
                  {submitting ? t.form.submitting : t.form.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
