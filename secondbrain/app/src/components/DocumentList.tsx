'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Document } from '@/lib/documents';

interface DocumentListProps {
  documents: Document[];
}

export default function DocumentList({ documents }: DocumentListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === null || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(documents.map(doc => doc.category)));

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Second Brain 🧠</h1>
        <p className="text-gray-600">Collection de connaissances et réflexions</p>
      </header>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher dans les documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous ({documents.length})
          </button>
          {categories.map(category => {
            const count = documents.filter(doc => doc.category === category).length;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors capitalize ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div className="text-sm text-gray-500 mb-4">
        {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
        {searchQuery && ` correspondant à "${searchQuery}"`}
      </div>

      {/* Document Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDocuments.map(doc => (
          <DocumentCard key={doc.slug} document={doc} />
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Aucun document trouvé
        </div>
      )}
    </div>
  );
}

interface DocumentCardProps {
  document: Document;
}

function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Link href={`/doc/${document.slug}`} className="block">
      <article className="border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-gray-300 transition-all duration-200 h-full">
        <header className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(document.category)}`}>
              {document.category}
            </span>
            <time className="text-xs text-gray-500">
              {document.createdAt.toLocaleDateString('fr-FR')}
            </time>
          </div>
          <h3 className="font-semibold text-gray-900 line-clamp-2">{document.title}</h3>
        </header>
        
        <p className="text-sm text-gray-600 line-clamp-3">{document.excerpt}</p>
        
        <footer className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-blue-600 font-medium">Lire →</span>
        </footer>
      </article>
    </Link>
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