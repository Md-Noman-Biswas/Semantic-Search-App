import { motion } from 'framer-motion'
import { CalendarDays, FileText, Search, UserRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Spinner } from '../components/ui/spinner'

const HomePage = () => {
  const [documents, setDocuments] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [query, setQuery] = useState('')
  const [threshold, setThreshold] = useState(15)
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const thresholdValue = useMemo(() => threshold / 100, [threshold])

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
      setSearchResults([])
      setSearchError('')
      setSearching(false)
      return
    }

    const timerId = setTimeout(async () => {
      setSearching(true)
      setSearchError('')
      try {
        const { data } = await api.get('/api/public/documents/search', {
          params: { query: normalizedQuery, threshold: thresholdValue, limit: 100 },
        })
        setSearchResults(data)
      } catch {
        setSearchResults([])
        setSearchError('Unable to run semantic search right now. Please try again.')
      } finally {
        setSearching(false)
      }
    }, 300)

    return () => clearTimeout(timerId)
  }, [query, thresholdValue])

  const isSearchingMode = query.trim().length > 0
  const visibleDocuments = isSearchingMode ? searchResults : documents

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Explore Documents</h1>
        <p className="text-sm text-muted-foreground">Browse all available documents and open any card to view details and discover similar content.</p>
      </div>

      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search documents semantically"
            className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-500 outline-none ring-indigo-300 transition focus:ring-2 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
            <label htmlFor="search-threshold" className="font-medium text-slate-700 dark:text-slate-200">Minimum relevance threshold</label>
            <span>{threshold}%</span>
          </div>
          <input
            id="search-threshold"
            type="range"
            min="0"
            max="100"
            value={threshold}
            onChange={(event) => setThreshold(Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-300 accent-indigo-600 dark:bg-slate-700"
          />
        </div>
      </div>

      {searchError && <p className="text-sm text-red-500">{searchError}</p>}

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card p-12 text-muted-foreground"><Spinner /> Loading documents...</div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {isSearchingMode ? `Showing ${visibleDocuments.length} semantic result(s)` : `Showing ${visibleDocuments.length} document(s)`}
          </p>

          {searching ? (
            <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card p-12 text-muted-foreground"><Spinner /> Searching documents...</div>
          ) : visibleDocuments.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-10 text-center text-muted-foreground">
                {isSearchingMode ? 'No documents match this query and threshold.' : 'No public documents found yet.'}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleDocuments.map((doc, index) => (
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
                          {isSearchingMode && typeof doc.similarity_score === 'number' && (
                            <p>Relevance: {(doc.similarity_score * 100).toFixed(2)}%</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default HomePage
