import { cn } from '@/lib/utils'
import { Skeleton } from '../ui/skeleton'

export function LoadingResponse() {
  return (
    <div className="flex items-center w-full space-x-2">
      <div
        className={cn(
          'px-4 py-3 rounded-[--radius] shadow-sm max-w-[80%] bg-gray-100 text-gray-900'
        )}
      >
        <Skeleton className="w-[50px] h-[20px] rounded-full bg-gray-300" />
      </div>
    </div>
  )
}
