import { CalendarDays, Percent, UserRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api/client'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Spinner } from '../components/ui/spinner'

const DocumentDetailPage = () => {
  const { id } = useParams()
  const [document, setDocument] = useState(null)
  const [similar, setSimilar] = useState([])
  const [threshold, setThreshold] = useState(65)
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const thresholdValue = useMemo(() => threshold / 100, [threshold])

  useEffect(() => {
    const loadDocument = async () => {
      setLoading(true)
      try {
        const { data } = await api.get(`/api/public/documents/${id}`)
        setDocument(data)
      } finally {
        setLoading(false)
      }
    }
    loadDocument()
  }, [id])

  const findSimilar = async () => {
    setSearching(true)
    try {
      const { data } = await api.get(`/api/public/documents/${id}/similar`, { params: { threshold: thresholdValue, limit: 5 } })
      setSimilar(data)
    } finally {
      setSearching(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center gap-2 pt-10 text-muted-foreground"><Spinner /> Loading document...</div>
  }

  if (!document) {
    return <p className="text-sm text-red-500">Unable to load document.</p>
  }

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{document.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
            <p className="flex items-center gap-2"><UserRound className="h-4 w-4" /> {document.author_name}</p>
            <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {new Date(document.created_at).toLocaleString()}</p>
            <p className="flex items-center gap-2"><Percent className="h-4 w-4" /> Similarity threshold: {threshold}%</p>
          </div>

          <article className="rounded-lg border border-border bg-slate-50/50 p-4 text-sm dark:bg-slate-900/50" dangerouslySetInnerHTML={{ __html: document.description }} />

          <div className="space-y-2">
            <label htmlFor="similarity-slider" className="block text-sm font-medium">Set similarity percentage</label>
            <input
              id="similarity-slider"
              type="range"
              min="1"
              max="100"
              value={threshold}
              onChange={(event) => setThreshold(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600"
            />
          </div>

          <Button onClick={findSimilar} disabled={searching}>{searching ? 'Searching...' : 'Find Similar Documents'}</Button>
        </CardContent>
      </Card>

      {similar.length > 0 && (
        <Card className="border-indigo-200 dark:border-indigo-900">
          <CardHeader>
            <CardTitle>Top Similar Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {similar.map((item) => (
                <div key={item.id} className="rounded-lg border border-border p-3">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">Similarity: {(item.similarity_score * 100).toFixed(2)}%</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Link to={`/documents/${item.id}`}><Button size="sm" variant="outline">Open Detail</Button></Link>
                    <Button
                      size="sm"
                      onClick={() => window.open(`/compare/${document.id}/${item.id}?score=${(item.similarity_score * 100).toFixed(2)}`, '_blank', 'noopener,noreferrer')}
                    >
                      Open Matched View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  )
}

export default DocumentDetailPage
