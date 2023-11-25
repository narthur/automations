# https://apis.guru/
# https://rapidapi.com/hub

SCRIPTS_DIR=$(dirname "$0")
PATHS=$(find $SCRIPTS_DIR/../src -type f -iname 'spec.yaml')

for path in $PATHS; do
    echo "Generating OpenAPI client for $path"
    pnpm openapi \
        --input $path \
        --output $(dirname "$path")/__generated__ \
        --client axios
done