-- Table pour les sections de pages
CREATE TABLE IF NOT EXISTS page_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug VARCHAR(100) NOT NULL, -- 'accueil', 'galerie', 'boutique', 'contact', 'expositions'
  section_type VARCHAR(50) NOT NULL, -- 'hero', 'collection', 'awards', 'shop', 'newsletter', 'text', 'gallery', 'cta'
  section_order INT DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  
  -- Contenu texte
  title VARCHAR(500),
  subtitle VARCHAR(500),
  description TEXT,
  button_text VARCHAR(100),
  button_link VARCHAR(255),
  
  -- Images
  image_url TEXT,
  background_image TEXT,
  
  -- Couleurs et style
  background_color VARCHAR(20) DEFAULT '#f7f6ec',
  text_color VARCHAR(20) DEFAULT '#13130d',
  accent_color VARCHAR(20) DEFAULT '#c9a050',
  overlay_opacity INT DEFAULT 30, -- pourcentage
  
  -- Options spécifiques
  show_items_count INT DEFAULT 6, -- pour les sections avec grille
  layout VARCHAR(50) DEFAULT 'default', -- 'default', 'reverse', 'centered'
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherche rapide par page
CREATE INDEX idx_page_sections_page ON page_sections(page_slug, section_order);

-- Insertion des sections par défaut pour la page d'accueil
INSERT INTO page_sections (page_slug, section_type, section_order, title, subtitle, description, button_text, button_link, background_color, text_color) VALUES
-- Hero
('accueil', 'hero', 1, 'Je suis J. Wattebled, peintre impressionniste', 'Paysages et scènes', NULL, 'APPRENDRE ENCORE PLUS', '/galerie', '#000000', '#ffffff'),
-- Collection
('accueil', 'collection', 2, 'Collection', NULL, 'Ma nouvelle collection de peintures comprend plus de 30 œuvres d''art de style impressionniste et est actuellement exposée dans la section d''art moderne du musée.', 'VOIR TOUTE LA COLLECTION', '/galerie', '#f7f6ec', '#13130d'),
-- Awards
('accueil', 'awards', 3, 'Mes récompenses', NULL, 'Certaines de mes peintures ont été récompensées par des prix spéciaux de l''Académie des Beaux-Arts et exposées dans le monde entier.', 'EN SAVOIR PLUS', '/expositions', '#13130d', '#ffffff'),
-- Shop
('accueil', 'shop', 4, 'Ma boutique', NULL, 'Achetez des œuvres originales d''artistes indépendants directement sur le site et soutenez-moi dans ma passion.', 'AFFICHER TOUS LES ARTICLES', '/boutique', '#f7f6ec', '#13130d'),
-- Newsletter
('accueil', 'newsletter', 5, 'Bulletin', 'Recevez par courriel des mises à jour sur nos expositions, événements et plus encore.', NULL, NULL, NULL, '#000000', '#ffffff');

-- Sections pour la page Galerie
INSERT INTO page_sections (page_slug, section_type, section_order, title, subtitle, background_color, text_color) VALUES
('galerie', 'hero', 1, 'Grille de la galerie', 'Maison / Grille de la galerie', '#000000', '#ffffff'),
('galerie', 'gallery', 2, 'Catégories', NULL, '#f7f6ec', '#13130d');

-- Sections pour la page Boutique
INSERT INTO page_sections (page_slug, section_type, section_order, title, subtitle, background_color, text_color) VALUES
('boutique', 'hero', 1, 'Boutique', 'Maison / Boutique', '#000000', '#ffffff'),
('boutique', 'shop', 2, 'Nos œuvres', NULL, '#f7f6ec', '#13130d');

-- Sections pour la page Contact
INSERT INTO page_sections (page_slug, section_type, section_order, title, subtitle, background_color, text_color) VALUES
('contact', 'hero', 1, 'Contacts', 'Maison / Contacts', '#000000', '#ffffff'),
('contact', 'form', 2, 'Contactez-nous', NULL, '#f7f6ec', '#13130d'),
('contact', 'faq', 3, 'Foire aux questions', NULL, '#f7f6ec', '#13130d');

-- Sections pour la page Expositions
INSERT INTO page_sections (page_slug, section_type, section_order, title, subtitle, background_color, text_color) VALUES
('expositions', 'hero', 1, 'Événements à venir', 'Maison / Événements à venir', '#000000', '#ffffff'),
('expositions', 'list', 2, 'Calendrier', NULL, '#f7f6ec', '#13130d');
