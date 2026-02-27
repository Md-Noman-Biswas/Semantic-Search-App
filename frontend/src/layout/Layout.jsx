import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Footer from './Footer'
import Header from './Header'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
  const { user } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Header onMenuClick={() => setOpen((v) => !v)} />
      {user && <Sidebar open={open} onClose={() => setOpen(false)} />}

      <main className={`mx-auto w-full max-w-7xl px-4 py-6 md:px-6 ${user ? 'md:pl-[18.5rem]' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}

export default Layout
