import type { CapabilityGroup } from '@/types'

export const capabilities: CapabilityGroup[] = [
  {
    id: 'creative',
    label: 'CREATIVE',
    description: 'Direction, identity, and visual storytelling',
    skills: ['Creative Direction', 'UI / UX Design', 'Visual Storytelling', 'Digital Experiences', 'Typography', 'Art Direction'],
    color: '#c8a97e',
    environmentReaction: 'design',
  },
  {
    id: 'frontend',
    label: 'FRONTEND',
    description: 'Modern interfaces built with precision',
    skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS'],
    color: '#7c9cbf',
    environmentReaction: 'code',
  },
  {
    id: 'motion',
    label: 'MOTION',
    description: 'Animation as a design language',
    skills: ['GSAP', 'ScrollTrigger', 'Lenis', 'Micro-interactions', 'Transition Design', 'Scroll Animation'],
    color: '#9b7cbf',
    environmentReaction: 'motion',
  },
  {
    id: 'threed',
    label: '3D',
    description: 'Spatial computing and WebGL environments',
    skills: ['Three.js', 'React Three Fiber', 'WebGL', 'GLSL Shaders', 'Drei', '3D Environments'],
    color: '#7cbf9b',
    environmentReaction: 'three-d',
  },
  {
    id: 'backend',
    label: 'BACKEND',
    description: 'Systems, APIs, and data architecture',
    skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'PHP', 'MySQL', 'JWT', 'Authentication'],
    color: '#bf9b7c',
    environmentReaction: 'backend',
  },
  {
    id: 'cms',
    label: 'CMS',
    description: 'Content systems and learning platforms',
    skills: ['WordPress', 'LMS Platforms', 'Content Management', 'Course Architecture'],
    color: '#bf7c9b',
    environmentReaction: 'cms',
  },
]
