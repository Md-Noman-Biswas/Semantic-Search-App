import { cn } from '../../lib/utils'

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none ring-primary placeholder:text-muted-foreground focus:ring-2',
        className,
      )}
      {...props}
    />
  )
}
