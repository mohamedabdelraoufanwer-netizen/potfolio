'use client'

import { useEffect, useRef, useState } from 'react'

interface MouseParallax {
  x: number
  y: number
  smoothX: number
  smoothY: number
}

export function useMouseParallax(strength: number = 1) {
  const [parallax, setParallax] = useState<MouseParallax>({ x: 0, y: 0, smoothX: 0, smoothY: 0 })
  const rafRef = useRef<number>(0)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2 * strength
      const y = (e.clientY / window.innerHeight - 0.5) * 2 * strength
      targetRef.current = { x, y }
      setParallax((prev) => ({ ...prev, x, y }))
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const animate = () => {
      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.05)
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.05)
      setParallax((prev) => ({
        ...prev,
        smoothX: currentRef.current.x,
        smoothY: currentRef.current.y,
      }))
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [strength])

  return parallax
}
