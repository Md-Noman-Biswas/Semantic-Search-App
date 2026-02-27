import { useEffect, useState } from 'react'
import DocumentForm from '../components/DocumentForm'
import api from '../api/client'

const AdminDashboard = () => {
  const [documents, setDocuments] = useState([])
  const [editingId, setEditingId] = useState(null)

  const loadDocuments = async () => {
    const { data } = await api.get('/api/documents')
    setDocuments(data)
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  const saveDocument = async (payload) => {
    if (editingId) {
      await api.put(`/api/documents/${editingId}`, payload)
      setEditingId(null)
    } else {
      await api.post('/api/documents', payload)
    }
    await loadDocuments()
  }

  const selected = documents.find((doc) => doc.id === editingId)

  return (
    <section>
      <h2>Admin Dashboard</h2>
      <DocumentForm
        onSubmit={saveDocument}
        defaultValues={selected}
        onCancel={() => setEditingId(null)}
        submitLabel={editingId ? 'Update Document' : 'Create Document'}
      />
      <h3>All Documents</h3>
      <ul>
        {documents.map((doc) => (
          <li key={doc.id} style={{ marginBottom: 12 }}>
            <strong>{doc.title}</strong> by user #{doc.created_by}
            <button onClick={() => setEditingId(doc.id)} style={{ marginLeft: 8 }}>
              Edit
            </button>
            <p style={{ margin: '4px 0' }}><strong>Description:</strong> {doc.description}</p>
            <p style={{ margin: '4px 0' }}><strong>Summary:</strong> {doc.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default AdminDashboard
