'use client'

export type GPUTier = 'low' | 'medium' | 'high'

export interface PerfSettings {
  dpr: number
  maxLights: number
  shadowMapSize: number
  antialias: boolean
  particleCount: number
  enablePostProcessing: boolean
  enableShadows: boolean
  geometryDetail: number
}

export function getPerfSettings(tier: GPUTier, isMobile: boolean): PerfSettings {
  if (isMobile || tier === 'low') {
    return {
      dpr: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1) : 1,
      maxLights: 2,
      shadowMapSize: 512,
      antialias: false,
      particleCount: 50,
      enablePostProcessing: false,
      enableShadows: false,
      geometryDetail: 16,
    }
  }

  if (tier === 'medium') {
    return {
      dpr: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1.5,
      maxLights: 4,
      shadowMapSize: 1024,
      antialias: true,
      particleCount: 150,
      enablePostProcessing: true,
      enableShadows: false,
      geometryDetail: 32,
    }
  }

  return {
    dpr: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.35) : 1.35,
    maxLights: 4,
    shadowMapSize: 1024,
    antialias: false,
    particleCount: 180,
    enablePostProcessing: false,
    enableShadows: false,
    geometryDetail: 32,
  }
}

export function detectGPUTier(): GPUTier {
  if (typeof window === 'undefined') return 'medium'

  const canvas = document.createElement('canvas')
  const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null

  if (!gl) return 'low'

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
  if (!debugInfo) return 'medium'

  const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase() as string

  const highEnd = ['rtx', 'rx 6', 'rx 7', 'm1', 'm2', 'm3', 'm4', 'radeon pro', 'geforce gt']
  const lowEnd = ['intel hd', 'intel uhd 620', 'mali-4', 'adreno 5', 'adreno 4']

  if (highEnd.some((g) => renderer.includes(g))) return 'high'
  if (lowEnd.some((g) => renderer.includes(g))) return 'low'

  return 'medium'
}
