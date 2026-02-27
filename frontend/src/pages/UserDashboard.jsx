import { useEffect, useState } from 'react'
import DocumentForm from '../components/DocumentForm'
import api from '../api/client'

const UserDashboard = () => {
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

  const deleteDocument = async (id) => {
    await api.delete(`/api/documents/${id}`)
    await loadDocuments()
  }

  const selected = documents.find((doc) => doc.id === editingId)

  return (
    <section>
      <h2>User Dashboard</h2>
      <DocumentForm onSubmit={saveDocument} defaultValues={selected} />
      <h3>My Documents</h3>
      <ul>
        {documents.map((doc) => (
          <li key={doc.id}>
            <strong>{doc.title}</strong>
            <button onClick={() => setEditingId(doc.id)} style={{ marginLeft: 8 }}>
              Edit
            </button>
            <button onClick={() => deleteDocument(doc.id)} style={{ marginLeft: 8 }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default UserDashboard
