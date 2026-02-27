import { motion } from 'framer-motion'
import { LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto grid min-h-[72vh] max-w-5xl items-center gap-6 py-6 md:grid-cols-2">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="hidden rounded-2xl border border-border/70 bg-white/70 p-8 shadow-sm md:block dark:bg-slate-900/70">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-500">Secure Access</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">Welcome back to your workspace.</h2>
        <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">Sign in to continue managing semantic documents and role-based operations.</p>
      </motion.div>

      <Card className="w-full border-border/80 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <p className="text-sm text-muted-foreground">Use your account credentials to access the dashboard.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required />
            </div>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" required />
            </div>
            {error && <p className="rounded-md bg-red-50 p-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-200">{error}</p>}
            <Button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
