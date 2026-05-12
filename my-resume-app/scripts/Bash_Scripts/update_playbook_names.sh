#!/bin/bash

set -euo pipefail

# Define the directory to search
directory="playbooks"

# Check if directory exists
if [ ! -d "$directory" ]; then
    echo "Error: Directory '$directory' does not exist." >&2
    exit 1
fi

# Find all .yml files and process with sed (creating .bak backups)
find "$directory" -type f -name '*.yml' -exec sed -i.bak '/^\s*- name: /{ s/^\(\s*- name: \)\(.*\)/\1\U\2/ }' {} +

echo "Playbook names updated successfully."

