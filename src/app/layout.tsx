import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Seven Elements Mailer',
  description: 'Bulk Mailing Tool for Seven Elements Design',
  icons: { icon: 'https://sevenelementsdesign.in/wp-content/uploads/2022/01/cropped-favicon-270x270.png' }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1a1a1a', color: '#fff' },
          success: { iconTheme: { primary: '#e13a30', secondary: '#fff' } }
        }} />
      </body>
    </html>
  )
}