-- Ajouter le champ hero_overlay_opacity dans settings
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS hero_overlay_opacity INTEGER DEFAULT 40;

-- Commentaire
COMMENT ON COLUMN settings.hero_overlay_opacity IS 'Opacité du filtre sombre sur l''image hero (0-100)';
