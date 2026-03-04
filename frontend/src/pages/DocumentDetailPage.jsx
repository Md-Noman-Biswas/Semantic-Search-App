import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api/client'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const makeEmbedding = (doc) => {
  const text = `${doc.title} ${doc.description} ${doc.summary}`.toLowerCase()
  const vector = Array(24).fill(0)
  for (let i = 0; i < text.length; i += 1) vector[i % vector.length] += text.charCodeAt(i) / 255
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + (val * val), 0)) || 1
  return vector.map((value) => value / norm)
}

const cosineSimilarity = (a, b) => a.reduce((sum, value, i) => sum + (value * b[i]), 0)

const DocumentDetailPage = () => {
  const { documentId } = useParams()
  const [document, setDocument] = useState(null)
  const [allDocuments, setAllDocuments] = useState([])
  const [showSimilar, setShowSimilar] = useState(false)
  const [threshold, setThreshold] = useState(70)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [{ data: doc }, { data: docs }] = await Promise.all([
          api.get(`/api/documents/public/${documentId}`),
          api.get('/api/documents/public')
        ])
        setDocument(doc)
        setAllDocuments(docs)
      } catch (error) {
        setNotFound(true)
      }
    }

    loadData()
  }, [documentId])

  const similarDocuments = useMemo(() => {
    if (!document) return []
    const baseVector = makeEmbedding(document)
    return allDocuments
      .filter((doc) => doc.id !== document.id)
      .map((doc) => ({ ...doc, similarity: Math.max(0, cosineSimilarity(baseVector, makeEmbedding(doc))) }))
      .filter((doc) => (doc.similarity * 100) >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5)
  }, [allDocuments, document, threshold])

  if (notFound) return <p className="text-sm text-muted-foreground">Document unavailable.</p>
  if (!document) return <p className="text-sm text-muted-foreground">Loading document details...</p>

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-2xl">{document.title}</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="text-muted-foreground">{document.description}</p>
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
            <p><span className="font-semibold">Author:</span> {document.author_name}</p>
            <p><span className="font-semibold">Created:</span> {new Date(document.created_at).toLocaleString()}</p>
          </div>
          <p className="rounded-lg border border-border p-4 leading-relaxed">{document.summary}</p>
          <Button onClick={() => setShowSimilar((v) => !v)}>{showSimilar ? 'Hide Similar Documents' : 'Find Similar Documents'}</Button>
        </CardContent>
      </Card>

      {showSimilar && (
        <Card className="border-emerald-200">
          <CardHeader><CardTitle className="text-lg">Similarity Search Results</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <label htmlFor="threshold" className="mb-2 block font-medium">Minimum Similarity: {threshold}%</label>
              <input id="threshold" type="range" min="0" max="100" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="w-full accent-emerald-500" />
            </div>
            {similarDocuments.length === 0 ? <p className="text-muted-foreground">No documents found at this similarity threshold.</p> : (
              <div className="space-y-3">
                {similarDocuments.map((doc) => (
                  <Link key={doc.id} to={`/documents/${document.id}/compare/${doc.id}?score=${(doc.similarity * 100).toFixed(2)}`} target="_blank" rel="noreferrer" className="block rounded-lg border border-border p-3 transition hover:border-emerald-400 hover:bg-emerald-50/40 dark:hover:bg-emerald-900/20">
                    <p className="font-semibold">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">Similarity: {(doc.similarity * 100).toFixed(2)}%</p>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </section>
  )
}

export default DocumentDetailPage
