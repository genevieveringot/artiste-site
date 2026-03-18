import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'items',
      title: 'Liens du menu',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Texte du lien', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'href', title: 'URL', type: 'string', validation: (Rule: any) => Rule.required(), description: 'Ex: /galerie, /contact, ou https://...' },
            {
              name: 'children',
              title: 'Sous-menu',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'label', title: 'Texte', type: 'string', validation: (Rule: any) => Rule.required() },
                    { name: 'href', title: 'URL', type: 'string', validation: (Rule: any) => Rule.required() },
                  ],
                  preview: {
                    select: { title: 'label', subtitle: 'href' },
                  },
                },
              ],
            },
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Navigation du site' }
    },
  },
})
