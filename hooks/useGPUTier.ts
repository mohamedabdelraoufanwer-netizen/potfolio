'use client'

import { useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { detectGPUTier } from '@/lib/perf'

export function useGPUTier() {
  const setGPUTier = useStore(s => s.setGPUTier)
  const setIsMobile = useStore(s => s.setIsMobile)

  useEffect(() => {
    const tier = detectGPUTier()
    const mobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    setGPUTier(tier)
    setIsMobile(mobile)
  }, [setGPUTier, setIsMobile])
}
