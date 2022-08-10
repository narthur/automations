export $(grep -v '^#' .env | xargs)

URL="https://www.beeminder.com/api/v1/users/${USERNAME}/goals/exercise.json?datapoints=true&auth_token=${AUTH_TOKEN}"

JSON=$(curl $URL)

DATE=$(echo $JSON | jq '.datapoints[-1].daystamp')

SUM=$(echo $JSON | jq ".datapoints | map(select(.daystamp == $DATE)) | reduce .[] as \$item (0; . + \$item.value) ")
VALUE=$(echo "-2.0 * $SUM" | bc -l)

POST_URL="https://www.beeminder.com/api/v1/users/${USERNAME}/goals/techtainment/datapoints.json"

curl -X POST $POST_URL -d auth_token=$AUTH_TOKEN -d daystamp=$DATE -d value=$VALUE -d requestid=$DATE -d comment="Earned via narthur/exercise"