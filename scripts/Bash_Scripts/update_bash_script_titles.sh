#!/bin/bash

set -euo pipefail

# Define the directory where you want to search for .sh files
directory="/home/scripts"

# Check if directory exists
if [ ! -d "$directory" ]; then
    echo "Error: Directory '$directory' does not exist." >&2
    exit 1
fi

# Find all .sh files and uppercase comment lines (except shebang), modifying in place
find "$directory" -type f -name '*.sh' -print0 | while IFS= read -r -d '' file; do
    echo "Processing: $file"
    awk '
        NR==1 && /^#!/ { print; next }
        /^\s*#/ { print toupper($0); next }
        { print }
    ' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
done

echo "Bash script comment titles updated successfully."

