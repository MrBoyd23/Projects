#!/bin/bash

# Function to show a progress spinner
function show_spinner() {
    local pid=$1
    local delay=0.1
    local spinstr='🕛🕐🕑🕒🕓🕔🕕🕖🕗🕘🕙🕚'
    local i=0
    while ps -p $pid > /dev/null; do
        local temp=${spinstr:i++%${#spinstr}:1}
        printf " [%s]  " "$temp"
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

# Run git fetch in the background and show a spinner
echo
echo "Fetching Latest Changes From Remote Repository..."
git fetch &
show_spinner $!
echo

# Check if there are any changes on the remote
if ! git diff --quiet HEAD..origin/$(git rev-parse --abbrev-ref HEAD); then
    # Stash any local changes
    git stash

    # Pull changes from the remote repository
    git pull

    # Merge the stashed changes
    git stash pop
fi

# Run git status and capture the output
status_output=$(git status --porcelain)

# Check if there are untracked files or changes to be committed
if [[ -n "$status_output" ]]; then
    # Add all changes
    git add -A
    
    # Get the list of files being added
    files=$(git diff --cached --name-only)
    
    # Determine the commit message based on the number of files
    file_count=$(echo "$files" | wc -l)
    if (( file_count > 2 )); then
        commit_message="Updating Mass Files in Repository"
    else
        commit_message="Adding: $files"
    fi
    
    # Commit the changes
    git commit -m "$commit_message"
    
    # Push the changes
    git push

    # Output the results
    echo
    echo "CHANGES HAVE BEEN PUSHED TO THE REPOSITORY."
    echo
else
    echo
    echo "NO CHANGES TO COMMIT."
    echo
fi

