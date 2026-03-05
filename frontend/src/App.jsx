import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import Layout from './layout/Layout'
import AdminDashboard from './pages/AdminDashboard'
import DocumentComparePage from './pages/DocumentComparePage'
import DocumentDetailPage from './pages/DocumentDetailPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import UserDashboard from './pages/UserDashboard'
import UserManagementPage from './pages/UserManagementPage'

const DashboardRouter = () => {
  const { user } = useAuth()
  return user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />
}

const App = () => {
  const { user } = useAuth()

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/documents/:id" element={<DocumentDetailPage />} />
        <Route path="/compare/:sourceId/:matchId" element={<DocumentComparePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute role="admin"><UserManagementPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
      </Routes>
    </Layout>
  )
}

export default App
