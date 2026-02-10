---
name: debrid-links
description: Generate AllDebrid streaming/download links for movies and TV shows. Use when user asks for debrid links, streaming links, download links, or AllDebrid links for any media content.
---

# Debrid Links

Generate direct AllDebrid download/streaming links for movies and TV series.

## Quick Reference

**API Endpoint:** `https://api.alldebrid.com/v4.1/`
**API Key:** Stored in Decypharr config at `/config/config.json`

## Workflow

### 1. Identify the Media

For **movies**: Search Radarr (`/api/v3/movie`)
For **series**: Search Sonarr (`/api/v3/series` then `/api/v3/episode`)

### 2. Check AllDebrid Magnets

```bash
curl -s "https://api.alldebrid.com/v4.1/magnet/status?agent=openclaw&apikey=$API_KEY" | \
  jq '.data.magnets[] | select(.filename | test("SEARCH_TERM"; "i"))'
```

### 3. If No Magnets Found → Add Torrents

Search Jackett and upload:
```bash
# Search
curl -s "http://localhost:9117/api/v2.0/indexers/yggcookie-turbo/results?apikey=$JACKETT_KEY&Query=TITLE"

# Download torrent and upload to AllDebrid
curl -s -X POST "https://api.alldebrid.com/v4.1/magnet/upload/file?agent=openclaw&apikey=$API_KEY" \
  -F "files[]=@/tmp/torrent.torrent"
```

### 4. Get Download Links

```bash
# Get files from magnet
curl -s "https://api.alldebrid.com/v4.1/magnet/files?agent=openclaw&apikey=$API_KEY&id[]=$MAGNET_ID"

# Unlock link
curl -s "https://api.alldebrid.com/v4.1/link/unlock?agent=openclaw&apikey=$API_KEY&link=$FILE_LINK"
```

### 5. Format Output

Present links cleanly:
```
**🎬 Title**

**E01** - <https://xxx.debrid.it/dl/xxx/filename.mkv>
**E02** - <https://xxx.debrid.it/dl/xxx/filename.mkv>
```

## API Keys Location

```bash
# AllDebrid API Key
docker exec decypharr cat /config/config.json | jq -r '.debrids[0].api_key'

# Jackett API Key
docker exec jackett cat /config/Jackett/ServerConfig.json | jq -r '.APIKey'

# Sonarr API Key
curl -s "http://localhost:8989/api/v3/series" -H "X-Api-Key: 2f61c809f0064945bf5d05bdfe44af5a"

# Radarr API Key
curl -s "http://localhost:7878/api/v3/movie" -H "X-Api-Key: aa267f3d5f3841dbad4ddbb792f12eb8"
```

## Helper Script

Use `scripts/get-debrid-links.sh` for quick link generation.
