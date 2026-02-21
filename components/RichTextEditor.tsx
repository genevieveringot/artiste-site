'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { useEffect } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[100px] p-3 focus:outline-none',
      },
    },
  })

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])

  if (!editor) {
    return <div className="h-32 bg-gray-100 animate-pulse rounded" />
  }

  const addLink = () => {
    const url = window.prompt('URL du lien:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    <div className="rich-text-editor border border-[#e8e7dd] rounded overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-[#f7f6ec] border-b border-[#e8e7dd]">
        {/* Text style buttons */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded text-sm font-bold ${editor.isActive('bold') ? 'bg-[#c9a050] text-white' : 'bg-white border border-[#e8e7dd]'}`}
          title="Gras"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded text-sm italic ${editor.isActive('italic') ? 'bg-[#c9a050] text-white' : 'bg-white border border-[#e8e7dd]'}`}
          title="Italique"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded text-sm underline ${editor.isActive('underline') ? 'bg-[#c9a050] text-white' : 'bg-white border border-[#e8e7dd]'}`}
          title="Souligné"
        >
          U
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded text-sm line-through ${editor.isActive('strike') ? 'bg-[#c9a050] text-white' : 'bg-white border border-[#e8e7dd]'}`}
          title="Barré"
        >
          S
        </button>

        <div className="w-px bg-[#e8e7dd] mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded text-xs font-bold ${editor.isActive('heading', { level: 1 }) ? 'bg-[#c9a050] text-white' : 'bg-white border border-[#e8e7dd]'}`}
          title="Titre 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded text-xs font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-[#c9a050] text-white' : 'bg-white border border-[#e8e7dd]'}`}
          title="Titre 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded text-xs font-bold ${editor.isActive('heading', { level: 3 }) ? 'bg-[#c9a050] text-white' : 'bg-white border border-[#e8e7dd]'}`}
          title="Titre 3"
        >
          H3
        </button>

        <div className="w-px bg-[#e8e7dd] mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded text-sm ${editor.isActive('bulletList') ? 'bg-[#c9a050] text-white' : 'bg-white border border-[#e8e7dd]'}`}
          title="Liste à puces"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded text-sm ${editor.isActive('orderedList') ? 'bg-[#c9a050] text-white' : 'bg-white border border-[#e8e7dd]'}`}
          title="Liste numérotée"
        >
          1.
        </button>

        <div className="w-px bg-[#e8e7dd] mx-1" />

        {/* Link */}
        <button
          type="button"
          onClick={addLink}
          className={`p-2 rounded text-sm ${editor.isActive('link') ? 'bg-[#c9a050] text-white' : 'bg-white border border-[#e8e7dd]'}`}
          title="Ajouter un lien"
        >
          🔗
        </button>
        {editor.isActive('link') && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="p-2 rounded text-sm bg-red-100 border border-red-300 text-red-600"
            title="Supprimer le lien"
          >
            ✕
          </button>
        )}

        <div className="w-px bg-[#e8e7dd] mx-1" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded text-sm ${editor.isActive({ textAlign: 'left' }) ? 'bg-[#c9a050] text-white' : 'bg-white border border-[#e8e7dd]'}`}
          title="Aligner à gauche"
        >
          ≡
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded text-sm ${editor.isActive({ textAlign: 'center' }) ? 'bg-[#c9a050] text-white' : 'bg-white border border-[#e8e7dd]'}`}
          title="Centrer"
        >
          ≡
        </button>

        <div className="w-px bg-[#e8e7dd] mx-1" />

        {/* Clear formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="p-2 rounded text-sm bg-white border border-[#e8e7dd]"
          title="Effacer le formatage"
        >
          ✕
        </button>
      </div>

      {/* Editor content */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>

      <style jsx global>{`
        .rich-text-editor .ProseMirror {
          min-height: 100px;
          padding: 12px;
          color: #13130d;
        }
        .rich-text-editor .ProseMirror:focus {
          outline: none;
        }
        .rich-text-editor .ProseMirror p {
          margin: 0.5em 0;
        }
        .rich-text-editor .ProseMirror h1 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        .rich-text-editor .ProseMirror h2 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        .rich-text-editor .ProseMirror h3 {
          font-size: 1.1em;
          font-weight: bold;
          margin: 0.5em 0;
        }
        .rich-text-editor .ProseMirror ul,
        .rich-text-editor .ProseMirror ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }
        .rich-text-editor .ProseMirror a {
          color: #c9a050;
          text-decoration: underline;
        }
        .rich-text-editor .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #999;
          pointer-events: none;
          float: left;
          height: 0;
        }
      `}</style>
    </div>
  )
}
