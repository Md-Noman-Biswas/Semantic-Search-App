import { motion } from 'framer-motion'
import { LockKeyhole, Mail, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      navigate('/dashboard')
    } catch (requestError) {
      setError(requestError?.response?.data?.detail || 'Unable to register. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto grid min-h-[72vh] max-w-5xl items-center gap-6 py-6 md:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden rounded-2xl border border-border/70 bg-white/70 p-8 shadow-sm md:block dark:bg-slate-900/70"
      >
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-300">Create account</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">Join Semantic Search Workspace.</h2>
        <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">Register as a user to create documents, manage your content, and use semantic search features.</p>
      </motion.div>

      <Card className="w-full border-border/80 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <p className="text-sm text-muted-foreground">Create your account to start using the platform.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" name="name" value={form.name} onChange={handleChange} placeholder="Full name" required />
            </div>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
            </div>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" minLength={6} required />
            </div>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm password" minLength={6} required />
            </div>
            {error && <p className="rounded-md bg-red-50 p-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-200">{error}</p>}
            <Button type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200">Sign in</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterPage
