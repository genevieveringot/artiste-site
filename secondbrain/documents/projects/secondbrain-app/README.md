# Second Brain App

## Vision

Interface web moderne pour naviguer et explorer les documents du 2nd brain, inspirée d'Obsidian et Linear.

## Stack Technique

- **NextJS 15** avec App Router
- **TypeScript** pour la type safety
- **Tailwind CSS** pour le styling
- **React Markdown** pour le rendu des documents
- **Fuzzy search** pour la recherche

## Fonctionnalités

### MVP ✅
- [x] Liste des documents avec preview
- [x] Viewer markdown avec syntax highlighting  
- [x] Navigation entre documents
- [x] Recherche et filtres par catégorie
- [x] Design responsive moderne
- [x] Lecture automatique des .md depuis `/documents`

### Phase 2
- [ ] Graph view des connexions
- [ ] Tags et filtres
- [ ] Mode dark/light
- [ ] Recherche sémantique

### Phase 3
- [ ] Édition inline
- [ ] Collaboration temps réel
- [ ] Export vers différents formats
- [ ] API pour intégrations

## Structure de fichiers

```
app/
├── components/
│   ├── DocumentViewer.tsx
│   ├── DocumentList.tsx
│   ├── Sidebar.tsx
│   └── SearchBar.tsx
├── lib/
│   ├── documents.ts
│   └── markdown.ts
└── pages/
    ├── page.tsx
    └── [...slug]/page.tsx
```

## Architecture

- **Static file reading** : Lecture des .md depuis `/documents`
- **Client-side search** : Index côté client pour la rapidité
- **Responsive design** : Mobile-first avec layout adaptatif
- **Performance** : Code splitting et lazy loading