#!/bin/bash

set -e

echo "Production Deployment for wordsmashing"
echo "======================================"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "\n${YELLOW}Step 1: Syncing static files to R2${NC}"
R2_ENDPOINT="https://f76d25b8b86cfa5638f43016510d8f77.r2.cloudflarestorage.com"
SYNC_OPTS="--endpoint-url $R2_ENDPOINT --size-only"

aws s3 sync ./static s3://wordsmashingstatic/static $SYNC_OPTS
aws s3 sync ./gameon/static s3://wordsmashingstatic/gameon/static $SYNC_OPTS
aws s3 sync ./templates s3://wordsmashingstatic/templates $SYNC_OPTS

echo -e "${GREEN}✅ Static files synced to R2${NC}"

echo -e "\n${YELLOW}Step 2: Clearing Cloudflare cache${NC}"
# Clear v5games.com zone (for wordsmashing.v5games.com subdomain)
if [[ -n "$CLOUDFLARE_ZONE_V5GAMES" && -n "$CLOUDFLARE_API_TOKEN" ]]; then
    echo "Clearing v5games.com zone cache..."
    curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_V5GAMES/purge_cache" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        --data '{"hosts":["wordsmashing.v5games.com"]}' | jq -r '.success'
    echo -e "${GREEN}v5games.com cache cleared${NC}"
else
    echo -e "${YELLOW}Skipping v5games cache clear (add CLOUDFLARE_ZONE_V5GAMES and CLOUDFLARE_API_TOKEN to ~/.secretbashrc)${NC}"
fi
# Clear wordsmashing.com zone (for main domain if used)
if [[ -n "$CLOUDFLARE_ZONE_WORDSMASHING" && -n "$CLOUDFLARE_API_TOKEN" ]]; then
    echo "Clearing wordsmashing.com zone cache..."
    curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_WORDSMASHING/purge_cache" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        --data '{"purge_everything":true}' | jq -r '.success'
    echo -e "${GREEN}wordsmashing.com cache cleared${NC}"
fi

echo -e "\n${GREEN}Deployment complete!${NC}"
echo "Next: Upload and restart server"
