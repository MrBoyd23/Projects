#!/bin/bash

set -euo pipefail

# List of skill names
skills=(
    PHP CSS API SEO AWS HTML Linux MySQL Apache cPanel Plesk
    Ansible Python Node React JavaScript Jira GitHub Grafana Prometheus
    ServiceNow LivePerson WordPress phpMyAdmin E-Commerce Web_Design
    Linux_Admin Node_Package_Name Website_Analytics Online_Marketing Online_Advertising
    Data_Analytics Digital_Marketing Bash_Scripting
)

# Loop through each skill name
for skill in "${skills[@]}"; do
    # Lowercase skill name for filename and const variable
    file_name=$(echo "$skill" | tr '[:upper:]' '[:lower:]')

    # Capitalized skill name with spaces replaced by underscores for component name
    component_name=$(echo "$skill" | sed -E 's/ /_/g')

    # Update the component file if it exists
    file_path="${file_name}.js"

    if [ -f "$file_path" ]; then
        echo "Updating file: ${file_name}.js"

        # Use sed to update the existing file (creating .bak backups)
        sed -i.bak "3s/.*/const ${component_name} = () => {/" "$file_path"
        sed -i.bak "6s/.*/            <h2>${skill} Details<\/h2>/" "$file_path"
        sed -i.bak "7s/.*/            <p>Details about ${skill}...<\/p>/" "$file_path"
        sed -i.bak "10s/.*/export default ${component_name};/" "$file_path"

        echo "Updated ${file_name}.js"
    else
        echo "File ${file_name}.js not found. Skipping."
    fi
done

