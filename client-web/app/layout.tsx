import './globals.css'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import Footer from './components/Footer'

const inter = Inter({
  weight: ['400', '700'],
  subsets: ['latin']
})

export const metadata = {
  title: {
    default: "Remote Job Finder",
    template: "%s | Remote Job Finder",
  },
  description: "Find Remote jobs for software development, engineering, product manager, owner, content writer",
  keywords: "remote jobs, work from home, python, golang, javascript, react, front-end, backend, dev ops, content writer, product manager",
  other: {
    "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className='container'>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
