'use client'
import { MainNav } from '@/components/main-nav'
import './globals.css'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import ApiKeyModal from '@/components/api-key-modal'
import { Toaster } from '@/components/ui/toaster'
import { ChatModal } from '@/components/ask/chat-modal'
import { ModalProvider } from '@/components/ask/modal-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Ark Notes',
  description: 'Ask question about your notes using GPT'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn('dark h-screen', inter.className)}>
        <ModalProvider>
          <ApiKeyModal />
          <Toaster />
          <ChatModal />
          <div className="border-b ">
            <div className="flex items-center h-16 px-4">
              <MainNav />
            </div>
          </div>
          <div className="flex-1 h-[calc(100%-4rem)] p-8 pt-6 space-y-4">
            {children}
          </div>
        </ModalProvider>
      </body>
    </html>
  )
}
