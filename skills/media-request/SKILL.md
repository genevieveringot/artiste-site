---
name: media-request
description: Add movies or series to the media server. Use when user asks to add, download, or request a movie or TV show. Handles lookup, availability check, user confirmation, and Radarr/Sonarr integration.
---

# Media Request

Add movies or series to the home media server via Radarr/Sonarr.

## Workflow

### 1. Identify the content

Search the web to understand what the user is asking for:
- Title, year, type (movie vs series)
- Brief synopsis to confirm it's the right content
- Original language, notable cast/director

```bash
# Use web_search tool
web_search "TITLE movie/series YEAR"
```

### 2. Determine service

- **Movie** → Radarr (port 7878)
- **Series/TV Show** → Sonarr (port 8989)

### 3. Search in the service

```bash
# Radarr - search by term
curl -s "http://localhost:7878/api/v3/movie/lookup?term=TITLE" \
  -H "X-Api-Key: aa267f3d5f3841dbad4ddbb792f12eb8" | jq '.[0:5] | .[] | {title, year, tmdbId, overview: .overview[0:100]}'

# Sonarr - search by term
curl -s "http://localhost:8989/api/v3/series/lookup?term=TITLE" \
  -H "X-Api-Key: 2f61c809f0064945bf5d05bdfe44af5a" | jq '.[0:5] | .[] | {title, year, tvdbId, overview: .overview[0:100]}'
```

### 4. Check if already in library

```bash
# Radarr - check existing
curl -s "http://localhost:7878/api/v3/movie" \
  -H "X-Api-Key: aa267f3d5f3841dbad4ddbb792f12eb8" | jq '.[] | select(.title | test("TITLE"; "i"))'

# Sonarr - check existing  
curl -s "http://localhost:8989/api/v3/series" \
  -H "X-Api-Key: 2f61c809f0064945bf5d05bdfe44af5a" | jq '.[] | select(.title | test("TITLE"; "i"))'
```

### 5. Confirm with user

Present findings:
- Title, year, synopsis
- Poster if available
- Already in library? Downloaded?
- Ask: "C'est bien ça ? Je l'ajoute ?"

### 6. Add to library

```bash
# Radarr - add movie
curl -s -X POST "http://localhost:7878/api/v3/movie" \
  -H "X-Api-Key: aa267f3d5f3841dbad4ddbb792f12eb8" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "TITLE",
    "tmdbId": TMDB_ID,
    "qualityProfileId": 1,
    "rootFolderPath": "/mnt/media/movies",
    "monitored": true,
    "addOptions": {"searchForMovie": true}
  }'

# Sonarr - add series
curl -s -X POST "http://localhost:8989/api/v3/series" \
  -H "X-Api-Key: 2f61c809f0064945bf5d05bdfe44af5a" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "TITLE",
    "tvdbId": TVDB_ID,
    "qualityProfileId": 1,
    "rootFolderPath": "/mnt/media/series",
    "monitored": true,
    "seasonFolder": true,
    "addOptions": {"searchForMissingEpisodes": true}
  }'
```

### 7. Trigger search (if not auto)

```bash
# Radarr - search for movie
curl -s -X POST "http://localhost:7878/api/v3/command" \
  -H "X-Api-Key: aa267f3d5f3841dbad4ddbb792f12eb8" \
  -H "Content-Type: application/json" \
  -d '{"name":"MoviesSearch","movieIds":[MOVIE_ID]}'

# Sonarr - search for series
curl -s -X POST "http://localhost:8989/api/v3/command" \
  -H "X-Api-Key: 2f61c809f0064945bf5d05bdfe44af5a" \
  -H "Content-Type: application/json" \
  -d '{"name":"SeriesSearch","seriesId":SERIES_ID}'
```

## Quality Profiles

| ID | Name | Use for |
|----|------|---------|
| 1 | HD-1080p | Default, preferred |

## Root Folders

- Movies: `/mnt/media/movies`
- Series: `/mnt/media/series`

### 8. Monitor and report status

After triggering search, check queue and report to user:

```bash
# Check queue for the movie/series
curl -s "http://localhost:7878/api/v3/queue" \
  -H "X-Api-Key: aa267f3d5f3841dbad4ddbb792f12eb8" | jq '.records[] | select(.movieId == MOVIE_ID) | {title, status, sizeleft, timeleft, indexer}'

# Check if file exists (download complete)
curl -s "http://localhost:7878/api/v3/movie/MOVIE_ID" \
  -H "X-Api-Key: aa267f3d5f3841dbad4ddbb792f12eb8" | jq '{title, hasFile, movieFile}'
```

### 9. Refresh Jellyfin library

**ALWAYS** refresh Jellyfin before telling the user the content is ready:

```bash
# Refresh Jellyfin library
curl -s -X POST "http://localhost:8096/Library/Refresh" \
  -H "X-Emby-Token: e1c596df69844eb0a4475cf64bd57359"

# Wait a few seconds for scan to complete
sleep 3
```

**Status reporting:**
- 🔍 Recherche en cours...
- 📥 Téléchargement en cours (X% - temps restant)
- ✅ Téléchargé et disponible sur Jellyfin (après refresh!)
- ❌ Aucune release trouvée (sera téléchargé automatiquement quand dispo)

If search fails:
1. Check indexer logs: `curl -s "http://localhost:7878/api/v3/log?page=1&pageSize=20" -H "X-Api-Key: ..." | jq '.records[]'`
2. Report the reason to user
3. Explain that it will auto-download when available

## Response Style

- Speak French
- Be concise
- Show poster when available (URL from API)
- Confirm before adding
- Report success/failure after adding
- **Always follow up** on download status
- Keep user informed of progress
