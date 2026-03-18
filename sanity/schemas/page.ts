import { defineField, defineType } from 'sanity'
import HeroOverlayInput from '../components/HeroOverlayInput'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Image principale',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroOverlay',
      title: 'Opacité ombre hero',
      type: 'number',
      description: 'Contrôle l\'obscurcissement de l\'image hero (0 = pas d\'ombre, 100 = noir total). Par défaut : 40.',
      validation: (Rule) => Rule.min(0).max(100),
      initialValue: 40,
      components: {
        input: HeroOverlayInput,
      },
    }),
    defineField({
      name: 'artistPhoto',
      title: 'Photo (côté gauche)',
      type: 'image',
      options: { hotspot: true },
      description: 'Photo affichée à gauche du texte (ex: photo de l\'artiste).',
    }),
    defineField({
      name: 'content',
      title: 'Contenu',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Texte alternatif', type: 'string' },
            { name: 'caption', title: 'Légende', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'seoDescription',
      title: 'Description SEO',
      type: 'text',
      rows: 2,
      description: 'Description pour les moteurs de recherche (max 160 caractères).',
      validation: (Rule) => Rule.max(160),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
    },
  },
})
