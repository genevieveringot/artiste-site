export const translations = {
  fr: {
    // Navigation
    nav: {
      home: 'MAISON',
      artist: "L'ARTISTE",
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
      artist: 'THE ARTIST',
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

// Dictionnaire de traduction automatique FR -> EN
export const autoTranslate: Record<string, string> = {
  // Titres courants
  "À propos de l'artiste": "About the artist",
  "À propos": "About",
  "Bienvenue": "Welcome",
  "Découvrir": "Discover",
  "Découvrez": "Discover",
  "Ma collection": "My collection",
  "Mes œuvres": "My works",
  "Mes tableaux": "My paintings",
  "Collection": "Collection",
  "Galerie": "Gallery",
  "Contact": "Contact",
  "Contactez-moi": "Contact me",
  "Contactez-nous": "Contact us",
  "Expositions": "Exhibitions",
  "Récompenses": "Awards",
  "Newsletter": "Newsletter",
  "Boutique": "Shop",
  "L'artiste": "The Artist",
  "Artiste": "Artist",
  
  // Boutons
  "Voir la galerie": "View gallery",
  "VOIR LA GALERIE": "VIEW GALLERY",
  "Voir plus": "See more",
  "VOIR PLUS": "SEE MORE",
  "Voir tout": "See all",
  "VOIR TOUT": "SEE ALL",
  "En savoir plus": "Learn more",
  "EN SAVOIR PLUS": "LEARN MORE",
  "Commander": "Order",
  "COMMANDER": "ORDER",
  "Acheter": "Buy",
  "ACHETER": "BUY",
  "Ajouter au panier": "Add to cart",
  "AJOUTER AU PANIER": "ADD TO CART",
  "S'inscrire": "Subscribe",
  "S'INSCRIRE": "SUBSCRIBE",
  "Envoyer": "Send",
  "ENVOYER": "SEND",
  "Soumettre": "Submit",
  "DÉCOUVRIR": "DISCOVER",
  "EXPLORER": "EXPLORE",
  "ME CONTACTER": "CONTACT ME",
  "NOUS CONTACTER": "CONTACT US",
  
  // Phrases courantes
  "Artiste peintre": "Painter",
  "artiste peintre": "painter",
  "Peintre impressionniste": "Impressionist painter",
  "peintre impressionniste": "impressionist painter",
  "Nord de la France": "Northern France",
  "Fait main": "Handmade",
  "Œuvre originale": "Original artwork",
  "Pièce unique": "Unique piece",
  "Livraison gratuite": "Free shipping",
  "Questions fréquentes": "Frequently asked questions",
  "FAQ": "FAQ",
  "Je suis": "I am",
  "je suis": "I am",
  
  // Sections
  "Biographie": "Biography",
  "Mon parcours": "My journey",
  "Mon histoire": "My story",
  "Mes réalisations": "My achievements",
  "Prix et distinctions": "Awards and honors",
  "Horaires d'ouverture": "Opening hours",
  "Nous contacter": "Contact us",
  "Suivez-moi": "Follow me",
  "Restez informé": "Stay informed",
  "Inscrivez-vous à la newsletter": "Subscribe to the newsletter",
  "Dernières œuvres": "Latest works",
  "DERNIÈRES ŒUVRES": "LATEST WORKS",
  "Nouvelles créations": "New creations",
  "NOUVELLES CRÉATIONS": "NEW CREATIONS",
  
  // Descriptions courantes
  "tableau": "painting",
  "tableaux": "paintings",
  "peinture": "painting",
  "peintures": "paintings",
  "huile sur toile": "oil on canvas",
  "acrylique": "acrylic",
  "aquarelle": "watercolor",
  "paysage": "landscape",
  "paysages": "landscapes",
  "marine": "seascape",
  "marines": "seascapes",
  "portrait": "portrait",
  "portraits": "portraits",
  "nature morte": "still life",
  "fleurs": "flowers",
}

// Fonction pour traduire automatiquement un texte FR -> EN
export function translateText(text: string | null | undefined, locale: Locale): string {
  if (!text) return ''
  if (locale === 'fr') return text
  
  // Chercher une traduction exacte
  if (autoTranslate[text]) {
    return autoTranslate[text]
  }
  
  // Chercher une traduction partielle (insensible à la casse)
  const lowerText = text.toLowerCase()
  for (const [fr, en] of Object.entries(autoTranslate)) {
    if (lowerText === fr.toLowerCase()) {
      return en
    }
  }
  
  // Remplacements partiels pour les phrases longues
  let result = text
  for (const [fr, en] of Object.entries(autoTranslate)) {
    const regex = new RegExp(fr, 'gi')
    result = result.replace(regex, en)
  }
  
  return result
}
