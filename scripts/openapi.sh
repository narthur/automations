# https://apis.guru/
# https://rapidapi.com/hub

SCRIPTS_DIR=$(dirname "$0")

pnpm openapi \
    --input $SCRIPTS_DIR/../src/services/taskratchet/spec.yaml \
    --output $SCRIPTS_DIR/../src/services/taskratchet/__generated__ \
    --client axios