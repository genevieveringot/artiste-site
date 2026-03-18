import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'inquiry',
  title: 'Demande',
  type: 'document',
  fields: [
    defineField({
      name: 'user',
      title: 'Utilisateur',
      type: 'reference',
      to: [{ type: 'user' }],
    }),
    defineField({
      name: 'oeuvre',
      title: 'Oeuvre concernée',
      type: 'reference',
      to: [{ type: 'oeuvre' }],
    }),
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Téléphone',
      type: 'string',
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
    }),
    defineField({
      name: 'status',
      title: 'Statut',
      type: 'string',
      options: {
        list: [
          { title: 'Nouvelle', value: 'new' },
          { title: 'En cours', value: 'in_progress' },
          { title: 'Répondue', value: 'replied' },
          { title: 'Terminée', value: 'terminated' },
        ],
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'createdAt',
      title: 'Date',
      type: 'datetime',
    }),
  ],
  orderings: [
    {
      title: 'Date (récent)',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'status',
      oeuvre: 'oeuvre.title',
    },
    prepare({ title, subtitle, oeuvre }) {
      const statusLabels: Record<string, string> = {
        new: 'Nouvelle',
        in_progress: 'En cours',
        replied: 'Répondue',
        terminated: 'Terminée',
      }
      return {
        title: title || 'Sans nom',
        subtitle: `${statusLabels[subtitle] || subtitle} ${oeuvre ? `— ${oeuvre}` : ''}`,
      }
    },
  },
})
