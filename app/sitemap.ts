import type { MetadataRoute } from 'next'
import { projects } from '@/data/projects'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mohamednagyelgheity.com'

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]

  const caseStudyRoutes: MetadataRoute.Sitemap = projects
    .filter((p) => p.caseStudy !== undefined)
    .map((p) => ({
      url: `${baseUrl}/work/${p.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }))

  return [...staticRoutes, ...caseStudyRoutes]
}
