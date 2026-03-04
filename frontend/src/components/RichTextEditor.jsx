import { Bold, Italic, List, ListOrdered, Quote, Redo2, Undo2 } from 'lucide-react'
import { useRef } from 'react'
import { Button } from './ui/button'

const toolbarButtons = [
  { icon: Bold, command: 'bold', label: 'Bold' },
  { icon: Italic, command: 'italic', label: 'Italic' },
  { icon: List, command: 'insertUnorderedList', label: 'Bullet list' },
  { icon: ListOrdered, command: 'insertOrderedList', label: 'Numbered list' },
  { icon: Quote, command: 'formatBlock', value: 'blockquote', label: 'Quote' },
]

const RichTextEditor = ({ value, onChange, placeholder = 'Write here...' }) => {
  const editorRef = useRef(null)

  const exec = (command, commandValue) => {
    editorRef.current?.focus()
    document.execCommand(command, false, commandValue)
    onChange(editorRef.current?.innerHTML ?? '')
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-slate-50 p-2 dark:bg-slate-900/60">
        <Button type="button" size="sm" variant="ghost" onClick={() => exec('undo')} title="Undo"><Undo2 className="h-4 w-4" /></Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => exec('redo')} title="Redo"><Redo2 className="h-4 w-4" /></Button>
        <div className="mx-1 h-5 w-px bg-border" />
        {toolbarButtons.map(({ icon: Icon, command, value: commandValue, label }) => (
          <Button key={command} type="button" size="sm" variant="ghost" onClick={() => exec(command, commandValue)} title={label}>
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="min-h-40 w-full p-3 text-sm outline-none prose prose-sm max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
        data-placeholder={placeholder}
      />
    </div>
  )
}

export default RichTextEditor
