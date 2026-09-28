'use client'

import { useEffect, useRef, useState } from 'react'
import { useStore } from '@/store/useStore'
import { gsap } from '@/lib/gsap'

export default function LoadingScreen() {
  const containerRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const isLoaded = useStore((s) => s.isLoaded)
  const setLoaded = useStore((s) => s.setLoaded)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 6) + 4
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        if (progressBarRef.current) {
          progressBarRef.current.style.transform = 'scaleX(1)'
        }
        if (counterRef.current) {
          counterRef.current.textContent = '100'
        }
        setTimeout(() => {
          setLoaded(true)
        }, 140)
      } else {
        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleX(${progress / 100})`
        }
        if (counterRef.current) {
          counterRef.current.textContent = progress.toString().padStart(2, '0')
        }
      }
    }, 28)

    return () => clearInterval(interval)
  }, [setLoaded])

  useEffect(() => {
    if (!isLoaded || !containerRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(containerRef.current, {
        yPercent: -100,
        duration: 0.75,
        ease: 'power4.inOut',
        onComplete: () => setVisible(false),
      })
    })

    return () => ctx.revert()
  }, [isLoaded])

  if (!visible) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#0a0a0b] flex flex-col items-center justify-center select-none"
      role="status"
      aria-label="Loading digital environment"
    >
      {/* Editorial Logomark */}
      <div className="mb-14 overflow-hidden">
        <h2 className="text-[#f0ede8] text-5xl md:text-6xl font-black tracking-[0.3em] pl-[0.3em]">
          MARA
        </h2>
      </div>

      {/* Numerical Counter */}
      <div className="mb-8 flex items-baseline gap-1 font-mono">
        <span
          ref={counterRef}
          className="text-[#c8a97e] text-6xl md:text-7xl font-black tabular-nums tracking-tighter"
        >
          00
        </span>
        <span className="text-[#6b6b70] text-xl font-light">%</span>
      </div>

      {/* Progress Track */}
      <div className="w-56 h-[1.5px] bg-[#1f1f21] relative overflow-hidden">
        <div
          ref={progressBarRef}
          className="absolute inset-y-0 left-0 w-full bg-[#c8a97e] origin-left transition-transform duration-100 ease-out"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Status Label */}
      <p className="mt-8 text-[#6b6b70] text-[10px] tracking-[0.35em] uppercase font-mono">
        INITIALIZING DIGITAL WORKSPACE
      </p>
    </div>
  )
}
