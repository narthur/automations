#!/bin/bash

ENV_FILE=".env"

# Backup existing .env file if it exists
if [ -f "$ENV_FILE" ]; then
  mv "$ENV_FILE" "${ENV_FILE}.bak"
fi

# Create a new .env file with auto-generated variables
echo "# This file is auto-generated with placeholder values" > "$ENV_FILE"
while IFS= read -r -d '' file; do
  grep -Eo 'env\((\"|\x27)[A-Za-z0-9_]+(\"|\x27)\)' "$file" | sed -E 's/env\((\"|\x27)([A-Za-z0-9_]+)(\"|\x27)\)/\2=<placeholder_value>/' >> "$ENV_FILE"
done < <(git ls-files --exclude-standard --cached --others -z)

# Merge existing .env file if backup exists
if [ -f "${ENV_FILE}.bak" ]; then
  echo "" >> "$ENV_FILE"
  echo "# Variables from existing .env file" >> "$ENV_FILE"
  cat "${ENV_FILE}.bak" >> "$ENV_FILE"
  rm "${ENV_FILE}.bak"
fi

# Add info message about defining references in checked-in code
echo ""
echo "This script may miss references defined in the following ways:"
echo "  - In a file that is not checked into git"
echo "  - Without using the env() function"
echo "  - Without specifying the variable name directly (e.g. using a variable)"
