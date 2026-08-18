import { Separator } from '@/ui/components/ui/separator'
import { cn } from '@/ui/lib/utils'

export function OrnamentDivider({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)} role="presentation">
      <Separator className="flex-1 bg-border" />
      <span className="text-gold text-sm leading-none select-none" aria-hidden="true">
        ❧
      </span>
      <Separator className="flex-1 bg-border" />
    </div>
  )
}
