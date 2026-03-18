import { groq } from 'next-sanity'

// ── Site Settings ──
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    logo,
    heroTitle,
    heroSubtitle,
    heroImage,
    heroCTA,
    artistStatement,
    artistPhoto,
    contactEmail,
    contactPhone,
    address,
    socialLinks,
    footerText
  }
`

// ── Navigation ──
export const navigationQuery = groq`
  *[_type == "navigation" && _id == "navigation"][0] {
    items[] { label, href }
  }
`

// ── Oeuvres ──
export const allOeuvresQuery = groq`
  *[_type == "oeuvre"] | order(ordre asc, _createdAt desc) {
    _id,
    title,
    slug,
    mainImage,
    annee,
    disponibilite,
    prix,
    "categorie": categorie->{ _id, title, slug },
    "techniques": techniques[]->{ _id, title, slug }
  }
`

export const featuredOeuvresQuery = groq`
  *[_type == "oeuvre"] | order(ordre asc, _createdAt desc) [0...6] {
    _id,
    title,
    slug,
    mainImage,
    annee,
    "techniques": techniques[]->{ _id, title, slug }
  }
`

export const oeuvreBySlugQuery = groq`
  *[_type == "oeuvre" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    mainImage,
    gallery,
    "categorie": categorie->{ _id, title, slug },
    "techniques": techniques[]->{ _id, title, slug },
    largeur,
    hauteur,
    profondeur,
    annee,
    support,
    encadrement,
    prix,
    disponibilite,
    "related": *[_type == "oeuvre" && categorie._ref == ^.categorie._ref && _id != ^._id] | order(ordre asc) [0...3] {
      _id,
      title,
      slug,
      mainImage,
      annee,
      "techniques": techniques[]->{ _id, title, slug }
    }
  }
`

export const oeuvresSlugsQuery = groq`
  *[_type == "oeuvre" && defined(slug.current)].slug.current
`

// ── Catégories ──
export const allCategoriesQuery = groq`
  *[_type == "categorie"] | order(title asc) {
    _id,
    title,
    slug
  }
`

// ── Techniques ──
export const allTechniquesQuery = groq`
  *[_type == "technique"] | order(title asc) {
    _id,
    title,
    slug
  }
`

// ── Expositions ──
export const allExpositionsQuery = groq`
  *[_type == "exposition"] | order(dateDebut desc) {
    _id,
    title,
    slug,
    mainImage,
    dateDebut,
    dateFin,
    lieu,
    adresse,
    ville,
    lienExterne,
    "oeuvres": oeuvres[]->{ _id, title, slug, mainImage }
  }
`

export const upcomingExpositionsQuery = groq`
  *[_type == "exposition" && (dateDebut >= now() || dateFin >= now())] | order(dateDebut asc) [0...3] {
    _id,
    title,
    slug,
    dateDebut,
    dateFin,
    lieu,
    ville,
    "oeuvres": oeuvres[]->{ _id, title, mainImage }
  }
`

export const expositionBySlugQuery = groq`
  *[_type == "exposition" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    mainImage,
    dateDebut,
    dateFin,
    lieu,
    adresse,
    ville,
    lienExterne,
    "oeuvres": oeuvres[]->{ _id, title, slug, mainImage, annee, "techniques": techniques[]->{ title } }
  }
`

export const expositionsSlugsQuery = groq`
  *[_type == "exposition" && defined(slug.current)].slug.current
`
