#!/bin/bash

# Define the directory to search
directory="playbooks"

# Find all .yml files and process with sed
find "$directory" -type f -name '*.yml' -exec sed -i '/^\s*- name: /{ s/^\(\s*- name: \)\(.*\)/\1\U\2/ }' {} +

