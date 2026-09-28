'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useRef, useState, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { getPerfSettings } from '@/lib/perf'

interface SceneProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function Scene({ children, className = '', style }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)
  const gpuTier = useStore((s) => s.gpuTier)
  const isMobile = useStore((s) => s.isMobile)
  const settings = getPerfSettings(gpuTier, isMobile)

  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      { rootMargin: '120px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    >
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        dpr={[1, Math.min(settings.dpr, 1.35)]}
        camera={{ position: [0, 0, 6], fov: 60, near: 0.1, far: 50 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          preserveDrawingBuffer: false,
        }}
        shadows={false}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  )
}
