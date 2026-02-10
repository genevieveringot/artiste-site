#!/bin/bash
# Get AllDebrid links for a movie or TV series
# Usage: ./get-debrid-links.sh "Title" [season] [episode]
# Examples:
#   ./get-debrid-links.sh "Fallout" 2           # All S02 episodes
#   ./get-debrid-links.sh "Fallout" 2 3         # S02E03 only
#   ./get-debrid-links.sh "Oppenheimer"         # Movie

set -e

TITLE="$1"
SEASON="${2:-}"
EPISODE="${3:-}"

# API Keys
AD_KEY=$(docker exec decypharr cat /config/config.json 2>/dev/null | jq -r '.debrids[0].api_key')
JACKETT_KEY=$(docker exec jackett cat /config/Jackett/ServerConfig.json 2>/dev/null | jq -r '.APIKey')

if [ -z "$TITLE" ]; then
    echo "Usage: $0 \"Title\" [season] [episode]"
    exit 1
fi

# Build search query
if [ -n "$SEASON" ] && [ -n "$EPISODE" ]; then
    QUERY="${TITLE} S$(printf '%02d' $SEASON)E$(printf '%02d' $EPISODE)"
elif [ -n "$SEASON" ]; then
    QUERY="${TITLE} S$(printf '%02d' $SEASON)"
else
    QUERY="$TITLE"
fi

echo "🔍 Searching: $QUERY"
echo ""

# Check existing magnets on AllDebrid
MAGNETS=$(curl -s "https://api.alldebrid.com/v4.1/magnet/status?agent=openclaw&apikey=$AD_KEY" | \
    jq -r --arg q "$TITLE" '.data.magnets[] | select(.filename | test($q; "i")) | "\(.id)|\(.filename)"')

if [ -z "$MAGNETS" ]; then
    echo "⚠️ No existing magnets found. Searching Jackett..."
    
    # Search Jackett
    RESULTS=$(curl -s "http://localhost:9117/api/v2.0/indexers/yggcookie-turbo/results?apikey=$JACKETT_KEY&Query=$(echo "$QUERY 1080p" | sed 's/ /+/g')" | \
        jq -r '.Results | sort_by(.Seeders) | reverse | .[0:5]')
    
    if [ "$RESULTS" = "[]" ] || [ -z "$RESULTS" ]; then
        echo "❌ No torrents found on Jackett"
        exit 1
    fi
    
    echo "📥 Adding torrents to AllDebrid..."
    
    # Download and upload top results
    echo "$RESULTS" | jq -r '.[].Link' | while read -r LINK; do
        if [ -n "$LINK" ] && [ "$LINK" != "null" ]; then
            TMPFILE=$(mktemp --suffix=.torrent)
            curl -s -o "$TMPFILE" "$LINK"
            curl -s -X POST "https://api.alldebrid.com/v4.1/magnet/upload/file?agent=openclaw&apikey=$AD_KEY" \
                -F "files[]=@$TMPFILE" > /dev/null
            rm -f "$TMPFILE"
        fi
    done
    
    sleep 3
    
    # Re-fetch magnets
    MAGNETS=$(curl -s "https://api.alldebrid.com/v4.1/magnet/status?agent=openclaw&apikey=$AD_KEY" | \
        jq -r --arg q "$TITLE" '.data.magnets[] | select(.filename | test($q; "i")) | "\(.id)|\(.filename)"')
fi

if [ -z "$MAGNETS" ]; then
    echo "❌ Failed to get magnets"
    exit 1
fi

echo "🔗 Generating links..."
echo ""

# Get links for each magnet
echo "$MAGNETS" | while IFS='|' read -r ID FILENAME; do
    # Get file link
    FILES=$(curl -s "https://api.alldebrid.com/v4.1/magnet/files?agent=openclaw&apikey=$AD_KEY&id[]=$ID")
    FILE_LINK=$(echo "$FILES" | jq -r '.data.magnets[0].files[0].l // .data.magnets[0].files[0].link // empty')
    
    if [ -n "$FILE_LINK" ] && [ "$FILE_LINK" != "null" ]; then
        # Unlock link
        UNLOCKED=$(curl -s "https://api.alldebrid.com/v4.1/link/unlock?agent=openclaw&apikey=$AD_KEY&link=$FILE_LINK")
        DOWNLOAD_LINK=$(echo "$UNLOCKED" | jq -r '.data.link')
        
        if [ -n "$DOWNLOAD_LINK" ] && [ "$DOWNLOAD_LINK" != "null" ]; then
            echo "**${FILENAME}**"
            echo "<$DOWNLOAD_LINK>"
            echo ""
        fi
    fi
done
