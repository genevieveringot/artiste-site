import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactSettings',
  title: 'Réglages Contact',
  type: 'document',
  fields: [
    defineField({
      name: 'recipientEmail',
      title: 'Email destinataire',
      type: 'string',
      description: 'Adresse email qui recevra les messages du formulaire de contact.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subjectPrefix',
      title: 'Préfixe du sujet',
      type: 'string',
      initialValue: '[Artiste Peintre]',
      description: 'Préfixe ajouté au sujet des emails reçus.',
    }),
    defineField({
      name: 'successMessage',
      title: 'Message de succès',
      type: 'text',
      rows: 2,
      initialValue: 'Votre message a bien été envoyé. Je vous répondrai dans les plus brefs délais.',
    }),
    defineField({
      name: 'errorMessage',
      title: 'Message d\'erreur',
      type: 'text',
      rows: 2,
      initialValue: 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.',
    }),
    defineField({
      name: 'autoReply',
      title: 'Réponse automatique',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Activer la réponse automatique',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'subject',
          title: 'Sujet de la réponse automatique',
          type: 'string',
          initialValue: 'Merci pour votre message',
        },
        {
          name: 'message',
          title: 'Contenu de la réponse automatique',
          type: 'text',
          rows: 6,
          description: 'Placeholders disponibles : {name}, {subject}',
          initialValue: 'Bonjour {name},\n\nMerci pour votre message concernant "{subject}". Je vous répondrai dans les plus brefs délais.\n\nCordialement,\nL\'artiste',
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Réglages Contact' }
    },
  },
})
