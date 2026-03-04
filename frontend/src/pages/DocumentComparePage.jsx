import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import api from '../api/client'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Spinner } from '../components/ui/spinner'

const FullDocumentCard = ({ label, document }) => (
  <Card>
    <CardHeader>
      <CardTitle>{label}: {document.title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="mb-3 text-xs text-muted-foreground">Author: {document.author_name}</p>
      <article className="text-sm text-slate-700 dark:text-slate-200 [&_*]:text-inherit" dangerouslySetInnerHTML={{ __html: document.description }} />
    </CardContent>
  </Card>
)

const DocumentComparePage = () => {
  const { sourceId, matchId } = useParams()
  const [searchParams] = useSearchParams()
  const [source, setSource] = useState(null)
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [sourceDoc, matchDoc] = await Promise.all([
          api.get(`/api/public/documents/${sourceId}`),
          api.get(`/api/public/documents/${matchId}`),
        ])
        setSource(sourceDoc.data)
        setMatch(matchDoc.data)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [sourceId, matchId])

  if (loading) {
    return <div className="flex items-center justify-center gap-2 pt-10 text-muted-foreground"><Spinner /> Loading comparison...</div>
  }

  if (!source || !match) {
    return <p className="text-sm text-red-600">Unable to compare selected documents.</p>
  }

  return (
    <section className="space-y-5">
      <Card className="border-indigo-300 dark:border-indigo-900">
        <CardContent className="p-4 text-sm">
          Similarity score: <span className="font-semibold">{searchParams.get('score') ?? 'N/A'}%</span>
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <FullDocumentCard label="Selected Document" document={source} />
        <FullDocumentCard label="Matching Document" document={match} />
      </div>
    </section>
  )
}

export default DocumentComparePage
