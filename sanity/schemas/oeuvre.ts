import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'oeuvre',
  title: 'Oeuvre',
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'categorie',
      title: 'Catégorie',
      type: 'reference',
      to: [{ type: 'categorie' }],
    }),
    defineField({
      name: 'techniques',
      title: 'Techniques',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'technique' }] }],
    }),
    defineField({
      name: 'largeur',
      title: 'Largeur (cm)',
      type: 'number',
    }),
    defineField({
      name: 'hauteur',
      title: 'Hauteur (cm)',
      type: 'number',
    }),
    defineField({
      name: 'profondeur',
      title: 'Profondeur (cm)',
      type: 'number',
    }),
    defineField({
      name: 'annee',
      title: 'Année',
      type: 'number',
    }),
    defineField({
      name: 'support',
      title: 'Support',
      type: 'string',
    }),
    defineField({
      name: 'encadrement',
      title: 'Encadrement',
      type: 'string',
      options: {
        list: [
          { title: 'Avec cadre', value: 'avec_cadre' },
          { title: 'Sans cadre', value: 'sans_cadre' },
          { title: 'Non applicable', value: 'non_applicable' },
        ],
      },
    }),
    defineField({
      name: 'prix',
      title: 'Prix (€)',
      type: 'number',
    }),
    defineField({
      name: 'disponibilite',
      title: 'Disponibilité',
      type: 'string',
      options: {
        list: [
          { title: 'Disponible', value: 'disponible' },
          { title: 'Vendu', value: 'vendu' },
          { title: 'Sur demande', value: 'sur_demande' },
          { title: 'Réservé', value: 'reserve' },
        ],
      },
      initialValue: 'disponible',
    }),
    defineField({
      name: 'ordre',
      title: 'Ordre',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Ordre',
      name: 'ordreAsc',
      by: [{ field: 'ordre', direction: 'asc' }],
    },
    {
      title: 'Date (récent)',
      name: 'anneeDesc',
      by: [{ field: 'annee', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      subtitle: 'annee',
    },
    prepare({ title, media, subtitle }) {
      return {
        title,
        media,
        subtitle: subtitle ? `${subtitle}` : '',
      }
    },
  },
})
