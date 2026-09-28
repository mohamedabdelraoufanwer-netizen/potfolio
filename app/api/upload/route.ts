import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

function ensureUploadsDir() {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }
}

// GET: List all uploaded images
export async function GET() {
  try {
    ensureUploadsDir()
    const fileNames = fs.readdirSync(uploadsDir)

    const files = fileNames
      .filter((file) => /\.(png|jpe?g|webp|svg|gif)$/i.test(file))
      .map((fileName) => {
        const filePath = path.join(uploadsDir, fileName)
        const stats = fs.statSync(filePath)
        return {
          name: fileName,
          url: `/uploads/${fileName}`,
          size: stats.size,
          createdAt: stats.birthtime.toISOString(),
        }
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ success: true, files })
  } catch (err) {
    console.error('Failed to list files:', err)
    return NextResponse.json({ success: false, error: 'Failed to read uploads directory' }, { status: 500 })
  }
}

// POST: Upload an image file
export async function POST(request: Request) {
  try {
    ensureUploadsDir()
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    // Validate mime type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml', 'image/gif']
    if (!validTypes.includes(file.type) && !/\.(png|jpe?g|webp|svg|gif)$/i.test(file.name)) {
      return NextResponse.json({ success: false, error: 'Only image files are allowed (.png, .jpg, .webp, .svg, .gif)' }, { status: 400 })
    }

    // Size limit: 15MB
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size exceeds 15MB limit' }, { status: 400 })
    }

    // Clean filename and make unique
    const timestamp = Date.now()
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase()
    const finalFileName = `${timestamp}_${cleanName}`
    const finalFilePath = path.join(uploadsDir, finalFileName)

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    fs.writeFileSync(finalFilePath, buffer)

    return NextResponse.json({
      success: true,
      file: {
        name: finalFileName,
        url: `/uploads/${finalFileName}`,
        size: file.size,
        createdAt: new Date().toISOString(),
      },
    })
  } catch (err) {
    console.error('Failed to upload file:', err)
    return NextResponse.json({ success: false, error: 'File upload failed' }, { status: 500 })
  }
}

// DELETE: Remove an uploaded file
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('file')

    if (!fileName) {
      return NextResponse.json({ success: false, error: 'File name required' }, { status: 400 })
    }

    // Prevent directory traversal attacks
    const sanitized = path.basename(fileName)
    const filePath = path.join(uploadsDir, sanitized)

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 })
    }
  } catch (err) {
    console.error('Failed to delete file:', err)
    return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 })
  }
}
