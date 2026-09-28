export interface ProcessStep {
  number: string
  title: string
  description: string
  detail: string
}

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'DISCOVER',
    description: 'Research, strategy, and creative brief',
    detail: 'Understanding the project goals, audience, competitive landscape, and technical requirements before a single line of code is written.',
  },
  {
    number: '02',
    title: 'DESIGN',
    description: 'Visual direction, systems, and prototypes',
    detail: 'Establishing the visual language — typography, color, motion principles, and interface architecture — before moving to engineering.',
  },
  {
    number: '03',
    title: 'ENGINEER',
    description: 'Architecture, components, and systems',
    detail: 'Building scalable, performant systems with clean architecture, reusable components, and engineering decisions that support the design.',
  },
  {
    number: '04',
    title: 'ANIMATE',
    description: 'Motion, interaction, and 3D experience',
    detail: 'Choreographing motion across scroll, interaction, and 3D space — where animation becomes narrative and interaction becomes storytelling.',
  },
  {
    number: '05',
    title: 'OPTIMIZE',
    description: 'Performance, SEO, and accessibility',
    detail: 'Ensuring the experience loads fast, ranks well, and works for everyone — from the highest-end desktop to a mid-range mobile device.',
  },
  {
    number: '06',
    title: 'LAUNCH',
    description: 'Deployment, testing, and delivery',
    detail: 'Deploying to production with confidence — cross-browser testing, responsive QA, and ongoing support after launch.',
  },
]
