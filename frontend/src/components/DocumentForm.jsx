import { useState } from 'react'

const initialState = { title: '', description: '', summary: '' }

const DocumentForm = ({ onSubmit, defaultValues }) => {
  const [form, setForm] = useState(defaultValues || initialState)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const submit = (event) => {
    event.preventDefault()
    onSubmit(form)
    if (!defaultValues) setForm(initialState)
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <textarea name="summary" placeholder="Summary" value={form.summary} onChange={handleChange} required />
      <button type="submit">Save Document</button>
    </form>
  )
}

export default DocumentForm
