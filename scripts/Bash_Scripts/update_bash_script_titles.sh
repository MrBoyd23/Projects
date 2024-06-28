#!/bin/bash

# Define the directory where you want to search for .sh files
directory="/home/scripts"

# Use find command to locate all .sh files and exclude the first line if it contains #!/bin/bash
find "$directory" -type f -name '*.sh' -exec \
    awk 'NR==1 && /^#!/ {print; next} /^\s*#/ {print toupper($0); next} /echo\s+"([^"]*)"/ {gsub(/"[^"]*"/, toupper(substr($0, index($0, "\""))))} 1' {} \;

