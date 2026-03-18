import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'exposition',
  title: 'Exposition',
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
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'mainImage',
      title: 'Image principale',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'dateDebut',
      title: 'Date de début',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dateFin',
      title: 'Date de fin',
      type: 'date',
    }),
    defineField({
      name: 'lieu',
      title: 'Lieu',
      type: 'string',
    }),
    defineField({
      name: 'adresse',
      title: 'Adresse',
      type: 'string',
    }),
    defineField({
      name: 'ville',
      title: 'Ville',
      type: 'string',
    }),
    defineField({
      name: 'codePostal',
      title: 'Code postal',
      type: 'string',
    }),
    defineField({
      name: 'horaires',
      title: 'Horaires d\'ouverture',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'tarif',
      title: 'Tarif d\'entrée',
      type: 'string',
    }),
    defineField({
      name: 'descriptionLieu',
      title: 'Description du lieu',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'lienExterne',
      title: 'Lien externe',
      type: 'url',
    }),
    defineField({
      name: 'oeuvres',
      title: 'Oeuvres exposées',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'oeuvre' }] }],
    }),
  ],
  orderings: [
    {
      title: 'Date début (récent)',
      name: 'dateDebutDesc',
      by: [{ field: 'dateDebut', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      date: 'dateDebut',
      lieu: 'lieu',
    },
    prepare({ title, media, date, lieu }) {
      return {
        title,
        media,
        subtitle: [date, lieu].filter(Boolean).join(' — '),
      }
    },
  },
})
