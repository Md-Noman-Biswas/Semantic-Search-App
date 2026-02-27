import { useEffect, useState } from 'react'

const initialState = { title: '', description: '', summary: '' }

const DocumentForm = ({ onSubmit, defaultValues, onCancel, submitLabel = 'Save Document' }) => {
  const [form, setForm] = useState(initialState)

  useEffect(() => {
    setForm(defaultValues ? {
      title: defaultValues.title ?? '',
      description: defaultValues.description ?? '',
      summary: defaultValues.summary ?? ''
    } : initialState)
  }, [defaultValues])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const submit = (event) => {
    event.preventDefault()
    onSubmit(form)
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
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit">{submitLabel}</button>
        {defaultValues && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default DocumentForm
