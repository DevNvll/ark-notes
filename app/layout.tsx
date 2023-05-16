import { MainNav } from '@/components/main-nav'
import './globals.css'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn('dark', inter.className)}>
        <div className="border-b ">
          <div className="flex items-center h-16 px-4">
            <MainNav className="mx-6" />
          </div>
        </div>
        <div className="flex-1 p-8 pt-6 space-y-4">{children}</div>
      </body>
    </html>
  )
}
