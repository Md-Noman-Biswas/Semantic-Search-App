import { motion } from 'framer-motion'
import { FileText, LayoutDashboard, Settings, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const menuGroups = {
  admin: [
    { title: 'Documents', items: [{ to: '/dashboard', label: 'All Documents', icon: FileText }] },
    { title: 'Users', items: [{ to: '/users', label: 'User Management', icon: Users }] },
    { title: 'Settings', items: [{ to: '/settings', label: 'Preferences', icon: Settings }] },
  ],
  user: [
    { title: 'Workspace', items: [{ to: '/dashboard', label: 'My Dashboard', icon: LayoutDashboard }] },
    { title: 'Documents', items: [{ to: '/dashboard', label: 'My Documents', icon: FileText }] },
  ],
}

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth()
  if (!user) return null
  const groups = menuGroups[user.role] ?? menuGroups.user

  return (
    <>
      {open && <button className="fixed inset-0 z-30 bg-black/35 md:hidden" onClick={onClose} />}
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="fixed inset-y-16 left-0 z-40 w-64 overflow-y-auto border-r border-border bg-white p-4 md:translate-x-0 dark:border-slate-800 dark:bg-slate-950"
      >
        {groups.map((group) => (
          <div key={group.title} className="mb-6">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.title}</p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to + item.label}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" /> {item.label}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </motion.aside>
    </>
  )
}

export default Sidebar
