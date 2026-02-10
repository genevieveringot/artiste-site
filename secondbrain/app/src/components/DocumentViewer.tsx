'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Document } from '@/lib/documents';

interface DocumentViewerProps {
  document: Document;
}

export default function DocumentViewer({ document }: DocumentViewerProps) {
  return (
    <article className="max-w-4xl mx-auto px-6 py-8">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(document.category)}`}>
            {document.category}
          </span>
          <span>•</span>
          <time dateTime={document.createdAt.toISOString()}>
            {document.createdAt.toLocaleDateString('fr-FR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </time>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{document.title}</h1>
      </header>
      
      <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            h1: ({children}) => <h1 className="text-2xl font-bold mb-4 mt-8 first:mt-0">{children}</h1>,
            h2: ({children}) => <h2 className="text-xl font-semibold mb-3 mt-6">{children}</h2>,
            h3: ({children}) => <h3 className="text-lg font-medium mb-2 mt-4">{children}</h3>,
            p: ({children}) => <p className="mb-4 leading-relaxed">{children}</p>,
            ul: ({children}) => <ul className="mb-4 pl-6 list-disc space-y-1">{children}</ul>,
            ol: ({children}) => <ol className="mb-4 pl-6 list-decimal space-y-1">{children}</ol>,
            blockquote: ({children}) => (
              <blockquote className="border-l-4 border-blue-200 pl-4 py-2 mb-4 bg-blue-50 italic">
                {children}
              </blockquote>
            ),
            code: ({children, className}) => {
              const isBlock = className?.includes('language-');
              if (isBlock) {
                return (
                  <code className={`block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto ${className}`}>
                    {children}
                  </code>
                );
              }
              return <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>;
            }
          }}
        >
          {document.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}

function getCategoryColor(category: string): string {
  const colors = {
    concepts: 'bg-purple-100 text-purple-800',
    journal: 'bg-blue-100 text-blue-800', 
    projects: 'bg-green-100 text-green-800',
    insights: 'bg-orange-100 text-orange-800',
    references: 'bg-gray-100 text-gray-800'
  };
  return colors[category as keyof typeof colors] || colors.references;
}