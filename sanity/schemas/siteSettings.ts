import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Réglages du site',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Nom du site',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Titre du hero',
      type: 'string',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Sous-titre du hero',
      type: 'string',
    }),
    defineField({
      name: 'heroImage',
      title: 'Image du hero',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroCTA',
      title: 'Texte du bouton hero',
      type: 'string',
      initialValue: 'Découvrir mes œuvres',
    }),
    defineField({
      name: 'artistStatement',
      title: "Déclaration de l'artiste",
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'artistPhoto',
      title: "Photo de l'artiste",
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'contactEmail',
      title: 'Email de contact',
      type: 'string',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Téléphone',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Adresse',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'socialLinks',
      title: 'Réseaux sociaux',
      type: 'object',
      fields: [
        { name: 'facebook', title: 'Facebook', type: 'url' },
        { name: 'instagram', title: 'Instagram', type: 'url' },
        { name: 'youtube', title: 'YouTube', type: 'url' },
        { name: 'linkedin', title: 'LinkedIn', type: 'url' },
      ],
    }),
    defineField({
      name: 'footerText',
      title: 'Texte du footer',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Réglages du site' }
    },
  },
})
