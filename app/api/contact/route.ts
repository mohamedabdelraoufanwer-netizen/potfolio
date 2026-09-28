import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'data', 'inquiries.json')

function getInquiries() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, '[]', 'utf-8')
      return []
    }
    const data = fs.readFileSync(dataFilePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

function saveInquiries(inquiries: unknown[]) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(inquiries, null, 2), 'utf-8')
  } catch (err) {
    console.error('Failed to save inquiries:', err)
  }
}

export async function GET() {
  const inquiries = getInquiries()
  return NextResponse.json({ success: true, inquiries })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, projectType, budget, description } = body

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and Email are required.' },
        { status: 400 }
      )
    }

    const newInquiry = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      company: company || '',
      projectType: projectType || 'General',
      budget: budget || 'Not specified',
      description: description || '',
      createdAt: new Date().toISOString(),
      read: false,
    }

    const inquiries = getInquiries()
    inquiries.unshift(newInquiry)
    saveInquiries(inquiries)

    return NextResponse.json({ success: true, inquiry: newInquiry })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Server error processing inquiry.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })
    }

    let inquiries = getInquiries()
    inquiries = inquiries.filter((item: { id: string }) => item.id !== id)
    saveInquiries(inquiries)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
