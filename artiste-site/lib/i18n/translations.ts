export const translations = {
  fr: {
    // Navigation
    nav: {
      home: 'MAISON',
      exhibitions: 'EXPOSITIONS',
      collections: 'COLLECTIONS',
      shop: 'BOUTIQUE',
      contact: 'CONTACTS',
      account: 'Mon compte',
      cart: 'Panier',
      login: 'Connexion',
      logout: 'Déconnexion',
      register: 'Créer un compte',
    },
    // Header
    header: {
      openHours: "L'ATELIER EST OUVERT DU LUNDI AU VENDREDI DE 9H À 18H",
      openHoursShort: 'LUN-VEN 9H-18H',
      location: 'Nord de la France',
    },
    // Auth
    auth: {
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      firstName: 'Prénom',
      lastName: 'Nom',
      login: 'Se connecter',
      register: 'Créer mon compte',
      forgotPassword: 'Mot de passe oublié ?',
      noAccount: "Pas encore de compte ?",
      hasAccount: 'Déjà un compte ?',
      orContinueWith: 'Ou continuer avec',
    },
    // Common
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      save: 'Enregistrer',
      cancel: 'Annuler',
      close: 'Fermer',
      seeMore: 'Voir plus',
      seeAll: 'Voir tout',
      addToCart: 'Ajouter au panier',
      buyNow: 'Acheter maintenant',
      price: 'Prix',
      quantity: 'Quantité',
      total: 'Total',
      checkout: 'Commander',
    },
    // Footer
    footer: {
      rights: 'Tous droits réservés',
      privacy: 'Politique de confidentialité',
      terms: "Conditions d'utilisation",
    },
  },
  en: {
    // Navigation
    nav: {
      home: 'HOME',
      exhibitions: 'EXHIBITIONS',
      collections: 'COLLECTIONS',
      shop: 'SHOP',
      contact: 'CONTACT',
      account: 'My account',
      cart: 'Cart',
      login: 'Login',
      logout: 'Logout',
      register: 'Create account',
    },
    // Header
    header: {
      openHours: 'STUDIO OPEN MONDAY TO FRIDAY 9AM TO 6PM',
      openHoursShort: 'MON-FRI 9AM-6PM',
      location: 'Northern France',
    },
    // Auth
    auth: {
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password',
      firstName: 'First name',
      lastName: 'Last name',
      login: 'Sign in',
      register: 'Create account',
      forgotPassword: 'Forgot password?',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      orContinueWith: 'Or continue with',
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      seeMore: 'See more',
      seeAll: 'See all',
      addToCart: 'Add to cart',
      buyNow: 'Buy now',
      price: 'Price',
      quantity: 'Quantity',
      total: 'Total',
      checkout: 'Checkout',
    },
    // Footer
    footer: {
      rights: 'All rights reserved',
      privacy: 'Privacy policy',
      terms: 'Terms of service',
    },
  },
}

export type Locale = 'fr' | 'en'
export type TranslationKeys = typeof translations.fr
