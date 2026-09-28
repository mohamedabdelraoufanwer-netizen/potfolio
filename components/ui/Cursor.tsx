'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { useStore } from '@/store/useStore'
import { gsap } from '@/lib/gsap'

const cursorLabels: Record<string, string> = {
  view: 'VIEW',
  drag: 'DRAG',
  open: 'OPEN',
  link: 'LINK',
  default: '',
  hidden: '',
}

const finePointerQuery = '(hover: hover) and (pointer: fine)'

function subscribeToFinePointer(callback: () => void) {
  const mediaQuery = window.matchMedia(finePointerQuery)
  mediaQuery.addEventListener('change', callback)
  return () => mediaQuery.removeEventListener('change', callback)
}

function getFinePointer() {
  return window.matchMedia(finePointerQuery).matches
}

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const cursorState = useStore((s) => s.cursorState)
  const pos = useRef({ x: -100, y: -100 })
  const smooth = useRef({ x: -100, y: -100 })
  const hasFinePointer = useSyncExternalStore(subscribeToFinePointer, getFinePointer, () => false)

  useEffect(() => {
    if (!hasFinePointer) return

    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    let rafId: number
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const animate = () => {
      smooth.current.x = lerp(smooth.current.x, pos.current.x, 0.18)
      smooth.current.y = lerp(smooth.current.y, pos.current.y, 0.18)
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${smooth.current.x}px, ${smooth.current.y}px, 0) translate(-50%, -50%)`
      }
      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', move, { passive: true })
    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(rafId)
    }
  }, [hasFinePointer])

  useEffect(() => {
    if (!hasFinePointer || !ringRef.current) return

    const isHidden = cursorState === 'hidden'
    const isActive = cursorState !== 'default' && cursorState !== 'hidden'

    gsap.to(ringRef.current, {
      scale: isHidden ? 0 : isActive ? 1.6 : 1,
      opacity: isHidden ? 0 : isActive ? 1 : 0.6,
      backgroundColor: isActive ? 'rgba(200, 169, 126, 0.15)' : 'transparent',
      borderColor: isActive ? '#c8a97e' : 'rgba(200, 169, 126, 0.4)',
      duration: 0.3,
      ease: 'power3.out',
    })

    if (labelRef.current) {
      gsap.to(labelRef.current, {
        opacity: isActive ? 1 : 0,
        duration: 0.2,
      })
    }
  }, [cursorState, hasFinePointer])

  if (!hasFinePointer) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Outer Magnetic Ring Follower */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-[#c8a97e]/40 will-change-transform flex items-center justify-center pointer-events-none"
        style={{ transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)' }}
      >
        <span
          ref={labelRef}
          className="text-[#f0ede8] text-[8px] tracking-[0.2em] font-mono font-bold opacity-0 uppercase select-none pointer-events-none"
        >
          {cursorLabels[cursorState]}
        </span>
      </div>
    </div>
  )
}
