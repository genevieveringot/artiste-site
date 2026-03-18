'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'artiste-peintre',
  title: 'Artiste Peintre',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenu')
          .items([
            // Collections principales
            S.documentTypeListItem('oeuvre').title('Oeuvres'),
            S.documentTypeListItem('exposition').title('Expositions'),
            S.documentTypeListItem('page').title('Pages'),
            S.divider(),
            S.documentTypeListItem('categorie').title('Catégories'),
            S.documentTypeListItem('technique').title('Techniques'),
            S.divider(),
            // Demandes & Utilisateurs
            S.documentTypeListItem('inquiry').title('Demandes'),
            S.documentTypeListItem('user').title('Utilisateurs'),
            S.divider(),
            // Singletons — Réglages
            S.listItem()
              .title('Navigation')
              .id('navigation')
              .child(
                S.document()
                  .schemaType('navigation')
                  .documentId('navigation')
              ),
            S.listItem()
              .title('Réglages du site')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.listItem()
              .title('Réglages Contact')
              .id('contactSettings')
              .child(
                S.document()
                  .schemaType('contactSettings')
                  .documentId('contactSettings')
              ),
            S.listItem()
              .title('Réglages Paiement')
              .id('paiementSettings')
              .child(
                S.document()
                  .schemaType('paiementSettings')
                  .documentId('paiementSettings')
              ),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
})
