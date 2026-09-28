'use client'

import { useEffect, useRef, useState } from 'react'

export function useScrollVelocity() {
  const [velocity, setVelocity] = useState(0)
  const lastScrollY = useRef(0)
  const lastTime = useRef(0)
  const rafRef = useRef<number>(0)
  const velocityRef = useRef(0)

  useEffect(() => {
    lastTime.current = Date.now()

    const handleScroll = () => {
      const now = Date.now()
      const deltaY = window.scrollY - lastScrollY.current
      const deltaT = now - lastTime.current
      velocityRef.current = deltaY / Math.max(deltaT, 1)
      lastScrollY.current = window.scrollY
      lastTime.current = now
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const animate = () => {
      velocityRef.current = lerp(velocityRef.current, 0, 0.1)
      setVelocity(velocityRef.current)
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return velocity
}
