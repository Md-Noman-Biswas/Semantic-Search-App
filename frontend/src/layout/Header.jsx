import { AnimatePresence, motion } from 'framer-motion'
import { LogOut, Menu, Moon, Sun, User } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Button } from '../components/ui/button'

const navLinkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm transition ${
    isActive
      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
  }`

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-white/90 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          {user && (
            <Button variant="ghost" className="md:hidden" onClick={onMenuClick}>
              <Menu className="h-4 w-4" />
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Semantic Search
          </Link>
          <span className="hidden rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 md:inline dark:bg-emerald-900/40 dark:text-emerald-300">
            UI Refresh v2
          </span>
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            {user && <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={toggleTheme} className="transition hover:scale-105">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user ? (
            <div className="relative">
              <Button variant="outline" onClick={() => setOpen((v) => !v)} className="transition hover:scale-105">
                <User className="mr-2 h-4 w-4" /> {user.name}
              </Button>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute right-0 mt-2 w-44 rounded-lg border border-border bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setOpen(false)
                        logout()
                      }}
                      className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login"><Button>Login</Button></Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
