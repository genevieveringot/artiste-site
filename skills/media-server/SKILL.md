---
name: media-server
description: Manage the home media server stack (Jellyfin, Plex, Radarr, Sonarr, Decypharr, AllDebrid). Use for any request about movies, series, downloads, streaming, Jellyseerr requests, indexers, or media server maintenance.
---

# Media Server Stack

Home media server running on Raspberry Pi at `192.168.1.106`.

## Quick Reference

| Service | Port | Purpose |
|---------|------|---------|
| Jellyfin | 8096 | Main streaming server |
| Plex | host | Alternative streaming |
| Jellyseerr | 5055 | Request interface |
| Radarr | 7878 | Movie management |
| Sonarr | 8989 | Series management |
| Bazarr | 6767 | Subtitles |
| Jackett | 9117 | Torrent indexer proxy |
| FlareSolverr | 8191 | Cloudflare bypass |
| Decypharr | 8282 | AllDebrid bridge |
| Prowlarr | 9696 | Indexer manager |
| Listenarr | 8787 | Watch stats |

## Architecture

```
User → Jellyseerr → Radarr/Sonarr → Jackett/Prowlarr → YggTorrent
                                            ↓
                                      Decypharr → AllDebrid (cloud download)
                                            ↓
                                      rclone WebDAV → /mnt/decypharr/alldebrid
                                            ↓
                                      Jellyfin/Plex (streaming)
```

## Key Paths

- **Stack directory**: `/home/maison/media-stack/`
- **Docker Compose**: `/home/maison/media-stack/docker-compose.yml`
- **Scripts**: `/home/maison/media-stack/scripts/`
- **Movies library**: `/mnt/media/movies` → `/mnt/decypharr/qbit/radarr`
- **Series library**: `/mnt/media/series` → `/mnt/decypharr/qbit/tv-sonarr`
- **AllDebrid mount**: `/mnt/decypharr/alldebrid/__all__` (FUSE, 1PB virtual)

## API Keys

```bash
# Radarr
curl -s "http://localhost:7878/api/v3/..." -H "X-Api-Key: aa267f3d5f3841dbad4ddbb792f12eb8"

# Sonarr
curl -s "http://localhost:8989/api/v3/..." -H "X-Api-Key: 2f61c809f0064945bf5d05bdfe44af5a"
```

## Common Operations

### Check movie status
```bash
curl -s "http://localhost:7878/api/v3/movie" -H "X-Api-Key: aa267f3d5f3841dbad4ddbb792f12eb8" | jq '.[] | select(.title | test("MOVIE_NAME"; "i"))'
```

### Search for movie
```bash
curl -s -X POST "http://localhost:7878/api/v3/command" -H "X-Api-Key: aa267f3d5f3841dbad4ddbb792f12eb8" -H "Content-Type: application/json" -d '{"name":"MoviesSearch","movieIds":[MOVIE_ID]}'
```

### Check services
```bash
docker ps --format "table {{.Names}}\t{{.Status}}"
```

### Restart a service
```bash
cd /home/maison/media-stack && docker compose restart SERVICE_NAME
```

### Check mount health
```bash
ls /mnt/decypharr/alldebrid/__all__
df -h /mnt/decypharr/alldebrid
```

### Trigger Decypharr repair
```bash
curl -X POST http://localhost:8282/api/repair
```

### Scan Jellyfin library
```bash
/home/maison/media-stack/scripts/jellyfin-scan.sh
```

## Monitoring Services (systemd)

| Service | Purpose |
|---------|---------|
| mount-watchdog | Monitors rclone mount, restarts Decypharr if down |
| repair-monitor | Auto-repairs expired AllDebrid links |
| radarr-notifier | Discord notification when movie not found |
| symlink-repair.timer | Hourly symlink repair |
| playback-repair | Fixes Jellyfin playback errors |

```bash
# Check status
systemctl status mount-watchdog repair-monitor radarr-notifier

# View logs
journalctl -u mount-watchdog -f
```

## Custom Formats (Radarr/Sonarr)

Profile `HD-1080p` configured with:
- **MULTi**: +100 points (prefer multilingual releases)
- **VF Only**: -10000 points (reject French-only releases)

## Discord Webhook

Notifications sent to: `https://discord.com/api/webhooks/1467261296771596445/...`

Events: mount issues, auto-repairs, movies not found, symlink repairs.

## Troubleshooting

### Movie stuck "downloading"
1. Check Decypharr logs: `docker logs decypharr --tail 50`
2. Verify mount: `ls /mnt/decypharr/alldebrid/__all__`
3. Trigger repair: `curl -X POST http://localhost:8282/api/repair`

### No releases found
- Film might be too new (not available on trackers yet)
- Check indexer status in Radarr → Settings → Indexers
- Verify FlareSolverr: `docker logs flaresolverr --tail 20`

### Jellyfin shows errors
1. Check if files exist: `ls -la /mnt/media/movies/FILM_NAME/`
2. If symlink broken, wait for auto-repair or run manually
3. Force library scan: `/home/maison/media-stack/scripts/jellyfin-scan.sh`
