#!/bin/bash

set -e
cd "$(dirname "$0")"

echo "Production Deployment for wordsmashing"
echo "======================================"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "\n${YELLOW}Step 1: Building client templates${NC}"
node scripts/build-templates.js
STATIC_V=$(python3 static_version.py)
echo "static version (?v=): $STATIC_V"

echo -e "\n${YELLOW}Step 2: Syncing static files to R2${NC}"
R2_ENDPOINT="https://f76d25b8b86cfa5638f43016510d8f77.r2.cloudflarestorage.com"
SYNC_OPTS=(--endpoint-url "$R2_ENDPOINT" --cache-control "public, max-age=3600" --exclude "*.psd" --exclude ".DS_Store")

aws s3 sync ./static s3://wordsmashingstatic/static "${SYNC_OPTS[@]}"
aws s3 sync ./gameon/static s3://wordsmashingstatic/gameon/static "${SYNC_OPTS[@]}"
aws s3 sync ./templates s3://wordsmashingstatic/templates "${SYNC_OPTS[@]}"

echo -e "${GREEN}✅ Static files synced to R2${NC}"

if [[ "${RESTART:-1}" == "1" ]] && command -v supervisorctl >/dev/null; then
    echo -e "\n${YELLOW}Step 3: Restarting app so pages reference ?v=$STATIC_V${NC}"
    sudo supervisorctl restart wordsmashing
fi

echo -e "\n${YELLOW}Step 4: Clearing Cloudflare cache${NC}"
source ~/.secretbashrc >/dev/null 2>&1 || true
if [[ -n "${CLOUDFLARE_API_TOKEN:-}" ]]; then
    CF_AUTH=(-H "Authorization: Bearer $CLOUDFLARE_API_TOKEN")
else
    CF_AUTH=(-H "X-Auth-Email: ${CLOUDFLARE_EMAIL:-}" -H "X-Auth-Key: ${CLOUDFLARE_API_KEY:-}")
fi
cf_purge() {
    curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$1/purge_cache" "${CF_AUTH[@]}" \
        -H "Content-Type: application/json" --data "$2" | jq -r '.success'
}
# HTML on wordsmashing.v5games.com is edge-cached; assets are busted by ?v=
if [[ -n "${CLOUDFLARE_ZONE_V5GAMES:-}" ]]; then
    echo "v5games.com host purge: $(cf_purge "$CLOUDFLARE_ZONE_V5GAMES" '{"hosts":["wordsmashing.v5games.com"]}')"
fi
if [[ -n "${CLOUDFLARE_ZONE_WORDSMASHING:-}" ]]; then
    echo "wordsmashing.com host purge: $(cf_purge "$CLOUDFLARE_ZONE_WORDSMASHING" '{"hosts":["wordsmashing.com","www.wordsmashing.com","wordsmashingstatic.wordsmashing.com"]}')"
fi


echo -e "\n${GREEN}Deployment complete! static v=$STATIC_V${NC}"
