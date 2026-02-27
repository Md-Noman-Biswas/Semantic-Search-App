import { motion } from 'framer-motion'
import { FileText, LayoutDashboard, Settings, Shield, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const menuGroups = {
  admin: [
    { title: 'Overview', items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
    { title: 'Management', items: [{ to: '/users', label: 'User Management', icon: Users }] },
    {
      title: 'Account',
      items: [
        { to: '/profile', label: 'Profile', icon: Shield },
        { to: '/settings', label: 'Settings', icon: Settings },
      ],
    },
  ],
  user: [
    { title: 'Overview', items: [{ to: '/dashboard', label: 'My Dashboard', icon: LayoutDashboard }] },
    {
      title: 'Account',
      items: [
        { to: '/profile', label: 'Profile', icon: Shield },
        { to: '/settings', label: 'Settings', icon: Settings },
      ],
    },
  ],
}

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth()
  if (!user) return null
  const groups = menuGroups[user.role] ?? menuGroups.user

  return (
    <>
      {open && <button className="fixed inset-0 z-30 bg-slate-900/40 md:hidden" onClick={onClose} aria-label="Close sidebar" />}

      <aside className={`fixed inset-y-16 left-0 z-40 w-64 border-r border-border bg-white p-4 shadow-sm transition-transform duration-300 dark:bg-slate-950 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-5 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-emerald-50 p-3 dark:border-indigo-900/50 dark:from-slate-900 dark:to-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Workspace</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4" /> Semantic Console
            </p>
          </div>

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
                        `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
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
        </motion.div>
      </aside>
    </>
  )
}

export default Sidebar
