import { cn } from '../../lib/utils'

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none ring-primary placeholder:text-muted-foreground focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400',
        className,
      )}
      {...props}
    />
  )
}
