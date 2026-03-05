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
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Unable to register right now')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto grid min-h-[72vh] max-w-5xl items-center gap-6 py-6 md:grid-cols-2">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-emerald-50 p-8 shadow-sm md:block dark:border-indigo-900/60 dark:from-slate-900 dark:to-slate-800">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-300">Create Account</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">Start your semantic workspace.</h2>
        <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">Register to create and search knowledge documents with a clean light/dark experience.</p>
      </motion.div>

      <Card className="w-full border-border/80 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <p className="text-sm text-muted-foreground">Create a new user account.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" name="name" value={form.name} onChange={updateField} placeholder="Full name" required />
            </div>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" type="email" name="email" value={form.email} onChange={updateField} placeholder="Email" required />
            </div>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" type="password" name="password" value={form.password} onChange={updateField} placeholder="Password" required />
            </div>

            {error && <p className="rounded-md bg-red-50 p-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-200">{error}</p>}

            <Button type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</Button>
            <p className="text-sm text-muted-foreground">Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-300">Login</Link></p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default RegisterPage
