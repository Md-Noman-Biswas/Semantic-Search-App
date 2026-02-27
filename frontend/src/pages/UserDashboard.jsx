import { useEffect, useState } from 'react'
import DocumentForm from '../components/DocumentForm'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import api from '../api/client'

const UserDashboard = () => {
  const [documents, setDocuments] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadDocuments = async () => {
    setLoading(true)
    const { data } = await api.get('/api/documents')
    setDocuments(data)
    setLoading(false)
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  const saveDocument = async (payload) => {
    setSaving(true)
    setError('')
    try {
      if (editingId) {
        await api.put(`/api/documents/${editingId}`, payload)
        setEditingId(null)
      } else {
        await api.post('/api/documents', payload)
      }
      await loadDocuments()
    } catch {
      setError('Unable to save document. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const deleteDocument = async (id) => {
    await api.delete(`/api/documents/${id}`)
    if (editingId === id) setEditingId(null)
    await loadDocuments()
  }

  const selected = documents.find((doc) => doc.id === editingId)

  return (
    <section className="space-y-6">
      <DocumentForm
        onSubmit={saveDocument}
        defaultValues={selected}
        onCancel={() => setEditingId(null)}
        submitLabel={editingId ? 'Update Document' : 'Create Document'}
        loading={saving}
        error={error}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading documents...</p>
        ) : documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents yet. Create your first one.</p>
        ) : (
          documents.map((doc) => (
            <Card key={doc.id} className="animate-fade-in">
              <CardHeader>
                <CardTitle>{doc.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm"><span className="font-medium">Description:</span> {doc.description}</p>
                <p className="text-sm"><span className="font-medium">Summary:</span> {doc.summary}</p>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => setEditingId(doc.id)}>Edit</Button>
                  <Button variant="destructive" onClick={() => deleteDocument(doc.id)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </section>
  )
}

export default UserDashboard
