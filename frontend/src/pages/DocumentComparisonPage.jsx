import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import api from '../api/client'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const DocumentComparisonPage = () => {
  const { documentId, matchId } = useParams()
  const [searchParams] = useSearchParams()
  const [sourceDoc, setSourceDoc] = useState(null)
  const [matchedDoc, setMatchedDoc] = useState(null)
  const [failed, setFailed] = useState(false)
  const score = searchParams.get('score')

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const [{ data: source }, { data: matched }] = await Promise.all([
          api.get(`/api/documents/public/${documentId}`),
          api.get(`/api/documents/public/${matchId}`)
        ])
        setSourceDoc(source)
        setMatchedDoc(matched)
      } catch (error) {
        setFailed(true)
      }
    }

    loadDocuments()
  }, [documentId, matchId])

  if (failed) return <p className="text-sm text-muted-foreground">Unable to load comparison.</p>
  if (!sourceDoc || !matchedDoc) return <p className="text-sm text-muted-foreground">Loading comparison...</p>

  return (
    <section className="space-y-6">
      <Card className="border-emerald-200">
        <CardHeader><CardTitle>Document Similarity Comparison</CardTitle></CardHeader>
        <CardContent className="text-sm">
          <p>Similarity Score: <span className="font-semibold text-emerald-600">{score}%</span></p>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Base Document: {sourceDoc.title}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="font-medium">Author:</span> {sourceDoc.author_name}</p>
            <p>{sourceDoc.description}</p>
            <p className="rounded border border-border p-3">{sourceDoc.summary}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Matched Document: {matchedDoc.title}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="font-medium">Author:</span> {matchedDoc.author_name}</p>
            <p>{matchedDoc.description}</p>
            <p className="rounded border border-border p-3">{matchedDoc.summary}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default DocumentComparisonPage
