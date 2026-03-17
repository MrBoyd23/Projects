#!/bin/bash

# ─────────────────────────────────────────────
# Function to show a progress spinner
# ─────────────────────────────────────────────
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

# ─────────────────────────────────────────────
# Fetch latest changes from remote
# ─────────────────────────────────────────────
echo
echo "Fetching Latest Changes From Remote Repository..."
echo
git fetch &
show_spinner $!
echo

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# ─────────────────────────────────────────────
# Sync with remote — LOCAL ALWAYS TAKES PRECEDENCE
# Strategy: merge remote into local, resolve all conflicts in favour of ours
# ─────────────────────────────────────────────
if ! git diff --quiet HEAD..origin/"$CURRENT_BRANCH" 2>/dev/null; then

    # Stash any uncommitted local changes so they survive the merge
    STASH_RESULT=$(git stash 2>&1)
    STASHED=false
    if echo "$STASH_RESULT" | grep -q "Saved working directory"; then
        STASHED=true
    fi

    # Merge remote changes; if conflicts arise, keep OUR version for every file
    git merge --no-ff --no-commit origin/"$CURRENT_BRANCH" 2>/dev/null || true

    # Resolve every conflict by preferring the local (ours) version
    CONFLICTED=$(git diff --name-only --diff-filter=U 2>/dev/null)
    if [[ -n "$CONFLICTED" ]]; then
        echo "Conflicts detected — keeping local versions for:"
        while IFS= read -r conflict_file; do
            echo "  • $conflict_file"
            git checkout --ours -- "$conflict_file"
            git add "$conflict_file"
        done <<< "$CONFLICTED"
    fi

    # Finalise the merge commit (if one is pending)
    git merge --continue --no-edit 2>/dev/null || true

    # Restore stashed local changes on top
    if $STASHED; then
        git stash pop 2>/dev/null || true
    fi
fi

# ─────────────────────────────────────────────
# Detect local changes to commit & push
# ─────────────────────────────────────────────
status_output=$(git status --porcelain)

if [[ -n "$status_output" ]]; then

    git add -A

    # Build file list and counts
    files=$(git diff --cached --name-only)
    file_count=$(echo "$files" | grep -c .)

    # ── Commit message logic ──────────────────
    if (( file_count > 5 )); then
        # Detailed commit message: group files by directory / extension
        declare -A dir_map
        while IFS= read -r f; do
            dir=$(dirname "$f")
            dir_map["$dir"]+="$(basename "$f"), "
        done <<< "$files"

        body=""
        for dir in "${!dir_map[@]}"; do
            # Trim trailing comma+space
            entries="${dir_map[$dir]%, }"
            body+=$'\n'"  [$dir]: $entries"
        done

        # Count distinct extensions for a summary tag
        ext_summary=$(echo "$files" | grep -oE '\.[^./]+$' | sort -u | tr '\n' '/' | sed 's|/$||')
        [[ -z "$ext_summary" ]] && ext_summary="misc"

        commit_message="chore: bulk update $file_count files ($ext_summary)

Files changed:$body

- Local state preserved over remote on all conflicts
- $(date '+%Y-%m-%d %H:%M %Z')"

    elif (( file_count > 2 )); then
        commit_message="Updating Mass Files in Repository"
    else
        commit_message="Adding: $files"
    fi

    # ── Attempt commit ────────────────────────
    commit_output=$(git commit -m "$commit_message" 2>&1)
    commit_exit=$?

    if (( commit_exit != 0 )); then
        echo
        echo "❌ COMMIT FAILED — changes were NOT pushed."
        echo

        # Parse and surface the specific reason without dumping raw git noise
        if echo "$commit_output" | grep -qi "nothing to commit"; then
            echo "   Reason: Nothing new to commit (working tree already clean)."
        elif echo "$commit_output" | grep -qi "unmerged"; then
            echo "   Reason: Unresolved merge conflicts remain in the working tree."
        elif echo "$commit_output" | grep -qi "pre-commit\|hook"; then
            echo "   Reason: A pre-commit hook rejected the commit."
            # Show only the hook's own output, not internal git boilerplate
            hook_msg=$(echo "$commit_output" | grep -v "^error:\|^hint:\|Aborting")
            [[ -n "$hook_msg" ]] && echo "$hook_msg"
        elif echo "$commit_output" | grep -qi "large file\|file size"; then
            echo "   Reason: One or more files exceed the repository size limit."
        elif echo "$commit_output" | grep -qi "gpg\|sign"; then
            echo "   Reason: GPG commit signing failed. Check your signing key."
        else
            # Fallback: show the first meaningful error line only
            first_error=$(echo "$commit_output" | grep -m1 "^error:\|^fatal:" | sed 's/^error: //;s/^fatal: //')
            if [[ -n "$first_error" ]]; then
                echo "   Reason: $first_error"
            else
                echo "   Reason: Unknown — run 'git status' for more details."
            fi
        fi
        echo
        exit 1
    fi

    # ── Push — force-with-lease so local wins without clobbering others ──
    push_output=$(git push --force-with-lease 2>&1)
    push_exit=$?

    if (( push_exit != 0 )); then
        echo
        echo "❌ PUSH FAILED — commit was saved locally but not sent to remote."
        echo

        if echo "$push_output" | grep -qi "stale info\|force-with-lease"; then
            echo "   Reason: Remote was updated since your last fetch. Re-run the script to re-sync."
        elif echo "$push_output" | grep -qi "protected\|denied\|permission"; then
            echo "   Reason: Push was rejected — branch may be protected or you lack write access."
        elif echo "$push_output" | grep -qi "no upstream\|no such remote"; then
            echo "   Reason: No upstream branch configured. Set one with 'git push -u origin $CURRENT_BRANCH'."
        else
            first_push_error=$(echo "$push_output" | grep -m1 "^error:\|^fatal:" | sed 's/^error: //;s/^fatal: //')
            [[ -n "$first_push_error" ]] && echo "   Reason: $first_push_error" || echo "   Reason: Unknown — run 'git push' manually for details."
        fi
        echo
        exit 1
    fi

    echo
    echo "✅ CHANGES HAVE BEEN PUSHED TO THE REPOSITORY."
    echo

else
    echo
    echo "NO CHANGES TO COMMIT."
    echo
fi
