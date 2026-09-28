export type ProjectCategory = 
  | 'FULL-STACK'
  | 'LMS'
  | 'FRONTEND'
  | 'CORPORATE'
  | 'CREATIVE'
  | 'TOURISM'
  | 'E-COMMERCE'
  | 'PORTFOLIO'

export type ProjectTag = 
  | '3D' | 'Motion' | 'Frontend' | 'Backend' | 'Authentication' | 'Security'
  | 'LMS' | 'API' | 'CMS' | 'Bilingual' | 'RTL' | 'E-commerce' | 'Library'
  | 'Corporate' | 'Creative' | 'Tourism' | 'Portfolio' | 'AI'

export interface Project {
  id: string
  number: string
  title: string
  titleAr?: string
  subtitle: string
  subtitleAr?: string
  category: string
  categoryAr?: string
  description: string
  descriptionAr?: string
  longDescription: string
  longDescriptionAr?: string
  url: string
  githubUrl?: string
  tech: string[]
  tags: ProjectTag[]
  featured: boolean
  flagship: boolean
  accentColor: string
  environmentType: 'command-center' | 'education-nodes' | 'library' | 'clinic' | 'gallery' | 'architecture' | 'showroom' | 'timeline' | 'course'
  image: string
  caseStudy?: CaseStudy
}

export interface CaseStudy {
  overview: string
  objective: string
  challenge: string
  solution: string
  design: string
  implementation: string
  features: string[]
  liveUrl: string
}
