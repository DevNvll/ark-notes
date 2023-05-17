'use client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Chat } from './chat'
import { useEffect } from 'react'
import { useChatModal } from './modal-context'
import { DialogDescription } from '@radix-ui/react-dialog'

export function ChatModal() {
  const { open, setOpen } = useChatModal()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'j' && !open) {
        e.preventDefault()
        setOpen((open) => !open)
      } else if (e.key === 'esc') {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, setOpen])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="!h-[600px] !max-w-[60%] !max-h-[600px]">
        <DialogHeader>
          <DialogTitle>Chat</DialogTitle>
        </DialogHeader>
        <div className="h-[calc(600px-5rem)] ">
          <Chat compact />
        </div>
      </DialogContent>
    </Dialog>
  )
}
