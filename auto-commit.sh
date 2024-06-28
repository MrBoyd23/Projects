#!/bin/bash
#Useful Only When Making Edits Locally And No Other Users Make Changes To Your Repository 

# FUNCTION TO SHOW A PROGRESS SPINNER
function show_spinner() {
    local pid=$1
    local delay=0.2
    local spinstr='▁▃▄▅▆▇█▇▆▅▄▃'
    while ps -p $pid > /dev/null; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

# RUN GIT FETCH IN THE BACKGROUND AND SHOW A SPINNER
git fetch &
show_spinner $!

# CHECK IF THERE ARE ANY CHANGES ON THE REMOTE
if ! git diff --quiet HEAD..origin/$(git rev-parse --abbrev-ref HEAD); then
    # STASH ANY LOCAL CHANGES
    git stash

    # PULL CHANGES FROM THE REMOTE REPOSITORY
    git pull

    # MERGE THE STASHED CHANGES
    git stash pop
fi

# RUN GIT STATUS AND CAPTURE THE OUTPUT
status_output=$(git status --porcelain)

# CHECK IF THERE ARE UNTRACKED FILES OR CHANGES TO BE COMMITTED
if [[ -n "$status_output" ]]; then
    # ADD ALL CHANGES
    git add -A
    
    # GET THE LIST OF FILES BEING ADDED
    files=$(git diff --cached --name-only)
    
    # DETERMINE THE COMMIT MESSAGE BASED ON THE NUMBER OF FILES
    file_count=$(echo "$FILES" | wc -l)
    if (( file_count > 2 )); then
        commit_message="Updating Mass Files in Repository"
    else
        commit_message="Adding: $files"
    fi
    
    # COMMIT THE CHANGES
    git commit -m "$commit_message"
    
    # PUSH THE CHANGES
    git push

    # OUTPUT THE RESULTS
    echo "CHANGES HAVE BEEN PUSHED TO THE REPOSITORY."
else
    echo "NO CHANGES TO COMMIT."
fi

