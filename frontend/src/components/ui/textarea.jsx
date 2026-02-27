import { cn } from '../../lib/utils'

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'min-h-24 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none ring-primary placeholder:text-muted-foreground focus:ring-2',
        className,
      )}
      {...props}
    />
  )
}
