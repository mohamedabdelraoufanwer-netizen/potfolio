'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import Link from 'next/link'

interface Inquiry {
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

interface CustomProject {
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
  url: string
  tech: string[]
  accentColor: string
  image: string
  flagship: boolean
}

interface UploadedFile {
  name: string
  url: string
  size: number
  createdAt: string
}

export default function AdminDashboard() {
  // Synchronous initialization from sessionStorage prevents screen flicker and slow re-render
  const [authenticated, setAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('mne_admin_auth') === 'true'
    }
    return false
  })
  const [passcode, setPasscode] = useState('')
  const [passcodeError, setPasscodeError] = useState(false)
  const [adminLang, setAdminLang] = useState<'ar' | 'en'>('ar')

  const [activeTab, setActiveTab] = useState<'inquiries' | 'projects' | 'media'>('inquiries')

  // Inquiries State
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loadingInquiries, setLoadingInquiries] = useState(false)

  // Custom Projects State
  const [projects, setProjects] = useState<CustomProject[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)

  // Media / Uploads State
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // New Project Form
  const [newProject, setNewProject] = useState({
    title: '',
    titleAr: '',
    subtitle: '',
    subtitleAr: '',
    category: 'FULL-STACK / WEB',
    categoryAr: 'تطوير متكامل / ويب',
    url: '',
    tech: 'React, Next.js, TypeScript, Tailwind',
    accentColor: '#c8a97e',
    image: '/projects/top10.png',
    flagship: false,
    description: '',
    descriptionAr: '',
  })
  const [addingProject, setAddingProject] = useState(false)
  const [projectSuccess, setProjectSuccess] = useState(false)
  const [copySuccess, setCopySuccess] = useState<string | null>(null)

  const isAr = adminLang === 'ar'

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (passcode === 'mne2026' || passcode === '2026' || passcode === 'admin') {
      setAuthenticated(true)
      sessionStorage.setItem('mne_admin_auth', 'true')
      setPasscodeError(false)
    } else {
      setPasscodeError(true)
    }
  }

  const handleLogout = () => {
    setAuthenticated(false)
    sessionStorage.removeItem('mne_admin_auth')
  }

  // Fetch inquiries
  const fetchInquiries = async () => {
    setLoadingInquiries(true)
    try {
      const res = await fetch('/api/contact')
      const data = await res.json()
      if (data.success) {
        setInquiries(data.inquiries || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingInquiries(false)
    }
  }

  // Fetch projects
  const fetchProjects = async () => {
    setLoadingProjects(true)
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      if (data.success) {
        setProjects(data.projects || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingProjects(false)
    }
  }

  // Fetch uploaded media
  const fetchFiles = async () => {
    setLoadingFiles(true)
    try {
      const res = await fetch('/api/upload')
      const data = await res.json()
      if (data.success) {
        setUploadedFiles(data.files || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingFiles(false)
    }
  }

  // Initial fast parallel loading
  useEffect(() => {
    if (!authenticated) return

    const timeout = window.setTimeout(() => {
      void Promise.all([fetchInquiries(), fetchProjects(), fetchFiles()])
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [authenticated])

  // Delete Inquiry
  const handleDeleteInquiry = async (id: string) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذه الرسالة؟' : 'Are you sure you want to delete this message?')) return
    try {
      await fetch(`/api/contact?id=${id}`, { method: 'DELETE' })
      setInquiries((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  // Add Project
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddingProject(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      })
      const data = await res.json()
      if (data.success) {
        setProjectSuccess(true)
        setProjects((prev) => [data.project, ...prev])
        setNewProject({
          title: '',
          titleAr: '',
          subtitle: '',
          subtitleAr: '',
          category: 'FULL-STACK / WEB',
          categoryAr: 'تطوير متكامل / ويب',
          url: '',
          tech: 'React, Next.js, TypeScript, Tailwind',
          accentColor: '#c8a97e',
          image: '/projects/top10.png',
          flagship: false,
          description: '',
          descriptionAr: '',
        })
        setTimeout(() => setProjectSuccess(false), 3000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setAddingProject(false)
    }
  }

  // Delete Project
  const handleDeleteProject = async (id: string) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذا المشروع؟' : 'Are you sure you want to delete this project?')) return
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok || !data.success) {
        alert(isAr ? 'تعذر حذف المشروع.' : 'Could not delete project.')
        return
      }
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  // File Upload Handler
  const handleFileUpload = async (filesToUpload: FileList | File[]) => {
    if (!filesToUpload || filesToUpload.length === 0) return
    const file = filesToUpload[0]

    setUploading(true)
    setUploadProgress(isAr ? 'جاري رفع ومعالجة الصورة...' : 'Uploading and optimizing image...')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.success) {
        setUploadedFiles((prev) => [data.file, ...prev])
        setUploadProgress(isAr ? '✓ تم رفع الصورة بنجاح!' : '✓ Image uploaded successfully!')
        // Auto-assign to current project form
        setNewProject((prev) => ({ ...prev, image: data.file.url }))
        setTimeout(() => setUploadProgress(null), 3500)
      } else {
        alert(data.error || 'Upload failed')
        setUploadProgress(null)
      }
    } catch (err) {
      console.error(err)
      alert(isAr ? 'فشل رفع الملف. تأكد من حجم الملف ونوعه.' : 'Failed to upload file.')
      setUploadProgress(null)
    } finally {
      setUploading(false)
    }
  }

  // Delete uploaded file
  const handleDeleteFile = async (fileName: string) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذه الصورة؟' : 'Are you sure you want to delete this image?')) return
    try {
      const res = await fetch(`/api/upload?file=${encodeURIComponent(fileName)}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setUploadedFiles((prev) => prev.filter((f) => f.name !== fileName))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopySuccess(text)
    setTimeout(() => setCopySuccess(null), 2000)
  }

  // Passcode Lock View
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] text-[#f0ede8] flex items-center justify-center px-6">
        <div className="w-full max-w-md p-8 md:p-10 rounded-lg bg-[#141415] border border-[#1f1f21] shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-sm bg-[#0a0a0b] border border-[#c8a97e] flex items-center justify-center">
              <span className="text-[#c8a97e] font-black tracking-widest text-lg">MARA</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2 tracking-tight">
            لوحة الإدارة والمتابعة
          </h1>
          <p className="text-[#6b6b70] text-xs font-mono text-center mb-8 uppercase tracking-wider">
            WORKSPACE MANAGEMENT CONSOLE
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-mono text-[#6b6b70] mb-2 uppercase tracking-wider">
                رمز الدخول (Passcode)
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="أدخل رمز المرور..."
                className="w-full px-4 py-3 bg-[#0a0a0b] border border-[#1f1f21] focus:border-[#c8a97e] outline-none text-[#f0ede8] text-sm font-mono transition-colors"
                autoFocus
              />
              {passcodeError && (
                <p className="text-rose-500 text-xs mt-2 font-mono">
                  رمز المرور غير صحيح. حاول مرة أخرى.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#c8a97e] text-[#0a0a0b] font-bold text-xs tracking-wider uppercase hover:bg-[#f0ede8] transition-colors cursor-pointer"
            >
              تسجيل الدخول للوحة التحكم ←
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-xs font-mono text-[#6b6b70] hover:text-[#c8a97e] transition-colors"
            >
              ← العودة للموقع الرئيسي
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#0a0a0b] text-[#f0ede8] selection:bg-[#c8a97e] selection:text-[#0a0a0b]"
    >
      {/* Admin Top Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0b]/90 backdrop-blur-xl border-b border-[#1f1f21] px-6 md:px-12 py-4">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-sm bg-[#141415] border border-[#c8a97e] flex items-center justify-center">
              <span className="text-[#c8a97e] font-black text-xs">MARA</span>
            </div>
            <div>
              <div className="text-sm font-bold tracking-wider">
                {isAr ? 'لوحة التحكم وإدارة الأعمال' : 'ADMIN CONTROL CENTER'}
              </div>
              <div className="text-[10px] font-mono text-[#6b6b70]">
                MOHAMED ABDEL RAOUF ANWER • DIGITAL WORKSPACE
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 bg-[#141415] p-1 rounded-sm border border-[#1f1f21]">
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-2 text-xs font-mono transition-colors cursor-pointer rounded-[2px] ${
                activeTab === 'inquiries'
                  ? 'bg-[#c8a97e] text-[#0a0a0b] font-bold'
                  : 'text-[#6b6b70] hover:text-[#f0ede8]'
              }`}
            >
              {isAr ? 'رسائل العملاء' : 'INBOX'} ({inquiries.length})
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 text-xs font-mono transition-colors cursor-pointer rounded-[2px] ${
                activeTab === 'projects'
                  ? 'bg-[#c8a97e] text-[#0a0a0b] font-bold'
                  : 'text-[#6b6b70] hover:text-[#f0ede8]'
              }`}
            >
              {isAr ? 'إدارة المشاريع' : 'PROJECTS'} ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`px-4 py-2 text-xs font-mono transition-colors cursor-pointer rounded-[2px] ${
                activeTab === 'media'
                  ? 'bg-[#c8a97e] text-[#0a0a0b] font-bold'
                  : 'text-[#6b6b70] hover:text-[#f0ede8]'
              }`}
            >
              {isAr ? 'رفع صور المشاريع' : 'MEDIA UPLOAD'} ({uploadedFiles.length})
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switch */}
            <button
              onClick={() => setAdminLang(isAr ? 'en' : 'ar')}
              className="px-3 py-1.5 bg-[#141415] border border-[#1f1f21] hover:border-[#c8a97e] text-xs font-mono text-[#c8a97e] transition-colors cursor-pointer"
            >
              {isAr ? 'English' : 'عربي'}
            </button>
            <Link
              href="/"
              className="px-3 py-1.5 border border-[#1f1f21] text-xs font-mono text-[#6b6b70] hover:text-[#c8a97e] hover:border-[#c8a97e] transition-colors"
            >
              {isAr ? 'معاينة الموقع ↗' : 'PUBLIC SITE ↗'}
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-[#1f1f21] text-xs font-mono text-[#f0ede8] hover:bg-rose-900/40 hover:text-rose-400 transition-colors cursor-pointer"
            >
              {isAr ? 'تسجيل الخروج' : 'LOGOUT'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 md:px-12 py-10">
        {/* TAB 1: INQUIRIES / MESSAGES */}
        {activeTab === 'inquiries' && (
          <div>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1f1f21]">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {isAr ? 'طلبات العملاء ورسائل المشاريع' : 'CLIENT INQUIRIES & LEADS'}
                </h2>
                <p className="text-[#6b6b70] text-xs font-mono mt-1">
                  {isAr
                    ? 'الرسائل والطلبات الواردة مباشرة من نموذج "ابدأ مشروعك".'
                    : 'Inquiries transmitted directly via the Start a Project contact form.'}
                </p>
              </div>
              <button
                onClick={fetchInquiries}
                className="px-4 py-2 border border-[#1f1f21] bg-[#141415] text-xs font-mono hover:border-[#c8a97e] transition-colors cursor-pointer"
              >
                {loadingInquiries
                  ? isAr
                    ? 'جاري التحديث...'
                    : 'REFRESHING...'
                  : isAr
                  ? 'تحديث الصندوق ⟳'
                  : 'REFRESH INBOX ⟳'}
              </button>
            </div>

            {inquiries.length === 0 ? (
              <div className="p-16 text-center border border-[#1f1f21] bg-[#141415] rounded-sm">
                <p className="text-lg text-[#b8b4ae] font-light mb-2">
                  {isAr ? 'لا توجد رسائل واردة حالياً.' : 'No client inquiries received yet.'}
                </p>
                <p className="text-xs font-mono text-[#6b6b70]">
                  {isAr
                    ? 'عندما يقوم أي عميل بتعبئة النموذج في الموقع، ستظهر رسالته هنا مباشرة مع إمكانية الرد السريع عبر واتساب أو البريد.'
                    : 'When a client fills out the contact form on your portfolio, it will appear here instantly.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-6 md:p-8 rounded-sm bg-[#141415] border border-[#1f1f21] hover:border-[#c8a97e]/40 transition-colors"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-[#f0ede8]">{inq.name}</h3>
                          {inq.company && (
                            <span className="px-2.5 py-0.5 rounded-sm bg-[#1a1a1c] border border-[#1f1f21] text-xs text-[#c8a97e] font-mono">
                              {inq.company}
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-mono text-[#6b6b70] mt-1">{inq.email}</div>
                      </div>

                      <div className="text-right font-mono text-xs text-[#6b6b70]">
                        <div>{new Date(inq.createdAt).toLocaleDateString()}</div>
                        <div className="text-[10px]">{new Date(inq.createdAt).toLocaleTimeString()}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-4 p-4 rounded-sm bg-[#0a0a0b] font-mono text-xs border border-[#1f1f21]">
                      <div>
                        <span className="text-[#6b6b70] block text-[10px] uppercase">
                          {isAr ? 'نوع المشروع' : 'PROJECT TYPE'}
                        </span>
                        <span className="text-[#f0ede8] font-medium">{inq.projectType}</span>
                      </div>
                      <div>
                        <span className="text-[#6b6b70] block text-[10px] uppercase">
                          {isAr ? 'الميزانية' : 'BUDGET RANGE'}
                        </span>
                        <span className="text-[#c8a97e] font-medium">{inq.budget}</span>
                      </div>
                      <div>
                        <span className="text-[#6b6b70] block text-[10px] uppercase">
                          {isAr ? 'الحالة' : 'STATUS'}
                        </span>
                        <span className="text-emerald-400 font-medium">● {isAr ? 'طلب جديد' : 'ACTIVE LEAD'}</span>
                      </div>
                    </div>

                    <div className="my-4 text-sm text-[#b8b4ae] leading-relaxed bg-[#0d0d0f] p-4 rounded-sm border border-[#1f1f21]/60">
                      <span className="text-xs font-mono text-[#6b6b70] block mb-1 uppercase tracking-wider">
                        {isAr ? 'تفاصيل ورؤية المشروع:' : 'PROJECT BRIEF / MESSAGE:'}
                      </span>
                      {inq.description || (isAr ? 'لا يوجد وصف.' : 'No description provided.')}
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#1f1f21]">
                      <div className="flex gap-3">
                        {/* WhatsApp Direct Reply */}
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(
                            `أهلاً ${inq.name}، شكراً لتواصلك مع محمد عبد الرؤوف أنور بخصوص مشروعك (${inq.projectType}).`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-colors"
                        >
                          {isAr ? 'رد عبر واتساب ↗' : 'WHATSAPP CLIENT ↗'}
                        </a>

                        {/* Email Direct Reply */}
                        <a
                          href={`mailto:${inq.email}?subject=${encodeURIComponent(
                            `Mohamed Abdel Raouf Anwer — Re: ${inq.projectType}`
                          )}&body=${encodeURIComponent(
                            `Hi ${inq.name},\n\nThank you for reaching out through my portfolio. I reviewed your requirements for ${inq.projectType}.\n\nBest regards,\nMohamed Abdel Raouf Anwer`
                          )}`}
                          className="px-4 py-2 bg-[#1f1f21] hover:bg-[#c8a97e] hover:text-[#0a0a0b] text-xs font-mono font-bold transition-colors"
                        >
                          {isAr ? 'إرسال إيميل ✉' : 'EMAIL CLIENT ✉'}
                        </a>
                      </div>

                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="text-xs font-mono text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                      >
                        {isAr ? 'حذف الرسالة ✕' : 'DELETE MESSAGE ✕'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROJECT MANAGER */}
        {activeTab === 'projects' && (
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Left — Add Project Form */}
            <div className="lg:col-span-6">
              <div className="p-8 rounded-sm bg-[#141415] border border-[#1f1f21]">
                <h3 className="text-xl font-bold mb-2">
                  {isAr ? 'إضافة مشروع جديد للموقع' : 'ADD NEW PROJECT'}
                </h3>
                <p className="text-xs font-mono text-[#6b6b70] mb-6">
                  {isAr
                    ? 'أضف مشروعاً جديداً ليظهر فوراً في الصفحة الرئيسية للموقع باللغتين العربية والإنجليزية.'
                    : 'Add a new project to your portfolio. It will appear on the homepage immediately.'}
                </p>

                {projectSuccess && (
                  <div className="p-4 mb-6 rounded-sm bg-emerald-900/40 border border-emerald-500 text-emerald-300 text-xs font-mono">
                    ✓ {isAr ? 'تم نشر المشروع بنجاح في الموقع!' : 'Project published successfully to your portfolio!'}
                  </div>
                )}

                <form onSubmit={handleAddProject} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#6b6b70] mb-1 uppercase">
                        {isAr ? 'عنوان المشروع (إنجليزي) *' : 'Project Title (EN) *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        placeholder="PROJECT TITLE"
                        className="w-full px-3 py-2.5 bg-[#0a0a0b] border border-[#1f1f21] focus:border-[#c8a97e] outline-none text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#6b6b70] mb-1 uppercase">
                        {isAr ? 'عنوان المشروع (عربي)' : 'Project Title (AR)'}
                      </label>
                      <input
                        type="text"
                        value={newProject.titleAr}
                        onChange={(e) => setNewProject({ ...newProject, titleAr: e.target.value })}
                        placeholder="عنوان المشروع بالعربية"
                        className="w-full px-3 py-2.5 bg-[#0a0a0b] border border-[#1f1f21] focus:border-[#c8a97e] outline-none text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#6b6b70] mb-1 uppercase">
                        {isAr ? 'الوصف الفرعي (إنجليزي)' : 'Subtitle (EN)'}
                      </label>
                      <input
                        type="text"
                        value={newProject.subtitle}
                        onChange={(e) => setNewProject({ ...newProject, subtitle: e.target.value })}
                        placeholder="Project Subtitle"
                        className="w-full px-3 py-2.5 bg-[#0a0a0b] border border-[#1f1f21] focus:border-[#c8a97e] outline-none text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#6b6b70] mb-1 uppercase">
                        {isAr ? 'الوصف الفرعي (عربي)' : 'Subtitle (AR)'}
                      </label>
                      <input
                        type="text"
                        value={newProject.subtitleAr}
                        onChange={(e) => setNewProject({ ...newProject, subtitleAr: e.target.value })}
                        placeholder="الوصف الفرعي للمشروع"
                        className="w-full px-3 py-2.5 bg-[#0a0a0b] border border-[#1f1f21] focus:border-[#c8a97e] outline-none text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#6b6b70] mb-1 uppercase">
                        {isAr ? 'التصنيف (إنجليزي)' : 'Category (EN)'}
                      </label>
                      <input
                        type="text"
                        value={newProject.category}
                        onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                        placeholder="FULL-STACK / WEB"
                        className="w-full px-3 py-2.5 bg-[#0a0a0b] border border-[#1f1f21] focus:border-[#c8a97e] outline-none text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#6b6b70] mb-1 uppercase">
                        {isAr ? 'التصنيف (عربي)' : 'Category (AR)'}
                      </label>
                      <input
                        type="text"
                        value={newProject.categoryAr}
                        onChange={(e) => setNewProject({ ...newProject, categoryAr: e.target.value })}
                        placeholder="تطوير متكامل / ويب"
                        className="w-full px-3 py-2.5 bg-[#0a0a0b] border border-[#1f1f21] focus:border-[#c8a97e] outline-none text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#6b6b70] mb-1 uppercase">
                      {isAr ? 'رابط المشروع المباشر (URL) *' : 'Project Live URL *'}
                    </label>
                    <input
                      type="url"
                      required
                      value={newProject.url}
                      onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2.5 bg-[#0a0a0b] border border-[#1f1f21] focus:border-[#c8a97e] outline-none text-xs font-mono"
                    />
                  </div>

                  {/* Project Image Selection / Quick Upload */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-mono text-[#6b6b70] uppercase">
                        {isAr ? 'صورة المشروع (مسار الصورة)' : 'Project Image Path'}
                      </label>
                      <button
                        type="button"
                        onClick={() => setActiveTab('media')}
                        className="text-[11px] text-[#c8a97e] hover:underline font-mono cursor-pointer"
                      >
                        {isAr ? '📁 تصفح أو رفع صورة جديدة ←' : '📁 Browse / Upload Image ←'}
                      </button>
                    </div>
                    <div className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={newProject.image}
                        onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                        placeholder="/uploads/my-image.png"
                        className="flex-1 px-3 py-2.5 bg-[#0a0a0b] border border-[#1f1f21] focus:border-[#c8a97e] outline-none text-xs font-mono"
                      />
                      {newProject.image && (
                        <div className="w-12 h-10 rounded border border-[#1f1f21] overflow-hidden bg-[#0a0a0b] shrink-0">
                          <img
                            src={newProject.image}
                            alt="preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              ;(e.target as HTMLElement).style.display = 'none'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#6b6b70] mb-1 uppercase">
                      {isAr ? 'التقنيات المستخدمة (مفصولة بفواصل)' : 'Technologies (comma-separated)'}
                    </label>
                    <input
                      type="text"
                      value={newProject.tech}
                      onChange={(e) => setNewProject({ ...newProject, tech: e.target.value })}
                      placeholder="React, Next.js, Three.js, Node.js"
                      className="w-full px-3 py-2.5 bg-[#0a0a0b] border border-[#1f1f21] focus:border-[#c8a97e] outline-none text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#6b6b70] mb-1 uppercase">
                      {isAr ? 'نبذة عن المشروع (عربي)' : 'Description (AR)'}
                    </label>
                    <textarea
                      rows={3}
                      value={newProject.descriptionAr}
                      onChange={(e) => setNewProject({ ...newProject, descriptionAr: e.target.value })}
                      placeholder="وصف تفصيلي يوضح أهداف المشروع ومميزاته التقنية..."
                      className="w-full px-3 py-2.5 bg-[#0a0a0b] border border-[#1f1f21] focus:border-[#c8a97e] outline-none text-xs leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#6b6b70] mb-1 uppercase">
                      {isAr ? 'نبذة عن المشروع (إنجليزي)' : 'Description (EN)'}
                    </label>
                    <textarea
                      rows={2}
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      placeholder="Brief overview of the project architecture and features..."
                      className="w-full px-3 py-2.5 bg-[#0a0a0b] border border-[#1f1f21] focus:border-[#c8a97e] outline-none text-xs font-mono leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="flagshipCheck"
                      checked={newProject.flagship}
                      onChange={(e) => setNewProject({ ...newProject, flagship: e.target.checked })}
                      className="accent-[#c8a97e] w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="flagshipCheck" className="text-xs font-mono text-[#f0ede8] cursor-pointer">
                      {isAr
                        ? 'مشروع رئيسي مميز (Flagship - بحجم بطاقة كبير)'
                        : 'Mark as Flagship Project (Large visual layout)'}
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={addingProject}
                    className="w-full py-3 bg-[#c8a97e] text-[#0a0a0b] font-bold text-xs font-mono uppercase hover:bg-[#f0ede8] transition-colors cursor-pointer mt-4"
                  >
                    {addingProject
                      ? isAr
                        ? 'جاري النشر...'
                        : 'PUBLISHING...'
                      : isAr
                      ? 'نشر المشروع في البورتفوليو ←'
                      : 'PUBLISH PROJECT TO PORTFOLIO →'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right — Existing Custom Projects List */}
            <div className="lg:col-span-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">
                  {isAr ? 'المشاريع الحالية' : 'ALL PROJECTS'} ({projects.length})
                </h3>
                <button
                  onClick={fetchProjects}
                  className="text-xs font-mono text-[#6b6b70] hover:text-[#c8a97e] cursor-pointer"
                >
                  {isAr ? 'تحديث القائمة ⟳' : 'REFRESH ⟳'}
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="p-12 text-center border border-[#1f1f21] bg-[#141415] rounded-sm">
                  <p className="text-sm text-[#b8b4ae] mb-1">
                    {isAr ? 'لا توجد مشاريع نشطة.' : 'No active projects.'}
                  </p>
                  <p className="text-xs font-mono text-[#6b6b70]">
                    {isAr
                      ? 'المشاريع النشطة تظهر هنا وفي الصفحة الرئيسية.'
                      : 'Active projects appear here and on the homepage.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[850px] overflow-y-auto pr-2">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-5 rounded-sm bg-[#141415] border border-[#1f1f21] hover:border-[#c8a97e]/40 transition-colors flex items-start gap-4"
                    >
                      {proj.image && (
                        <div className="w-20 h-16 rounded overflow-hidden bg-[#0a0a0b] shrink-0 border border-[#1f1f21]">
                          <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold truncate text-[#f0ede8]">
                            {isAr && proj.titleAr ? proj.titleAr : proj.title}
                          </h4>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="text-xs text-rose-400 hover:text-rose-300 font-mono cursor-pointer"
                            aria-label={isAr ? `حذف ${proj.titleAr || proj.title}` : `Delete ${proj.title}`}
                            title={isAr ? 'حذف المشروع' : 'Delete project'}
                          >
                            ✕
                          </button>
                        </div>
                        <p className="text-xs text-[#6b6b70] font-mono truncate">{proj.url}</p>
                        <p className="text-xs text-[#b8b4ae] line-clamp-2 mt-1">
                          {isAr && proj.descriptionAr ? proj.descriptionAr : proj.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: MEDIA & IMAGE UPLOADER */}
        {activeTab === 'media' && (
          <div className="space-y-10">
            {/* Upload Zone */}
            <div className="p-8 md:p-12 rounded-sm bg-[#141415] border border-[#1f1f21]">
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-2xl font-bold mb-2">
                  {isAr ? 'رفع صور جديدة للمشاريع' : 'UPLOAD PROJECT IMAGES'}
                </h3>
                <p className="text-xs font-mono text-[#6b6b70] mb-8">
                  {isAr
                    ? 'اسحب وأفلت صور المشاريع هنا، أو اضغط لاختيار صورة من جهازك (يدعم PNG, JPG, WebP, SVG).'
                    : 'Drag and drop project screenshots here, or click to browse from your device (PNG, JPG, WebP, SVG supported).'}
                </p>

                {/* Drop Area */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragOver(true)
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDragOver(false)
                    if (e.dataTransfer.files) {
                      handleFileUpload(e.dataTransfer.files)
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-10 border-2 border-dashed rounded-lg transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-4 ${
                    dragOver
                      ? 'border-[#c8a97e] bg-[#c8a97e]/10'
                      : 'border-[#1f1f21] hover:border-[#c8a97e]/60 bg-[#0a0a0b]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleFileUpload(e.target.files)
                      }
                    }}
                  />

                  <div className="w-16 h-16 rounded-full bg-[#141415] border border-[#1f1f21] flex items-center justify-center text-2xl">
                    📸
                  </div>

                  <div>
                    <span className="text-sm font-bold text-[#f0ede8]">
                      {isAr ? 'اضغط هنا لرفع صورة من جهازك' : 'Click to browse files'}
                    </span>
                    <span className="text-xs text-[#6b6b70] block mt-1 font-mono">
                      {isAr ? 'أو اسحب وأفلت الملف داخل هذا المربع' : 'or drag and drop your image here'}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-[#6b6b70] uppercase">
                    Max size: 15MB • PNG, JPG, WEBP, SVG
                  </span>
                </div>

                {uploadProgress && (
                  <div className="mt-6 p-4 rounded bg-[#0a0a0b] border border-[#c8a97e] text-xs font-mono text-[#c8a97e]">
                    {uploadProgress}
                  </div>
                )}
              </div>
            </div>

            {/* Uploaded Images Gallery */}
            <div>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#1f1f21]">
                <div>
                  <h3 className="text-xl font-bold">
                    {isAr ? 'مكتبة الصور المرفوعة' : 'UPLOADED MEDIA LIBRARY'} ({uploadedFiles.length})
                  </h3>
                  <p className="text-xs font-mono text-[#6b6b70]">
                    {isAr
                      ? 'يمكنك نسخ رابط أي صورة بنقرة واحدة، أو تعيينها مباشرة في نموذج المشروع الجديد.'
                      : 'Copy image URL with one click, or use it directly in the new project form.'}
                  </p>
                </div>
                <button
                  onClick={fetchFiles}
                  className="px-4 py-2 border border-[#1f1f21] bg-[#141415] text-xs font-mono hover:border-[#c8a97e] transition-colors cursor-pointer"
                >
                  {loadingFiles ? (isAr ? 'جاري التحديث...' : 'LOADING...') : isAr ? 'تحديث المكتبة ⟳' : 'REFRESH ⟳'}
                </button>
              </div>

              {copySuccess && (
                <div className="p-3 mb-6 bg-emerald-950/60 border border-emerald-500 text-emerald-400 text-xs font-mono">
                  ✓ {isAr ? 'تم نسخ مسار الصورة للحافظة:' : 'Copied image URL to clipboard:'} {copySuccess}
                </div>
              )}

              {uploadedFiles.length === 0 ? (
                <div className="p-16 text-center border border-[#1f1f21] bg-[#141415] rounded-sm">
                  <p className="text-base text-[#b8b4ae] mb-1">
                    {isAr ? 'لا توجد صور مرفوعة بعد.' : 'No images uploaded yet.'}
                  </p>
                  <p className="text-xs font-mono text-[#6b6b70]">
                    {isAr
                      ? 'قم برفع أول صورة لمشروعك عبر المربع أعلاه لتظهر هنا.'
                      : 'Upload your first project image using the drop zone above.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.name}
                      className="rounded-sm bg-[#141415] border border-[#1f1f21] overflow-hidden group hover:border-[#c8a97e]/60 transition-colors flex flex-col justify-between"
                    >
                      <div className="relative aspect-[16/10] bg-[#0a0a0b] overflow-hidden">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-[#0a0a0b]/80 px-2 py-0.5 rounded text-[10px] font-mono text-[#b8b4ae]">
                          {(file.size / 1024).toFixed(0)} KB
                        </div>
                      </div>

                      <div className="p-4">
                        <p className="text-xs font-mono text-[#f0ede8] truncate mb-3" title={file.name}>
                          {file.name}
                        </p>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(file.url)}
                            className="flex-1 py-1.5 bg-[#0a0a0b] border border-[#1f1f21] hover:border-[#c8a97e] text-[#c8a97e] text-[11px] font-mono transition-colors cursor-pointer"
                          >
                            {isAr ? 'نسخ الرابط' : 'Copy URL'}
                          </button>
                          <button
                            onClick={() => {
                              setNewProject((prev) => ({ ...prev, image: file.url }))
                              setActiveTab('projects')
                            }}
                            className="flex-1 py-1.5 bg-[#c8a97e] text-[#0a0a0b] font-bold text-[11px] font-mono hover:bg-[#f0ede8] transition-colors cursor-pointer"
                          >
                            {isAr ? 'استخدام للمشروع' : 'Use in Project'}
                          </button>
                          <button
                            onClick={() => handleDeleteFile(file.name)}
                            className="px-2 py-1.5 bg-[#0a0a0b] border border-rose-900/40 text-rose-400 hover:bg-rose-950 text-[11px] font-mono transition-colors cursor-pointer"
                            title="Delete image"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
