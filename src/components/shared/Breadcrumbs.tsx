import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  light?: boolean
}

export default function Breadcrumbs({ items, light }: BreadcrumbsProps) {
  return (
    <nav className={`breadcrumbs${light ? ' breadcrumbs--light' : ''}`} aria-label="Fil d'Ariane">
      <Link href="/">Accueil</Link>
      {items.map((item, i) => (
        <span key={i}>
          <span className="breadcrumbs__separator" aria-hidden="true">/</span>
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span className="breadcrumbs__current">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
