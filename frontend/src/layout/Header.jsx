import { AnimatePresence, motion } from 'framer-motion'
import { LogOut, Menu, Moon, Sun, User } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Button } from '../components/ui/button'

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-white/90 shadow-sm backdrop-blur dark:bg-slate-950/90 dark:border-slate-800">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          {user && (
            <Button variant="ghost" className="md:hidden" onClick={onMenuClick}>
              <Menu className="h-4 w-4" />
            </Button>
          )}
          <Link to="/" className="text-lg font-bold tracking-tight">Semantic Search</Link>
          <nav className="hidden items-center gap-1 md:flex">
            <NavLink to="/" className="rounded-md px-3 py-2 text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800">Home</NavLink>
            {user && <NavLink to="/dashboard" className="rounded-md px-3 py-2 text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800">Dashboard</NavLink>}
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
                    <Link to="/profile" className="block rounded-md px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">Profile</Link>
                    <button onClick={logout} className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
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
