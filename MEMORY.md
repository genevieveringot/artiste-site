# MEMORY.md - Long-term Memory

## Nicolas (User)
- Wants things done, not explanations
- Gets frustrated with repeated failures - fix problems completely
- Uses French, prefers direct communication
- YGG account: Kapliphe (reminded him to change password after sharing it)

## Media Server Stack
- **Sonarr** (8989) - TV series management
- **Radarr** (7878) - Movie management  
- **Prowlarr** (9696) - Indexer manager (often unreliable)
- **Jackett** (9117) - Indexer proxy with FlareSolverr
- **Decypharr** (8282) - AllDebrid integration for Arr apps
- **Jellyfin** (8096) / **Plex** (32400) - Media streaming
- **FlareSolverr** (8191) - Cloudflare bypass

## Key Learnings

### YGG/Jackett Cookie Issues
When Jackett YGG fails with "Login failed: Selector didn't match":
1. Cookie expired - need to regenerate via FlareSolverr
2. Use FlareSolverr POST to login endpoint with credentials
3. Update cookie in Jackett config and restart

### AllDebrid API
- Use v4.1 (v4 deprecated with DISCONTINUED error)
- Links expire after 3 days (auto_expire_links_after in Decypharr)
- To regenerate: upload torrent → get magnet ID → get files → unlock link

### Indexer Priority
1. **Jackett Turbo** - Most reliable, uses FlareSolverr
2. **YggAPI Prowlarr** - Often fails with 404
3. **YggAPI RSS** - RSS only, no search capability

## Skills Created
- `debrid-links` - Generate AllDebrid streaming links for media
