#!/bin/bash
# ═══════════════════════════════════════════════════════
# IndexNow Submission Script for Vosuba
# Submits all site URLs to Bing, DuckDuckGo, Yandex
# via the IndexNow API for immediate crawl/index
#
# Usage: bash submit-indexnow.sh
# ═══════════════════════════════════════════════════════

INDEXNOW_KEY="dd54894513094f12bc6b0d2eda46d788"
HOST="vosuba.com"
KEY_LOCATION="https://${HOST}/${INDEXNOW_KEY}.txt"

# All pages to submit
URLS=(
    "https://${HOST}/"
    "https://${HOST}/download.html"
    "https://${HOST}/for-creators.html"
    "https://${HOST}/for-universities.html"
    "https://${HOST}/for-regulated-industries.html"
    "https://${HOST}/vs-descript.html"
    "https://${HOST}/vs-capcut.html"
    "https://${HOST}/vs-rev.html"
    "https://${HOST}/vs-submagic.html"
    "https://${HOST}/vs-macwhisper.html"
    "https://${HOST}/vs-captions-ai.html"
    "https://${HOST}/guide-ai-captioning.html"
    "https://${HOST}/guide-voiceover.html"
    "https://${HOST}/guide-accessibility-captioning.html"
    "https://${HOST}/guide-offline-subtitles.html"
    "https://${HOST}/feature-batch-subtitles.html"
    "https://${HOST}/feature-voiceover-studio.html"
    "https://${HOST}/feature-accessibility-compliance.html"
    "https://${HOST}/cookies.html"
    "https://${HOST}/terms.html"
    "https://${HOST}/refund.html"
)

# Build JSON payload
URL_LIST=""
for url in "${URLS[@]}"; do
    URL_LIST="${URL_LIST}\"${url}\","
done
URL_LIST="${URL_LIST%,}"  # Remove trailing comma

PAYLOAD="{
  \"host\": \"${HOST}\",
  \"key\": \"${INDEXNOW_KEY}\",
  \"keyLocation\": \"${KEY_LOCATION}\",
  \"urlList\": [${URL_LIST}]
}"

echo "📡 Submitting ${#URLS[@]} URLs to IndexNow..."
echo ""

# Submit to IndexNow API (shared by Bing, DuckDuckGo, Yandex)
ENDPOINTS=(
    "https://api.indexnow.org/indexnow"
    "https://www.bing.com/indexnow"
    "https://yandex.com/indexnow"
)

for endpoint in "${ENDPOINTS[@]}"; do
    echo "→ Submitting to ${endpoint}..."
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
        -X POST "${endpoint}" \
        -H "Content-Type: application/json; charset=utf-8" \
        -d "${PAYLOAD}")
    
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "202" ]; then
        echo "  ✅ Success (HTTP ${HTTP_CODE})"
    else
        echo "  ⚠️  Response: HTTP ${HTTP_CODE}"
    fi
done

echo ""
echo "✅ IndexNow submission complete!"
echo ""
echo "Notes:"
echo "  • HTTP 200/202 = accepted for processing"
echo "  • HTTP 429 = too many requests (try again later)"
echo "  • The key file must be accessible at: ${KEY_LOCATION}"
echo "  • Run this script after every deploy to re-notify search engines"
