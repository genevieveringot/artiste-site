---
title: Gestion des sessions d'hypnose - Cabinet Geneviève
date: 2026-02-01
status: en cours
---

# Gestion des sessions d'hypnose

## Objectif

Système pour enregistrer, transcrire et classer les sessions d'hypnose par patient.

## Structure de classement proposée

```
sessions-hypnose/
├── patients/
│   ├── dupont-marie/
│   │   ├── fiche-patient.md        # Infos générales, objectifs
│   │   ├── 2026-01-15-seance-1.md  # Première séance
│   │   ├── 2026-01-22-seance-2.md
│   │   └── 2026-02-01-seance-3.md
│   ├── martin-jean/
│   │   ├── fiche-patient.md
│   │   └── ...
│   └── ...
└── templates/
    ├── fiche-patient-template.md
    └── seance-template.md
```

## Format fiche patient

```markdown
# [Prénom] - Fiche patient

- **Première consultation** : [date]
- **Motif initial** : [anxiété, arrêt tabac, confiance, etc.]
- **Objectifs** : [liste]
- **Notes importantes** : [allergies, contre-indications, etc.]

## Historique des séances
| Date | Séance | Thème | Notes |
|------|--------|-------|-------|
| ... | ... | ... | ... |
```

## Format séance

```markdown
# Séance [N] - [Date]

**Durée** : [XX min]
**État initial** : [comment arrive le patient]
**Thème travaillé** : [...]

## Transcription
[texte de la séance]

## Observations
- [ce qui a bien fonctionné]
- [points d'attention]

## Suivi
- [ ] Points à reprendre prochaine fois
```

## Workflow

1. **Avant la séance** : Je te rappelle le contexte du patient
2. **Pendant** : Tu enregistres (téléphone/dictaphone)
3. **Après** : Tu m'envoies l'audio, je transcris
4. **Classement** : Je range dans le dossier du patient
5. **Synthèse** : Je peux faire un résumé des points clés

## Confidentialité

⚠️ **Important** : Les données patients sont sensibles
- Stockage local uniquement (pas de cloud)
- Noms pseudonymisés si besoin
- Accès restreint

## Questions

- [ ] Combien de patients environ ?
- [ ] Tu veux que je crée la structure maintenant ?
- [ ] Préfères-tu des initiales ou pseudos pour les noms ?
