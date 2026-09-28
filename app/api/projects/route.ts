import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { projects as initialProjects } from '@/data/projects'

const customProjectsPath = path.join(process.cwd(), 'data', 'custom-projects.json')
const hiddenProjectsPath = path.join(process.cwd(), 'data', 'hidden-projects.json')

function getCustomProjects() {
  try {
    if (!fs.existsSync(customProjectsPath)) {
      fs.writeFileSync(customProjectsPath, '[]', 'utf-8')
      return []
    }
    const data = fs.readFileSync(customProjectsPath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

function saveCustomProjects(projects: unknown[]) {
  try {
    fs.writeFileSync(customProjectsPath, JSON.stringify(projects, null, 2), 'utf-8')
  } catch (err) {
    console.error('Failed to save custom projects:', err)
  }
}

function getHiddenProjectIds(): string[] {
  try {
    if (!fs.existsSync(hiddenProjectsPath)) return []
    const ids = JSON.parse(fs.readFileSync(hiddenProjectsPath, 'utf-8'))
    return Array.isArray(ids) ? ids.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

function saveHiddenProjectIds(ids: string[]) {
  try {
    fs.writeFileSync(hiddenProjectsPath, JSON.stringify(ids, null, 2), 'utf-8')
    return true
  } catch (err) {
    console.error('Failed to save hidden projects:', err)
    return false
  }
}

export async function GET() {
  const hiddenIds = new Set(getHiddenProjectIds())
  const projects = [
    ...getCustomProjects(),
    ...initialProjects.filter((project) => !hiddenIds.has(project.id)),
  ]
  return NextResponse.json({ success: true, projects })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      titleAr,
      subtitle,
      subtitleAr,
      category,
      categoryAr,
      description,
      descriptionAr,
      longDescription,
      longDescriptionAr,
      url,
      tech,
      tags,
      featured,
      flagship,
      accentColor,
      image,
      environmentType,
    } = body

    if (!title || !url) {
      return NextResponse.json(
        { success: false, error: 'Title and URL are required' },
        { status: 400 }
      )
    }

    const projects = getCustomProjects()
    const newProject = {
      id: `custom-${Date.now()}`,
      number: String(projects.length + 10).padStart(2, '0'),
      title,
      titleAr: titleAr || title,
      subtitle: subtitle || 'Interactive Web Platform',
      subtitleAr: subtitleAr || subtitle || 'منصة تفاعلية متقدمة',
      category: category || 'FULL-STACK / WEB',
      categoryAr: categoryAr || category || 'تطوير متكامل / ويب',
      description: description || '',
      descriptionAr: descriptionAr || description || '',
      longDescription: longDescription || description || '',
      longDescriptionAr: longDescriptionAr || descriptionAr || description || '',
      url,
      tech: Array.isArray(tech) ? tech : tech ? tech.split(',').map((s: string) => s.trim()) : ['TypeScript', 'React'],
      tags: Array.isArray(tags) ? tags : ['Frontend', 'Creative'],
      featured: Boolean(featured),
      flagship: Boolean(flagship),
      accentColor: accentColor || '#c8a97e',
      image: image || '/projects/top10.png',
      environmentType: environmentType || 'command-center',
    }

    projects.unshift(newProject)
    saveCustomProjects(projects)

    return NextResponse.json({ success: true, project: newProject })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to add project' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 })
    }

    const customProjects = getCustomProjects()
    if (customProjects.some((project: { id: string }) => project.id === id)) {
      const remainingProjects = customProjects.filter((project: { id: string }) => project.id !== id)
      saveCustomProjects(remainingProjects)
      return NextResponse.json({ success: true })
    }

    if (!initialProjects.some((project) => project.id === id)) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 })
    }

    const hiddenIds = getHiddenProjectIds()
    if (!hiddenIds.includes(id)) hiddenIds.push(id)
    if (!saveHiddenProjectIds(hiddenIds)) {
      return NextResponse.json({ success: false, error: 'Failed to hide project' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
