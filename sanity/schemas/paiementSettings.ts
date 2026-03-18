import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'paiementSettings',
  title: 'Réglages Paiement',
  type: 'document',
  fields: [
    defineField({
      name: 'mode',
      title: 'Mode de paiement',
      type: 'string',
      options: {
        list: [
          { title: 'Formulaire de demande (pas de paiement en ligne)', value: 'inquiry' },
          { title: 'Stripe (carte bancaire)', value: 'stripe' },
          { title: 'PayPal', value: 'paypal' },
        ],
        layout: 'radio',
      },
      initialValue: 'inquiry',
    }),
    defineField({
      name: 'currency',
      title: 'Devise',
      type: 'string',
      options: {
        list: [
          { title: 'Euro (€)', value: 'EUR' },
          { title: 'Dollar ($)', value: 'USD' },
          { title: 'Livre Sterling (£)', value: 'GBP' },
        ],
      },
      initialValue: 'EUR',
    }),
    defineField({
      name: 'inquiryEmail',
      title: 'Email pour les demandes',
      type: 'string',
      description: 'Adresse email qui recevra les demandes d\'achat/renseignement.',
    }),
    defineField({
      name: 'inquiryConfirmation',
      title: 'Message de confirmation (demande)',
      type: 'text',
      rows: 3,
      initialValue: 'Votre demande a bien été envoyée. Vous recevrez une réponse rapidement.',
    }),
    defineField({
      name: 'stripe',
      title: 'Configuration Stripe',
      type: 'object',
      fields: [
        {
          name: 'publicKey',
          title: 'Clé publique Stripe',
          type: 'string',
          description: 'Commence par pk_test_ ou pk_live_',
        },
        {
          name: 'secretKey',
          title: 'Clé secrète Stripe',
          type: 'string',
          description: 'Commence par sk_test_ ou sk_live_. Ne jamais exposer côté client.',
        },
        {
          name: 'testMode',
          title: 'Mode test',
          type: 'boolean',
          initialValue: true,
        },
      ],
    }),
    defineField({
      name: 'paypal',
      title: 'Configuration PayPal',
      type: 'object',
      fields: [
        {
          name: 'email',
          title: 'Email PayPal',
          type: 'string',
        },
        {
          name: 'sandbox',
          title: 'Mode sandbox (test)',
          type: 'boolean',
          initialValue: true,
        },
      ],
    }),
    defineField({
      name: 'cgvPage',
      title: 'Lien vers les CGV',
      type: 'url',
      description: 'URL de la page Conditions Générales de Vente.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Réglages Paiement' }
    },
  },
})
