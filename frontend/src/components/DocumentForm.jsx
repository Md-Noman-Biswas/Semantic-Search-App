import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

const initialState = { title: '', description: '', summary: '' }

const DocumentForm = ({ onSubmit, defaultValues, onCancel, submitLabel = 'Save Document', loading = false, error = '' }) => {
  const [form, setForm] = useState(initialState)

  useEffect(() => {
    setForm(
      defaultValues
        ? {
            title: defaultValues.title ?? '',
            description: defaultValues.description ?? '',
            summary: defaultValues.summary ?? '',
          }
        : initialState,
    )
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
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{defaultValues ? 'Edit Document' : 'Create Document'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4">
          <Input name="title" placeholder="Document title" value={form.title} onChange={handleChange} required />
          <Textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
          <Textarea name="summary" placeholder="Summary" value={form.summary} onChange={handleChange} required />
          {error && <p className="rounded-md bg-red-50 p-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-200">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : submitLabel}</Button>
            {defaultValues && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default DocumentForm
