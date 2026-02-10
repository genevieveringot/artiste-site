import { notFound } from 'next/navigation';
import Link from 'next/link';
import DocumentViewer from '@/components/DocumentViewer';
import { getAllDocuments, getDocument } from '@/lib/documents';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function DocumentPage({ params }: PageProps) {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const document = getDocument(slugPath);
  
  if (!document) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour à la collection
            </Link>
            
            <div className="text-sm text-gray-500">
              Second Brain 🧠
            </div>
          </div>
        </div>
      </nav>

      {/* Document */}
      <DocumentViewer document={document} />
    </main>
  );
}

export async function generateStaticParams() {
  const documents = getAllDocuments();
  
  return documents.map(doc => ({
    slug: doc.slug.split('/')
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const slugPath = slug.join('/');
  const document = getDocument(slugPath);
  
  if (!document) {
    return {
      title: 'Document non trouvé'
    };
  }

  return {
    title: `${document.title} - Second Brain`,
    description: document.excerpt
  };
}
