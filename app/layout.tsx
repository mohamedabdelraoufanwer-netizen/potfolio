import type { Metadata } from 'next'
import { Inter, Cairo } from 'next/font/google'
import '@/app/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Mohamed Abdel Raouf Anwer — Creative Developer & Full-Stack Engineer',
  description:
    'The Digital Workspace of Mohamed Abdel Raouf Anwer. Creative Developer & Full-Stack Engineer building digital products combining design, motion, 3D, and engineering.',
  keywords: [
    'Mohamed Abdel Raouf Anwer',
    'Creative Developer',
    'Full-Stack Engineer',
    'Three.js',
    'React Three Fiber',
    'WebGL',
    'GSAP',
    'Next.js',
    'Interactive Portfolio',
    'Frontend Architecture',
  ],
  authors: [{ name: 'Mohamed Abdel Raouf Anwer' }],
  creator: 'Mohamed Abdel Raouf Anwer',
  metadataBase: new URL('https://mohamednagyelgheity.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mohamednagyelgheity.com',
    title: 'Mohamed Abdel Raouf Anwer — Creative Developer & Full-Stack Engineer',
    description:
      'The Digital Workspace of Mohamed Abdel Raouf Anwer. Creative Developer & Full-Stack Engineer building digital experiences that feel alive.',
    siteName: 'Mohamed Abdel Raouf Anwer Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mohamed Abdel Raouf Anwer — The Digital Workspace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mohamed Abdel Raouf Anwer — Creative Developer & Full-Stack Engineer',
    description:
      'The Digital Workspace of Mohamed Abdel Raouf Anwer. Creative Developer & Full-Stack Engineer.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cairo.variable} bg-[#0a0a0b] text-[#f0ede8]`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#0a0a0b" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Mohamed Abdel Raouf Anwer',
              jobTitle: 'Creative Developer & Full-Stack Engineer',
              description:
                'Creative Developer and Full-Stack Engineer building immersive 3D digital experiences, interactive web applications, LMS platforms, and high-performance software.',
              url: 'https://mohamednagyelgheity.com',
              knowsAbout: [
                'React',
                'Next.js',
                'Three.js',
                'React Three Fiber',
                'WebGL',
                'GLSL',
                'GSAP',
                'Node.js',
                'Express',
                'MongoDB',
                'PHP',
                'MySQL',
                'Full-Stack Architecture',
              ],
            }),
          }}
        />
      </head>
      <body className="bg-[#0a0a0b] text-[#f0ede8] antialiased selection:bg-[#c8a97e] selection:text-[#0a0a0b]">
        {children}
      </body>
    </html>
  )
}
