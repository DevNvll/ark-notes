'use client'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { useChatModal } from './ask/modal-context'

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const { setOpen: setChatModalOpen } = useChatModal()

  return (
    <nav className={cn('flex w-full justify-between', className)} {...props}>
      <div
        className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      >
        <Link href="/" className="text-xl font-medium">
          ARK
        </Link>
        <Link
          href="/"
          className={cn('text-sm transition-colors font-medium', {
            'hover:text-primary': pathname === '/',
            'text-muted-foreground hover:text-primary': pathname !== '/'
          })}
        >
          Documents
        </Link>
        <Link
          href="/ask"
          className={cn('text-sm transition-colors font-medium', {
            'hover:text-primary': pathname === '/ask',
            'text-muted-foreground hover:text-primary': pathname !== '/ask'
          })}
        >
          Ask
        </Link>
        <Link
          href="/settings"
          className={cn('text-sm transition-colors font-medium', {
            'hover:text-primary': pathname === '/settings',
            'text-muted-foreground hover:text-primary': pathname !== '/settings'
          })}
        >
          Settings
        </Link>
      </div>

      <Button variant="default" onClick={() => setChatModalOpen(true)}>
        Ask
      </Button>
    </nav>
  )
}
