#!/bin/bash

set -euo pipefail

# Log file for audit trail
LOGFILE="/var/log/nftables_abuse.log"

# Check for root privileges
if [ "$EUID" -ne 0 ]; then
    echo "Error: This script must be run as root." >&2
    exit 1
fi

# Check if nftables.conf exists
if [ ! -f /etc/nftables.conf ]; then
    echo "Error: /etc/nftables.conf not found." >&2
    exit 1
fi

# Function to log messages to both stdout and the log file
log_msg() {
    local msg="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
    echo "$msg"
    echo "$msg" >> "$LOGFILE"
}

# Function to validate an IPv4 address
validate_ip() {
    local ip="$1"
    if [[ "$ip" =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}$ ]]; then
        IFS='.' read -r -a octets <<< "$ip"
        for octet in "${octets[@]}"; do
            if [ "$octet" -gt 255 ]; then
                return 1
            fi
        done
        return 0
    fi
    return 1
}

log_msg "Starting nftables abuse detection script."

# Backup nftables.conf before any modifications
cp /etc/nftables.conf "/etc/nftables.conf.bak.$(date +%s)"
log_msg "Backup of /etc/nftables.conf created."

# Run Command To Find IP Addresses With Invalid User Attempts Via SSH
invalid_ips=$(journalctl _COMM=sshd --since "1 month ago" | grep "Invalid user" | awk '{print $(NF-2)}' | sort | uniq -c | sort -nr)

# Define A Threshold For Subnet Block (More Than 10 Occurrences)
threshold=10

# Flag To Track If Any New Subnets Are Found
new_subnets_found=false

# Function To Extract Subnet From IP Address
get_subnet() {
    echo "$1" | cut -d. -f1-3
}

# Check if the comment line exists in nftables.conf
if grep -q "# Drop traffic from specific subnets" /etc/nftables.conf; then
    # Loop Through Each Line Of Invalid_IPs
    while read -r line; do
        [ -z "$line" ] && continue
        count=$(echo "$line" | awk '{print $1}')
        ip=$(echo "$line" | awk '{print $2}')

        # Validate the IP address
        if ! validate_ip "$ip"; then
            log_msg "Skipping invalid IP: $ip"
            continue
        fi

        # Check If Count Is Above Threshold
        if [ "$count" -gt "$threshold" ]; then
            subnet=$(get_subnet "$ip")

            # Check If Subnet Is Already Blocked In nftables.conf
            if grep -q "ip saddr $subnet.0/24 drop" /etc/nftables.conf; then
                log_msg "Subnet $subnet.0/24 is already blocked."
            else
                # Add subnet block rule to /etc/nftables.conf below the comment line with proper indentation
                sed -i "/# Drop traffic from specific subnets/a \        ip saddr $subnet.0/24 drop" /etc/nftables.conf
                log_msg "Adding rule to block subnet $subnet.0/24 (count: $count)"
                new_subnets_found=true
            fi
        fi
    done <<< "$invalid_ips"
else
    log_msg "Comment Line '# Drop Traffic From Specific Subnets' Not Found In /etc/nftables.conf"
fi

# Apply Changes To Nftables Configuration If New Subnets Were Found
if [ "$new_subnets_found" = true ]; then
    log_msg "Applying New Rules To nftables..."
    nft -f /etc/nftables.conf
    log_msg "Rules applied successfully."
else
    log_msg "No New Subnets Found. Not Applying Any Changes To nftables."
fi
