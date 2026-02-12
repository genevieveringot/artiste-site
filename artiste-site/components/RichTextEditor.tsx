'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded" />
})

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
  }), [])

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link'
  ]

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          min-height: 120px;
          font-size: 16px;
          background: white;
          border-color: var(--border);
        }
        .rich-text-editor .ql-toolbar {
          background: #f7f6ec;
          border-color: var(--border);
        }
        .rich-text-editor .ql-editor {
          min-height: 100px;
          color: #13130d;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #999;
          font-style: normal;
        }
      `}</style>
    </div>
  )
}
