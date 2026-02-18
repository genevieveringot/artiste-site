# Portfolio Artiste Peintre

Un site portfolio élégant et moderne pour artiste peintre, construit avec Next.js 14, Tailwind CSS et Supabase.

![Portfolio Preview](./preview.png)

## ✨ Fonctionnalités

### Pages Publiques
- **Accueil** - Hero section avec présentation de l'artiste
- **Galerie** - Affichage des tableaux avec filtres (catégorie, disponibilité)
- **Expositions** - Timeline des expositions passées et à venir
- **Contact** - Formulaire de contact avec informations

### Administration (/admin)
- Authentification par mot de passe
- Gestion complète des tableaux (CRUD)
- Gestion des expositions (CRUD)
- Upload d'images vers Supabase Storage

## 🛠 Technologies

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Icons**: Lucide React
- **Language**: TypeScript

## 🚀 Installation

### 1. Cloner et installer

```bash
cd artiste-site
npm install
```

### 2. Configuration Supabase

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Récupérez votre URL et clé anon dans Settings > API

### 3. Créer les tables

Dans l'éditeur SQL de Supabase, exécutez :

```sql
-- Table des tableaux
CREATE TABLE paintings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  price DECIMAL(10,2),
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'other',
  available BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des expositions
CREATE TABLE exhibitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  image_url TEXT,
  is_upcoming BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX idx_paintings_category ON paintings(category);
CREATE INDEX idx_paintings_available ON paintings(available);
CREATE INDEX idx_exhibitions_start_date ON exhibitions(start_date);

-- Activer Row Level Security (optionnel mais recommandé)
ALTER TABLE paintings ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitions ENABLE ROW LEVEL SECURITY;

-- Policies pour lecture publique
CREATE POLICY "Paintings are viewable by everyone" ON paintings
  FOR SELECT USING (true);

CREATE POLICY "Exhibitions are viewable by everyone" ON exhibitions
  FOR SELECT USING (true);

-- Policies pour modification (utilisez votre clé service_role en backend)
CREATE POLICY "Enable insert for anon" ON paintings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for anon" ON paintings
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for anon" ON paintings
  FOR DELETE USING (true);

CREATE POLICY "Enable insert for anon" ON exhibitions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for anon" ON exhibitions
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for anon" ON exhibitions
  FOR DELETE USING (true);
```

### 4. Créer le bucket Storage

1. Allez dans Storage dans votre dashboard Supabase
2. Créez un bucket nommé `artiste-images`
3. Rendez-le public dans les paramètres du bucket
4. Ajoutez cette policy pour permettre l'upload :

```sql
-- Policy pour upload public
CREATE POLICY "Enable storage for everyone" ON storage.objects
  FOR ALL USING (bucket_id = 'artiste-images');
```

### 5. Variables d'environnement

Copiez `.env.example` vers `.env.local` :

```bash
cp .env.example .env.local
```

Remplissez avec vos valeurs :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
ADMIN_PASSWORD=votre-mot-de-passe-admin
```

### 6. Lancer le projet

```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
artiste-site/
├── app/
│   ├── admin/           # Pages d'administration
│   │   ├── paintings/   # Gestion des tableaux
│   │   ├── exhibitions/ # Gestion des expositions
│   │   └── login/       # Page de connexion
│   ├── api/             # Routes API
│   ├── gallery/         # Page galerie
│   ├── exhibitions/     # Page expositions
│   ├── contact/         # Page contact
│   └── page.tsx         # Page d'accueil
├── components/
│   ├── ui/              # Composants UI réutilisables
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── PaintingCard.tsx
│   └── ExhibitionCard.tsx
├── lib/
│   ├── supabase.ts      # Client Supabase
│   └── utils.ts         # Fonctions utilitaires
└── types/
    └── database.ts      # Types TypeScript
```

## 🎨 Personnalisation

### Couleurs

Les couleurs sont définies dans `tailwind.config.ts` :

```ts
colors: {
  background: '#0a0a0a',    // Fond principal
  surface: '#141414',        // Cartes, sections
  accent: '#c9a962',         // Couleur d'accent (or)
  // ...
}
```

### Contenu

Modifiez le contenu directement dans les pages :
- `app/page.tsx` - Textes de la page d'accueil
- `components/Footer.tsx` - Informations de contact

## 🔒 Sécurité

- L'authentification admin utilise un mot de passe simple stocké côté serveur
- En production, envisagez d'utiliser Supabase Auth pour une meilleure sécurité
- Les policies RLS protègent vos données

## 📦 Déploiement

### Vercel (recommandé)

1. Push sur GitHub
2. Importez dans Vercel
3. Ajoutez les variables d'environnement
4. Déployez !

### Autres plateformes

Le projet est compatible avec toute plateforme supportant Next.js :
- Netlify
- Railway
- DigitalOcean App Platform

## 📝 License

MIT - Utilisez librement pour vos projets personnels ou commerciaux.

---

Créé avec ❤️ pour les artistes
