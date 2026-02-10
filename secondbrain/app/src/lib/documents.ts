import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const documentsDirectory = path.join(process.cwd(), '..', 'documents');

export interface Document {
  slug: string;
  title: string;
  content: string;
  data: any;
  category: string;
  createdAt: Date;
  excerpt: string;
}

export function getAllDocuments(): Document[] {
  const categories = ['concepts', 'journal', 'projects', 'insights', 'references'];
  const documents: Document[] = [];

  for (const category of categories) {
    const categoryPath = path.join(documentsDirectory, category);
    
    if (!fs.existsSync(categoryPath)) continue;
    
    const files = getFilesRecursively(categoryPath);
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const relativePath = path.relative(categoryPath, file);
        const slug = relativePath.replace(/\.md$/, '').replace(/\\/g, '/');
        
        const fileContents = fs.readFileSync(file, 'utf8');
        const matterResult = matter(fileContents);
        
        documents.push({
          slug: `${category}/${slug}`,
          title: matterResult.data.title || getTitle(slug, matterResult.content),
          content: matterResult.content,
          data: matterResult.data,
          category,
          createdAt: new Date(matterResult.data.date || fs.statSync(file).mtime),
          excerpt: getExcerpt(matterResult.content)
        });
      }
    }
  }

  return documents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getDocument(slug: string): Document | null {
  const documents = getAllDocuments();
  return documents.find(doc => doc.slug === slug) || null;
}

function getFilesRecursively(dir: string): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      files.push(...getFilesRecursively(itemPath));
    } else {
      files.push(itemPath);
    }
  }
  
  return files;
}

function getTitle(slug: string, content: string): string {
  // Try to extract title from first h1
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1];
  
  // Fallback to filename
  return slug.split('/').pop()?.replace(/[-_]/g, ' ') || slug;
}

function getExcerpt(content: string, length = 200): string {
  const text = content
    .replace(/^#+\s+.+$/gm, '') // Remove headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/`(.+?)`/g, '$1') // Remove code
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
    .trim();
  
  return text.length > length ? text.substring(0, length) + '...' : text;
}