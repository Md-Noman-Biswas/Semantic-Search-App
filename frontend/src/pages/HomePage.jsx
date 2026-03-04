import { motion } from 'framer-motion'
import { CalendarDays, FileText, Search, UserRound } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Spinner } from '../components/ui/spinner'

const HomePage = () => {
  const [documents, setDocuments] = useState([])
  const [semanticResults, setSemanticResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const debounceRef = useRef(null)

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

  useEffect(() => {
    const normalizedQuery = query.trim()
    if (!normalizedQuery) {
      setSemanticResults([])
      setSearching(false)
      return
    }

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current)
    }

    debounceRef.current = window.setTimeout(async () => {
      setSearching(true)
      try {
        const { data } = await api.get('/api/public/documents/search', { params: { q: normalizedQuery, limit: 12 } })
        setSemanticResults(data)
      } catch {
        setSemanticResults([])
      } finally {
        setSearching(false)
      }
    }, 400)

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current)
      }
    }
  }, [query])

  const filteredDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return documents

    if (semanticResults.length > 0) {
      return semanticResults
    }

    return documents.filter((doc) => {
      const searchable = `${doc.title} ${doc.author_name} ${doc.summary} ${doc.description}`.toLowerCase()
      return searchable.includes(normalizedQuery)
    })
  }, [documents, query, semanticResults])

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Explore Documents</h1>
        <p className="text-sm text-muted-foreground">Browse all available documents and open any card to view details and discover similar content.</p>
      </div>

      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title, author, summary, or document content..."
          className="pl-9"
        />
      </div>

      {query.trim() && (
        <p className="text-xs text-muted-foreground">
          {searching ? 'Searching semantically...' : `Showing ${filteredDocuments.length} semantic result(s)`}
        </p>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card p-12 text-muted-foreground"><Spinner /> Loading documents...</div>
      ) : documents.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-10 text-center text-muted-foreground">No public documents found yet.</CardContent>
        </Card>
      ) : filteredDocuments.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-10 text-center text-muted-foreground">No documents match your search. Try a different keyword.</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredDocuments.map((doc, index) => (
            <motion.div key={doc.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}>
              <Link to={`/documents/${doc.id}`} className="group block h-full">
                <Card className="h-full border-0 bg-gradient-to-br from-white to-slate-50 shadow-md ring-1 ring-slate-200/90 transition hover:-translate-y-1 hover:shadow-xl dark:from-slate-900 dark:to-slate-950 dark:ring-slate-800">
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-300">{doc.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
                    <div className="line-clamp-3 [&_*]:text-inherit" dangerouslySetInnerHTML={{ __html: doc.description }} />
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p className="flex items-center gap-2"><UserRound className="h-3.5 w-3.5" /> {doc.author_name}</p>
                      <p className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5" /> {new Date(doc.created_at).toLocaleDateString()}</p>
                      <p className="flex items-center gap-2"><FileText className="h-3.5 w-3.5" /> Open detail view</p>
                      {'similarity_score' in doc && <p>Relevance: {(doc.similarity_score * 100).toFixed(2)}%</p>}
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
