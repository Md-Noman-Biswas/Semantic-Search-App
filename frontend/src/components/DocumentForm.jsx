import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import RichTextEditor from './RichTextEditor'
import { Textarea } from './ui/textarea'

const initialState = { title: '', description: '', summary: '' }

const DocumentForm = ({
  onSubmit,
  onGenerateSummary,
  defaultValues,
  onCancel,
  submitLabel = 'Save Document',
  loading = false,
  error = '',
}) => {
  const [form, setForm] = useState(initialState)
  const [generatingSummary, setGeneratingSummary] = useState(false)
  const embedding = defaultValues?.summary_embedding
  const embeddingPreview = Array.isArray(embedding) ? embedding.slice(0, 24).map((value) => Number(value).toFixed(6)).join(', ') : ''

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

  const handleDescriptionChange = (value) => {
    setForm((prev) => ({ ...prev, description: value }))
  }

  const handleSummaryFocus = async () => {
    if (!onGenerateSummary || defaultValues || generatingSummary) return
    if (form.summary.trim()) return
    if (!form.title.trim() || !form.description.trim()) return

    setGeneratingSummary(true)
    try {
      const generated = await onGenerateSummary({ title: form.title, description: form.description })
      if (generated?.trim()) {
        setForm((prev) => ({ ...prev, summary: generated }))
      }
    } finally {
      setGeneratingSummary(false)
    }
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
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Description</p>
            <RichTextEditor value={form.description} onChange={handleDescriptionChange} placeholder="Write a clear document description..." />
          </div>
          <div className="space-y-1">
            <Textarea
              name="summary"
              placeholder="Summary"
              value={form.summary}
              onChange={handleChange}
              onFocus={handleSummaryFocus}
            />
            {!defaultValues && (
              <p className="text-xs text-muted-foreground">
                {generatingSummary ? 'Generating summary…' : 'Tip: focus this field to auto-generate summary from title + description.'}
              </p>
            )}
          </div>

          {defaultValues && (
            <div className="space-y-2 rounded-md border border-border bg-slate-50/60 p-3 dark:bg-slate-900/50">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">Summary Embedding</p>
              {Array.isArray(embedding) && embedding.length > 0 ? (
                <>
                  <p className="text-xs text-muted-foreground">Dimensions: {embedding.length}. Showing first 24 values.</p>
                  <Textarea value={embeddingPreview} rows={4} readOnly className="text-xs" />
                </>
              ) : (
                <p className="text-xs text-muted-foreground">No embedding available for this document yet.</p>
              )}
            </div>
          )}

          {error && <p className="rounded-md bg-red-50 p-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-200">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" disabled={loading || generatingSummary}>{loading ? 'Saving...' : submitLabel}</Button>
            {defaultValues && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default DocumentForm
