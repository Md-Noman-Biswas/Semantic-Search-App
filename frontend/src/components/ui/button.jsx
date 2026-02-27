import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const variants = {
  default: 'bg-primary text-primary-foreground hover:bg-blue-700',
  outline: 'border border-border bg-white text-slate-900 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
  ghost: 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
  destructive: 'bg-red-600 text-white hover:bg-red-700',
}

export function Button({ className, variant = 'default', ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
