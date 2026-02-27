import { cn } from '../../lib/utils'

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'min-h-24 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none ring-primary placeholder:text-muted-foreground focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400',
        className,
      )}
      {...props}
    />
  )
}
