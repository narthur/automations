SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

source $SCRIPT_DIR/env.sh

URL="https://api.track.toggl.com/api/v9/me/time_entries"

ENTRIES=$(curl $URL -u $TOGGL_API_TOKEN:api_token)

DATE=$(date +%Y-%m-%d)

echo $DATE

PATTERN=". | map(select(true)) | reduce .[] as \$item (0; . + \$item.duration)"

SUM=$(echo $ENTRIES | jq "$PATTERN")

echo $SUM