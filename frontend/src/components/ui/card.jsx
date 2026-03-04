import { cn } from '../../lib/utils'

export function Card({ className, ...props }) {
  return <div className={cn('rounded-xl border border-border bg-card shadow-sm dark:border-slate-800 dark:bg-slate-900', className)} {...props} />
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('p-5 pb-2', className)} {...props} />
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn('text-lg font-semibold text-slate-900 dark:text-slate-100', className)} {...props} />
}

export function CardContent({ className, ...props }) {
  return <div className={cn('p-5 pt-3', className)} {...props} />
}
