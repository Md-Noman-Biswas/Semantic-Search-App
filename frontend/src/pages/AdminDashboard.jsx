import { useEffect, useMemo, useState } from 'react'
import DocumentForm from '../components/DocumentForm'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Spinner } from '../components/ui/spinner'
import { useToast } from '../context/ToastContext'
import api from '../api/client'

const StatCard = ({ label, value }) => (
  <Card className="transition hover:-translate-y-0.5">
    <CardContent className="p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </CardContent>
  </Card>
)

const AdminDashboard = () => {
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

  const selected = documents.find((doc) => doc.id === editingId)
  const totalDocs = documents.length
  const userCount = useMemo(() => new Set(documents.map((d) => d.created_by)).size, [documents])

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Documents" value={totalDocs} />
        <StatCard label="Contributing Users" value={userCount} />
        <StatCard label="In Edit Mode" value={editingId ? 'Yes' : 'No'} />
      </div>

      <DocumentForm
        onSubmit={saveDocument}
        defaultValues={selected}
        onCancel={() => setEditingId(null)}
        submitLabel={editingId ? 'Update Document' : 'Create Document'}
        loading={saving}
        error={error}
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Summary</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 dark:text-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground"><Spinner /> Loading documents...</div>
                    </td>
                  </tr>
                ) : documents.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No documents found.</td></tr>
                ) : (
                  documents.map((doc) => (
                    <tr key={doc.id} className="border-t border-border hover:bg-slate-50/70 dark:hover:bg-slate-900/60">
                      <td className="px-4 py-3 font-medium">{doc.title}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-200"><div className="line-clamp-2 [&_*]:text-inherit" dangerouslySetInnerHTML={{ __html: doc.description }} /></td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-200">{doc.summary}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-200">#{doc.created_by}</td>
                      <td className="px-4 py-3">
                        <Button variant="outline" onClick={() => setEditingId(doc.id)}>Edit</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export default AdminDashboard
