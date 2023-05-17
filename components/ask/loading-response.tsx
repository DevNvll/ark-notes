import { cn } from '@/lib/utils'

export function LoadingResponse() {
  return (
    <div className="flex items-center w-full space-x-2">
      <div
        className={cn(
          'px-4 py-3 rounded-[--radius] shadow-sm max-w-[80%] bg-gray-100 text-gray-900'
        )}
      >
        Loading
      </div>
    </div>
  )
}
