import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Footer from './Footer'
import Header from './Header'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
  const { user } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const hasDashboardShell = useMemo(() => {
    if (!user) return false
    return ['/dashboard', '/users', '/profile', '/settings'].some((path) => location.pathname.startsWith(path))
  }, [location.pathname, user])

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-foreground transition-colors duration-300 dark:bg-slate-950">
      <Header onMenuClick={() => setOpen((value) => !value)} />
      {hasDashboardShell && <Sidebar open={open} onClose={() => setOpen(false)} />}

      <main className={`mx-auto flex w-full flex-1 px-4 pb-10 pt-6 md:px-6 ${hasDashboardShell ? 'max-w-[1400px] md:pl-72' : 'max-w-7xl'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer withSidebarOffset={hasDashboardShell} />
    </div>
  )
}

export default Layout
