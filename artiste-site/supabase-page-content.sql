-- Créer la table page_content pour gérer le contenu de chaque page
CREATE TABLE IF NOT EXISTS page_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key text UNIQUE NOT NULL,
  hero_title text,
  hero_subtitle text,
  hero_image text,
  section1_title text,
  section1_text text,
  section2_title text,
  section2_text text,
  section3_title text,
  section3_text text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique
CREATE POLICY "Public read" ON page_content FOR SELECT USING (true);

-- Politique d'écriture (à adapter selon tes besoins)
CREATE POLICY "Public write" ON page_content FOR ALL USING (true);

-- Ajouter les colonnes manquantes à settings si elles n'existent pas
ALTER TABLE settings ADD COLUMN IF NOT EXISTS header_galerie text;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS header_boutique text;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS header_contact text;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS opening_hours text;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS location text;
