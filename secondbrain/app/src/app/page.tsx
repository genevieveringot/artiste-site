import DocumentList from '@/components/DocumentList';
import { getAllDocuments } from '@/lib/documents';

export default function HomePage() {
  const documents = getAllDocuments();

  return (
    <main className="min-h-screen bg-white">
      <DocumentList documents={documents} />
    </main>
  );
}

export const metadata = {
  title: 'Second Brain - Geneviève & Hirondelle',
  description: 'Collection de connaissances et réflexions partagées'
};