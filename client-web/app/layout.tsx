import './globals.css'
import { Inter } from 'next/font/google'
import Header from './components/Header'
import Footer from './components/Footer'

const inter = Inter({
   weight: ['400', '700'],
   subsets: ['latin']
  })

export const metadata = {
  title: 'Remote Job Finder',
  description: 'Find Remote jobs for software development, engineering',
  keywords: "remote software jobs, work from home, python, golang, javascript, react, front-end, backend, dev ops"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header/>
        <main className='container'>
          {children}
        </main>
        <Footer/>
        </body>
    </html>
  )
}
