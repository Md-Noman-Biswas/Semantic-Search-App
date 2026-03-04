import { motion } from 'framer-motion'
import { CalendarDays, FileText, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Spinner } from '../components/ui/spinner'

const HomePage = () => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPublicDocuments = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/api/public/documents')
        setDocuments(data)
      } finally {
        setLoading(false)
      }
    }

    loadPublicDocuments()
  }, [])

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Explore Documents</h1>
        <p className="text-sm text-muted-foreground">Browse all available documents and open any card to view details and discover similar content.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card p-12 text-muted-foreground"><Spinner /> Loading documents...</div>
      ) : documents.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-10 text-center text-muted-foreground">No public documents found yet.</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {documents.map((doc, index) => (
            <motion.div key={doc.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
              <Link to={`/documents/${doc.id}`} className="group block h-full">
                <Card className="h-full border-0 bg-gradient-to-br from-white to-slate-50 shadow-md ring-1 ring-slate-200/90 transition hover:-translate-y-1 hover:shadow-xl dark:from-slate-900 dark:to-slate-950 dark:ring-slate-800">
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-300">{doc.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
                    <div className="line-clamp-3" dangerouslySetInnerHTML={{ __html: doc.description }} />
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p className="flex items-center gap-2"><UserRound className="h-3.5 w-3.5" /> {doc.author_name}</p>
                      <p className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5" /> {new Date(doc.created_at).toLocaleDateString()}</p>
                      <p className="flex items-center gap-2"><FileText className="h-3.5 w-3.5" /> Open detail view</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}

export default HomePage
