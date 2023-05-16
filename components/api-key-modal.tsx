'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { API_KEY_LOCAL_STORAGE_KEY } from '@/lib/constants'

export default function ApiKeyModal() {
  const pathname = usePathname()
  const showApiKeyModal =
    localStorage.getItem(API_KEY_LOCAL_STORAGE_KEY) === null &&
    !pathname.startsWith('/settings')

  return (
    <AlertDialog open={showApiKeyModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>No OpenAI key</AlertDialogTitle>
          <AlertDialogDescription>
            No OpenAI key found. Please add your key in the settings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Link href="/settings">
            <AlertDialogAction>Go to settings</AlertDialogAction>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
