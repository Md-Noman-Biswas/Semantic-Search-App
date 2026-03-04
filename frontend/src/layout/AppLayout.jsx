import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { cn } from '../lib/utils'

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const navItems = useMemo(() => {
    const items = [{ to: '/dashboard', label: 'Dashboard' }]
    if (user?.role === 'admin') items.push({ to: '/users', label: 'User Management' })
    return items
  }, [user?.role])

  return (
    <div className="flex min-h-screen bg-background dark:bg-slate-950">
      <aside className={cn('fixed inset-y-0 z-40 w-64 border-r border-border bg-white p-5 transition-transform dark:bg-slate-950 md:translate-x-0', open ? 'translate-x-0' : '-translate-x-full')}>
        <div className="mb-8">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Semantic Admin</h1>
          <p className="text-sm text-muted-foreground">Knowledge workspace</p>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn('block rounded-md px-3 py-2 text-sm font-medium', location.pathname === item.to ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800')}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {open && <button className="fixed inset-0 z-30 bg-black/30 md:hidden" onClick={() => setOpen(false)} aria-label="Close sidebar" />}

      <div className="flex flex-1 flex-col md:ml-64">
        <header className="sticky top-0 z-20 border-b border-border bg-white/95 backdrop-blur dark:bg-slate-950/95">
          <div className="flex items-center justify-between px-4 py-3 md:px-8">
            <div className="flex items-center gap-3">
              <Button variant="outline" className="md:hidden" onClick={() => setOpen((v) => !v)}>☰</Button>
              <div>
                <p className="text-sm font-semibold">Welcome, {user?.name}</p>
                <p className="text-xs text-muted-foreground">Manage your documents</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="capitalize">{user?.role}</Badge>
              <Button variant="outline" onClick={logout}>Logout</Button>
            </div>
          </div>
        </header>

        <main className="animate-fade-in p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}

export default AppLayout
