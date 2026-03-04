import { ArrowRight, FileText } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const HomePage = () => {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const { data } = await api.get('/api/documents/public')
        setDocuments(data)
      } finally {
        setLoading(false)
      }
    }

    loadDocuments()
  }, [])

  return (
    <section className="space-y-6">
      <Card className="border-none bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl">Explore Semantic Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="max-w-2xl text-sm text-emerald-50">Discover all published documents and open any record to review details, metadata, and similarity results.</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading && <p className="text-sm text-muted-foreground">Loading documents...</p>}
        {!loading && documents.length === 0 && (
          <Card><CardContent className="py-6 text-sm text-muted-foreground">No documents available yet.</CardContent></Card>
        )}

        {documents.map((doc) => (
          <Link key={doc.id} to={`/documents/${doc.id}`} className="group">
            <Card className="h-full border border-slate-200/70 bg-white/80 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900/60">
              <CardHeader>
                <CardTitle className="line-clamp-2 flex items-start justify-between gap-2 text-lg">
                  <span>{doc.title}</span>
                  <FileText className="h-5 w-5 text-emerald-500" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="line-clamp-3 text-muted-foreground">{doc.description}</p>
                <div className="text-xs text-muted-foreground">
                  <p>Author: <span className="font-medium text-foreground">{doc.author_name}</span></p>
                  <p>Created: {new Date(doc.created_at).toLocaleDateString()}</p>
                </div>
                <p className="inline-flex items-center gap-1 font-medium text-emerald-600">
                  Open details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default HomePage
