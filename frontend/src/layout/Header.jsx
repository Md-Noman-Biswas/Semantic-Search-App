import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, LogOut, Menu, Moon, Sun, UserCircle2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
  }`

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const onOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutsideClick)
    return () => document.removeEventListener('mousedown', onOutsideClick)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-white/90 shadow-sm backdrop-blur-lg dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          {user && (
            <Button variant="ghost" className="md:hidden" onClick={onMenuClick}>
              <Menu className="h-4 w-4" />
            </Button>
          )}

          <Link to="/" className="group flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500 text-xs font-bold text-white shadow-sm transition-transform group-hover:scale-105">
              SS
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight md:text-base">Semantic Search</p>
              <p className="hidden text-xs text-muted-foreground md:block">Knowledge Workspace</p>
            </div>
          </Link>

          <nav className="ml-3 hidden items-center gap-1 md:flex">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            {user && <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>}
          </nav>
        </div>

        <div className="flex items-center gap-2" ref={menuRef}>
          <Button variant="ghost" onClick={toggleTheme} className="rounded-full transition hover:scale-105">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user ? (
            <div className="relative">
              <Button variant="outline" onClick={() => setOpen((value) => !value)} className="gap-2 rounded-full">
                <UserCircle2 className="h-4 w-4" />
                <span className="hidden sm:block">{user.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-white p-1.5 shadow-lg dark:bg-slate-900"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setOpen(false)
                        logout()
                      }}
                      className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login"><Button className="rounded-full">Login</Button></Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
