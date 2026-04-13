#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
SECRETS_FILE="$HOME/.secrets"

# Source secrets (expects export ADS_API_KEY=...)
if [[ -r "$SECRETS_FILE" ]]; then
  set -a
  source "$SECRETS_FILE"
  set +a
fi

# Inject ADS token into app.js for this deploy (reverted after)
APP_JS="$REPO_DIR/app.js"
BACKUP="$APP_JS.bak"
cp "$APP_JS" "$BACKUP"

if [[ -n "${ADS_API_KEY:-}" ]]; then
  sed -i '' "s|var ADS_TOKEN = \"\";|var ADS_TOKEN = \"$ADS_API_KEY\";|" "$APP_JS"
  echo "Injected ADS_API_KEY (${#ADS_API_KEY} chars)"
else
  echo "Warning: ADS_API_KEY not set; publications will show fallback link"
fi

# Cloudflare auth (global API key)
unset CLOUDFLARE_API_TOKEN 2>/dev/null || true
export CLOUDFLARE_EMAIL="jfaber@caltech.edu"
export CLOUDFLARE_API_KEY="$(tr -d '\n\r\t ' < "$HOME/.cloudflare_global_api_key")"

# Deploy
npx wrangler pages deploy "$REPO_DIR" --project-name=jakobtfaber-com --commit-dirty=true

# Restore app.js so the token isn't left in the working tree
mv "$BACKUP" "$APP_JS"
echo "Restored app.js (token removed from working tree)"
