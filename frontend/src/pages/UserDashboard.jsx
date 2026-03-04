import { useEffect, useState } from 'react'
import DocumentForm from '../components/DocumentForm'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Spinner } from '../components/ui/spinner'
import { useToast } from '../context/ToastContext'
import api from '../api/client'

const UserDashboard = () => {
  const [documents, setDocuments] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  const loadDocuments = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/api/documents')
      setDocuments(data)
    } finally {
      setLoading(false)
    }
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
        showToast('Document updated successfully')
      } else {
        await api.post('/api/documents', payload)
        showToast('Document created successfully')
      }
      await loadDocuments()
    } catch {
      setError('Unable to save document. Please try again.')
      showToast('Failed to save document', 'error')
    } finally {
      setSaving(false)
    }
  }

  const deleteDocument = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return
    try {
      await api.delete(`/api/documents/${id}`)
      if (editingId === id) setEditingId(null)
      showToast('Document deleted successfully')
      await loadDocuments()
    } catch {
      showToast('Failed to delete document', 'error')
    }
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
          <div className="col-span-full flex items-center justify-center gap-2 text-muted-foreground"><Spinner /> Loading documents...</div>
        ) : documents.length === 0 ? (
          <Card className="col-span-full border-dashed">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">No documents yet. Create your first one to get started.</CardContent>
          </Card>
        ) : (
          documents.map((doc) => (
            <Card key={doc.id} className="animate-fade-in transition hover:-translate-y-1 hover:shadow-md">
              <CardHeader>
                <CardTitle>{doc.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-slate-700 dark:text-slate-200"><span className="font-medium text-slate-900 dark:text-slate-100">Description:</span> <div className="mt-1 line-clamp-3" dangerouslySetInnerHTML={{ __html: doc.description }} /></div>
                <p className="text-sm text-slate-700 dark:text-slate-200"><span className="font-medium text-slate-900 dark:text-slate-100">Summary:</span> {doc.summary}</p>
                <div className="flex flex-wrap gap-2 pt-2">
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
