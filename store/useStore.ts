import { create } from 'zustand'
import type { CursorState, Project } from '@/types'
import type { GPUTier } from '@/lib/perf'
import type { Language } from '@/data/translations'

export interface ContactInquiry {
  id: string
  name: string
  email: string
  company: string
  projectType: string
  budget: string
  description: string
  createdAt: string
  read: boolean
}

interface GlobalState {
  isLoaded: boolean
  loadProgress: number
  setLoaded: (v: boolean) => void
  setLoadProgress: (v: number) => void

  cursorState: CursorState
  setCursorState: (state: CursorState) => void

  activeSection: string
  activeProject: string | null
  setActiveSection: (s: string) => void
  setActiveProject: (id: string | null) => void

  activeCapability: string | null
  setActiveCapability: (id: string | null) => void

  gpuTier: GPUTier
  isMobile: boolean
  setGPUTier: (tier: GPUTier) => void
  setIsMobile: (v: boolean) => void

  webglReady: boolean
  setWebglReady: (v: boolean) => void

  // Language & i18n
  language: Language
  setLanguage: (lang: Language) => void

  // Dynamic Projects & Inquiries for Dashboard
  customProjects: Project[]
  addCustomProject: (p: Project) => void
  deleteCustomProject: (id: string) => void

  inquiries: ContactInquiry[]
  addInquiry: (inquiry: Omit<ContactInquiry, 'id' | 'createdAt' | 'read'>) => void
  markInquiryRead: (id: string) => void
  deleteInquiry: (id: string) => void
}

export const useStore = create<GlobalState>((set) => ({
  isLoaded: false,
  loadProgress: 0,
  setLoaded: (v) => set({ isLoaded: v }),
  setLoadProgress: (v) => set({ loadProgress: v }),

  cursorState: 'default',
  setCursorState: (state) => set({ cursorState: state }),

  activeSection: 'hero',
  activeProject: null,
  setActiveSection: (s) => set({ activeSection: s }),
  setActiveProject: (id) => set({ activeProject: id }),

  activeCapability: null,
  setActiveCapability: (id) => set({ activeCapability: id }),

  gpuTier: 'medium',
  isMobile: false,
  setGPUTier: (tier) => set({ gpuTier: tier }),
  setIsMobile: (v) => set({ isMobile: v }),

  webglReady: false,
  setWebglReady: (v) => set({ webglReady: v }),

  language: 'en',
  setLanguage: (lang) => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = lang
    }
    set({ language: lang })
  },

  customProjects: [],
  addCustomProject: (p) =>
    set((state) => ({ customProjects: [p, ...state.customProjects] })),
  deleteCustomProject: (id) =>
    set((state) => ({
      customProjects: state.customProjects.filter((p) => p.id !== id),
    })),

  inquiries: [],
  addInquiry: (data) =>
    set((state) => ({
      inquiries: [
        {
          ...data,
          id: Math.random().toString(36).substring(2, 9),
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...state.inquiries,
      ],
    })),
  markInquiryRead: (id) =>
    set((state) => ({
      inquiries: state.inquiries.map((inq) =>
        inq.id === id ? { ...inq, read: true } : inq
      ),
    })),
  deleteInquiry: (id) =>
    set((state) => ({
      inquiries: state.inquiries.filter((inq) => inq.id !== id),
    })),
}))
