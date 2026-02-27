import { Link, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import UserManagementPage from './pages/UserManagementPage'

const DashboardRouter = () => {
  const { user } = useAuth()
  return user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />
}

const App = () => {
  const { user, logout } = useAuth()

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Link to="/dashboard">Dashboard</Link>
        {user?.role === 'admin' && <Link to="/users">User Management</Link>}
        {user && <button onClick={logout}>Logout</button>}
      </nav>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute role="admin">
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </main>
  )
}

export default App
