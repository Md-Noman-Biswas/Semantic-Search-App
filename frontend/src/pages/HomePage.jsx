import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { useAuth } from '../context/AuthContext'

const features = [
  { icon: Sparkles, title: 'Smarter Search', text: 'Discover relevant content quickly with semantic indexing.' },
  { icon: ShieldCheck, title: 'Role-based Access', text: 'Secure admin and user dashboards with JWT authentication.' },
  { icon: Zap, title: 'Fast Workflows', text: 'Create, edit, and manage documents in one streamlined space.' },
]

const HomePage = () => {
  const { user } = useAuth()

  return (
    <section className="space-y-8">
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-emerald-900 text-white shadow-xl">
      <CardContent className="grid gap-8 p-8 md:grid-cols-2 md:p-10">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200">Modern SaaS Dashboard</p>
          <h1 className="text-3xl font-bold leading-tight md:text-4xl">Semantic search workspace for high-performing teams.</h1>
          <p className="mt-4 text-sm text-indigo-100/90 md:text-base">Organize knowledge, collaborate securely, and accelerate document workflows with a clean and responsive control center.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/dashboard"><Button className="group bg-white text-slate-900 hover:bg-slate-100">Open Dashboard <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5" /></Button></Link>
            {!user && (
              <Link to="/login"><Button variant="outline" className="border-white/70 !bg-transparent text-white hover:!bg-white/10">Sign In</Button></Link>
            )}
          </div>
        </motion.div>
      </CardContent>
    </Card>

    <div className="grid gap-4 md:grid-cols-3">
      {features.map((feature) => {
        const Icon = feature.icon
        return (
          <Card key={feature.title} className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-slate-900 dark:text-slate-100">
                <Icon className="h-4 w-4 text-indigo-500 dark:text-indigo-400" /> {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 dark:text-slate-200">{feature.text}</CardContent>
          </Card>
        )
      })}
    </div>
    </section>
  )
}

export default HomePage
